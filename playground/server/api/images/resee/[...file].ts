import {
  createError,
  defineEventHandler,
  getRequestURL,
  getRouterParam,
  proxyRequest,
  useRuntimeConfig,
} from '#imports';
import { getMediaAssetUrl } from '@resee-movies/utilities/resee/get-media-asset-url';


export default defineEventHandler((event) => {
  const file = getRouterParam(event, 'file');

  if (!file) {
    throw createError({
      statusCode: 400,
    });
  }

  const reqUrl  = getRequestURL(event);
  const config  = useRuntimeConfig();
  const fileUrl = getMediaAssetUrl(file, { baseUrl: `${ config.public.apiBaseUrl }/assets/` });

  return proxyRequest(event, fileUrl + reqUrl.search);
});
