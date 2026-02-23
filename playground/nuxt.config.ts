export default defineNuxtConfig({
  compatibilityDate: '2025-08-12',

  modules: ['../src/module'],

  ux: {
    reseeImageBaseUrl : '/api/images/resee/',
    tmdbImageBaseUrl  : '/api/images/tmdb/',
  },

  devtools: { enabled: false },

  sourcemap: false,

  $env: {
    github: {
      ssr: true,
      app: {
        baseURL: '/nuxt-ux/',
      },
      ux: {
        reseeImageBaseUrl : undefined,
        tmdbImageBaseUrl  : undefined,
      },
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
    },

    rootAttrs: {
      id: 'app-root',
    },
  },
});
