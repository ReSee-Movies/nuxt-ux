import type { NitroAppPlugin } from 'nitropack';
import { TeleportId } from '../../constants';


export default <NitroAppPlugin> function (nitroApp) {
  nitroApp.hooks.hook('render:html', (html) => {
    html.body.push(`<div id="${ TeleportId.replace('#', '') }" />`);
  });
};
