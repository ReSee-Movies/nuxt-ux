export default defineNuxtConfig({
  compatibilityDate: '2025-08-12',

  modules: ['../src/module'],

  ux: {},

  devtools: { enabled: true },

  sourcemap: false,

  app: {
    rootAttrs: {
      id: 'app-root',
    },
  },
});
