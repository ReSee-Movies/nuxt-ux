import type { Nuxt, NuxtConfig } from '@nuxt/schema';
import { readFile } from 'node:fs/promises';
import { useNuxt, resolvePath, addTemplate, logger } from '@nuxt/kit';
import { join } from 'node:path';


const IMPORT_REGEX = /(?<=\s|^|;|\})@import\s+["']tailwindcss["']/gmu;

type ExtNuxtConfig = NuxtConfig & { srcDir: string };
type ImportingFile = (readonly [string, { isInNuxt: boolean }]);


function getDefaults(config: ExtNuxtConfig) {
  return [
    'css/tailwind.css',
    'css/main.css',
    'css/styles.css',
  ].map(
    (defaultPath) => join(config.srcDir, config.dir?.assets || 'assets', defaultPath),
  );
}


export type Options = {
  sources?: string[];
  plugins?: string[];
  imports?: string[];
};


/**
 * Resolves CSS files for Tailwind to process.
 */
export async function importCSS(nuxt: Nuxt = useNuxt(), options?: Options) {
  const sources = nuxt.options._layers.map(
    (layer) => layer.config.srcDir || layer.cwd,
  );

  const plugins = options?.plugins ?? [];

  if (options?.sources) {
    sources.push(...options.sources);
  }

  await nuxt.callHook('tailwindcss:sources:extend', sources)

  const sourcesTemplate = addTemplate({
    filename    : 'tailwindcss/sources.css',
    write       : true,
    getContents : () => {
      const sourceStrings = sources.map((source) => `@source ${JSON.stringify(source)};`).join('\n');
      const pluginStrings = plugins.map((plugin) => `@plugin ${JSON.stringify(plugin)};`).join('\n');

      return sourceStrings + '\n' + pluginStrings;
    },
  });

  const importingFiles  = [] as ImportingFile[];
  const projectCSSFiles = await Promise.all(nuxt.options.css.map(p => resolvePath(p)));

  for (let i = 0; i < nuxt.options._layers.length; i++) {
    const currentLayer = nuxt.options._layers[i];
    const resolvedCSS  = [] as string[];

    if (i === 0) {
      resolvedCSS.push(...projectCSSFiles);
    }
    else if (currentLayer?.config.css) {
      const cssPaths = currentLayer
        .config
        .css
        .filter((p: unknown) => typeof p === 'string')
        .map((p) => resolvePath(p));

      await Promise.all(cssPaths).then(
        (files) => resolvedCSS.push(...files),
      );
    }

    if (currentLayer?.config) {
      const promises = Array.from(
        new Set([...getDefaults(currentLayer.config), ...resolvedCSS]),
      ).map(async (file) => {
        const contents = await readFile(file, { encoding: 'utf-8' }).catch(() => '');

        return [file, {
          hasImport : IMPORT_REGEX.test(contents),
          isInNuxt  : projectCSSFiles.includes(file),
        }] as const;
      });

      const analyzed = await Promise.all(promises).then(
        (files) => files.filter((file) => file[1].hasImport),
      );

      if (analyzed.length) {
        importingFiles.push(...analyzed);
        break;
      }
    }
  }

  const [file, { isInNuxt } = {}] = importingFiles.length === 0
    ? [
      addTemplate({
        filename    : 'tailwind.css',
        write       : true,
        getContents : () => {
          return [
            `@import 'tailwindcss';`,
            `@import ${JSON.stringify(sourcesTemplate.dst)};`,
            ...(options?.imports ?? []).map((item) => `@import ${JSON.stringify(item)};`),
          ].join('\n');
          },
      }).dst,
    ]
    : importingFiles.find(file => file[1].isInNuxt) || importingFiles.pop()!

  if (!isInNuxt) {
    nuxt.options.css.unshift(file);
  }

  nuxt.options.alias['#tailwindcss']         = file;
  nuxt.options.alias['#tailwindcss/sources'] = sourcesTemplate.dst;

  nuxt.hook('builder:watch', (_e, path) => {
    if (path !== file && projectCSSFiles.includes(path)) {
      readFile(file, { encoding: 'utf-8' }).then((fileContents) => {
        if (IMPORT_REGEX.test(fileContents)) {
          logger
            .withTag('@nuxtjs/tailwindcss')
            .warn(`New import for \`tailwindcss\` detected in ${file}. Restart server.`);
        }
      });
    }
  });
}
