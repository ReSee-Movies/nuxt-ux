import { addVitePlugin, useNuxt } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';


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
}
