import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
import { isString } from '@resee-movies/utilities/strings/is-string';
import { useReseeUxStore } from '../stores/use-resee-ux-store';

export default defineNuxtPlugin({
  name: 'configure-resee-ux',

  setup() {
    const {
      reseeImageBaseUrl,
      tmdbImageBaseUrl,
    } = useRuntimeConfig().public.ux ?? {};

    const reseeUx = useReseeUxStore();

    if (isString(reseeImageBaseUrl)) {
      reseeUx.setReseeUxConstant({ reseeImageBaseUrl });
    }

    if (isString(tmdbImageBaseUrl)) {
      reseeUx.setReseeUxConstant({ tmdbImageBaseUrl });
    }
  }
});
