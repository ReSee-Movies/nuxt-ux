import { defineEventHandler, getRouterParams, proxyRequest } from '#imports';
import { getTmdbImageUrl } from '@resee-movies/utilities/tmdb/get-tmdb-image-url';

export default defineEventHandler((event) => {
  const params  = getRouterParams(event) as { size: string; file: string };
  const fileUrl = getTmdbImageUrl(params.file, params.size, { baseUrl: 'https://image.tmdb.org/t/p/' });

  return proxyRequest(event, fileUrl, {
    streamRequest: true,
  });
});
