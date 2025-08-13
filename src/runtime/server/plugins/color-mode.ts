import type { NitroAppPlugin } from 'nitropack';
import { useAppConfig } from '#imports';
import type { ModuleOptions } from '../../types';


export default <NitroAppPlugin> function (nitroApp) {
  nitroApp.hooks.hook('render:html', (html) => {
    const config = useAppConfig() as { ux?: Partial<ModuleOptions> };

    const defaultColorMode        = config?.ux?.defaultColorMode;
    const usePreferredColorScheme = config.ux?.usePreferredColorScheme;

    // language=js
    const scriptContent = `
      (() => {
        const storeKey = 'resee-color-mode';

        if (!document) {
          // noop
        }
        else if (localStorage?.getItem(storeKey)) {
          document.documentElement.classList.add(localStorage.getItem(storeKey));
        }
        else if (${ usePreferredColorScheme } && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.documentElement.classList.add('dark');
        }
        else if ('${ defaultColorMode }') {
          document.documentElement.classList.add('${ defaultColorMode }');
        }
      })();
    `;

    html.head.push(`<script>${ scriptContent }</script>`);
  });
};
