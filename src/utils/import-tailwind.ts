import { addVitePlugin, useNuxt } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import type { Plugin } from 'vite';
import { green, magenta, yellow } from 'yoctocolors';


const Builder    = '@nuxt/vite-builder';
const VitePlugin = '@tailwindcss/vite';
const PostPlugin = '@tailwindcss/postcss';


export type ImportTailwindOptions = {
  disableSourceMapWarningsFor?: string[];
};


/**
 * Installs the Tailwind PostCSS or Vite plugin, depending on what's needed.
 */
export async function importTailwind(nuxt: Nuxt = useNuxt(), options?: ImportTailwindOptions) {
  addVitePlugin(
    disableInvalidSourcemapWarningsPlugin(options),
  );

  await disableCssNanoCalcPlugin(nuxt);

  if (nuxt.options.builder === Builder) {
    if (!checkVitePlugins(nuxt.options.vite.plugins ?? [])) {
      await import(VitePlugin).then(
        (tailwind) => addVitePlugin(tailwind.default()),
      );
    }
  }
  else {
    nuxt.options.postcss ??= { plugins: {}, order: [] };
    nuxt.options.postcss.plugins ??= {};

    if (!nuxt.options.postcss.plugins[PostPlugin]) {
      nuxt.options.postcss.plugins[PostPlugin] = {};
    }
  }
}


function checkVitePlugins(plugins: unknown[]): boolean {
  return plugins.some((entry) => {
    if (Array.isArray(entry)) {
      return checkVitePlugins(entry);
    }

    return entry
      && typeof entry === 'object'
      && 'name' in entry
      && typeof entry.name === 'string'
      && entry.name.startsWith(VitePlugin);
  });
}


/**
 * What it says on the tin - disables the "calc" plugin in CSSNano, as it causes a lot
 * of needless warnings with this module due to the mixing of calc + CSS level 5 color
 * functions. A descriptive warning is provided if this cannot be done automatically,
 * and an explicit `calc: true` in the plugin preset's configuration will be honored.
 */
async function disableCssNanoCalcPlugin(nuxt: Nuxt) {
  if (!nuxt.options.postcss?.plugins?.cssnano) {
    return;
  }

  const currentPreset = nuxt.options.postcss.plugins.preset;
  let newPreset: ['default', Record<string, unknown>] | undefined = undefined;

  if (!currentPreset || (typeof currentPreset === 'string' && currentPreset === 'default')) {
    newPreset = ['default', { calc: false }];
  }
  else if (Array.isArray(currentPreset) && currentPreset[0] === 'default') {
    newPreset = ['default', { calc: false, ...currentPreset[1] }];
  }
  else {
    console.warn(
      yellow('[module @resee-movies/nuxt-ux:import-tailwind]\n\n')
      + yellow('It appears that NanoCSS is enabled in your build, but done so in a way that prevents this module\n')
      + yellow('from accessing its preset configuration.\n\n')
      + yellow('The NanoCSS "calc" plugin will emit a warning when it encounters certain syntax - specifically calc\n')
      + yellow('functions within CSS color module level 5 grammar - which this module heavily relies on.\n\n')
      + yellow('These warnings have no effect on the resulting output, but can cause a noisy console during builds.\n')
      + yellow('To disable, within your "nuxt.config.ts", add:\n')
      + '\n{'
      + `\n  ${ magenta('postcss') }: {`
      + `\n    ${ magenta('plugins') }: {`
      + `\n      ${ magenta('nanocss') }: {`
      + `\n        ${ magenta('preset') }: [${ green('"default"') }, { ${ magenta('calc') }: false }],`
      + '\n      },'
      + '\n    },'
      + '\n  },'
      + '\n}',
    );
  }

  nuxt.options.postcss.plugins.cssnano.preset = newPreset;
}


/**
 * Per the time of writing this, Tailwind's Vite plugin does not generate source maps.
 * Vite will complain about this via warnings if sourcemaps are otherwise enabled, so
 * this intercepts those warnings and squashes them. Ooof.
 *
 * @see https://github.com/tailwindlabs/tailwindcss/discussions/16119
 * @see
 */
function disableInvalidSourcemapWarningsPlugin(options?: ImportTailwindOptions): Plugin {
  return {
    apply : 'build',
    name  : 'vite-plugin-resee-ux-ignore-tailwind-sourcemap-warnings',

    configResolved(config) {
      if (!options?.disableSourceMapWarningsFor?.length) {
        return;
      }

      const originalOnWarn = config.build.rollupOptions.onwarn;

      config.build.rollupOptions.onwarn = (warning, warn) => {
        const { code, plugin } = warning;

        if (code === 'SOURCEMAP_BROKEN' && plugin && options?.disableSourceMapWarningsFor?.includes(plugin)) {
          return;
        }

        if (originalOnWarn) {
          originalOnWarn(warning, warn);
        }
        else {
          warn(warning);
        }
      };
    },
  };
}
