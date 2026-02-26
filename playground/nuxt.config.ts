export default defineNuxtConfig({

  modules: ['../src/module'],

  $env: {
    github: {
      ssr : true,
      app : {
        baseURL: '/nuxt-ux/',
      },
      ux: {
        reseeImageBaseUrl : undefined,
        tmdbImageBaseUrl  : undefined,
      },
    },
  },

  devtools: { enabled: false },

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

  sourcemap         : false,
  compatibilityDate : '2025-08-12',

  ux: {
    reseeImageBaseUrl : '/api/images/resee/',
    tmdbImageBaseUrl  : '/api/images/tmdb/',
  },
});
