import { addVitePlugin, useNuxt } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';
import type Chalk from 'chalk';


const Builder    = '@nuxt/vite-builder';
const VitePlugin = '@tailwindcss/vite';
const PostPlugin = '@tailwindcss/postcss';


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
 * Installs the Tailwind PostCSS or Vite plugin, depending on what's needed.
 */
export async function importTailwind(nuxt: Nuxt = useNuxt()) {
  if (nuxt.options.builder === Builder) {
    if (!checkVitePlugins(nuxt.options.vite.plugins ?? [])) {
      await import(VitePlugin).then(
        (tailwind) => addVitePlugin(tailwind.default()),
      );
    }
  }
  else {
    nuxt.options.postcss         ??= { plugins: {}, order: [] };
    nuxt.options.postcss.plugins ??= {};

    if (!nuxt.options.postcss.plugins[PostPlugin]) {
      nuxt.options.postcss.plugins[PostPlugin] = {};
    }
  }


  if (nuxt.options.postcss?.plugins?.cssnano) {
    const currentPreset = nuxt.options.postcss.plugins.preset;
    let newPreset: ['default', Record<string, unknown>] | undefined = undefined;

    if (!currentPreset || (typeof currentPreset === 'string' && currentPreset === 'default')) {
      newPreset = ['default', { calc: false }];
    }
    else if (Array.isArray(currentPreset) && currentPreset[0] === 'default') {
      newPreset = ['default', { ...currentPreset[1], calc: false }];
    }
    else {
      let chalk: Chalk.Chalk;

      try {
        ({ default: chalk } = await import('chalk'));
      }
      catch {
        chalk = {
          magenta : (text: string) => text,
          green   : (text: string) => text,
        } as Chalk.Chalk;
      }

      console.warn(
        chalk.yellow(
          '[module @resee-movies/nuxt-ux:import-tailwind]\n\n'
          + 'It appears that NanoCSS is enabled in your build, but done so in a way that prevents this module\n'
          + 'from accessing its preset configuration.\n\n'
          + 'The NanoCSS "calc" plugin will emit a warning when it encounters certain syntax - specifically calc\n'
          + 'functions within CSS color module level 5 grammar - which this module heavily relies on.\n\n'
          + 'These warnings have no effect on the resulting output, but can cause a noisy console during builds.\n'
          + 'To disable, within your "nuxt.config.ts", add:\n',
        )
        + '\n{'
        + `\n  ${ chalk.magenta('postcss') }: {`
        + `\n    ${ chalk.magenta('plugins') }: {`
        + `\n      ${ chalk.magenta('nanocss') }: {`
        + `\n        ${ chalk.magenta('preset') }: [${ chalk.green('"default"') }, { ${ chalk.magenta('calc') }: false }],`
        + '\n      },'
        + '\n    },'
        + '\n  },'
        + '\n}',
      );
    }

    nuxt.options.postcss.plugins.cssnano.preset = newPreset;
  }
}
