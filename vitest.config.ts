import { defineVitestProject } from '@nuxt/test-utils/config';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@' : resolve(__dirname, './src/runtime'),
      '#' : resolve(__dirname, './src'),
    },
  },

  test: {
    projects: [
      await defineVitestProject({
        test: {
          name        : 'nuxt',
          include     : ['test/nuxt/**/*.{test,spec}.ts'],
          environment : 'nuxt',
        },
      }),
    ],

    coverage: {
      include  : ['**/src/**'],
      reporter : ['html', 'lcov'],
    },
  },
});
