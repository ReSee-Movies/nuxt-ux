import { toInteger } from '@resee-movies/utilities/numbers/to-integer';
import { sleep } from '@resee-movies/utilities/timers/sleep';

const MimeTypes: Record<string, string> = {
  txt  : 'text/plain',
  css  : 'text/css',
  html : 'text/html',
  js   : 'text/javascript',
  json : 'application/json',
  apng : 'image/apng',
  avif : 'image/avif',
  gif  : 'image/gif',
  jpeg : 'image/jpeg',
  png  : 'image/png',
  svg  : 'image/svg',
  webp : 'image/webp',
};

export default defineEventHandler(async (event) => {
  const param  = getRouterParam(event, 'slug');
  const query  = getQuery(event);
  const status = toInteger(query.status);
  const delay  = toInteger(query.delay);

  if (delay) {
    await sleep(delay);
  }

  if (status) {
    setResponseStatus(event, status);
  }

  if (status >= 400) {
    return;
  }

  const extension = param?.split('.').at(-1)?.toLowerCase();
  const mimeType  = extension ? MimeTypes[extension] : MimeTypes.txt;

  setResponseHeader(event, 'content-type', mimeType);
});
