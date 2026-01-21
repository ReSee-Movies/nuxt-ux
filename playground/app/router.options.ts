import { reseeScrollBehavior } from '#resee-ux/utils/routing';
import type { RouterConfig } from '@nuxt/schema';

export default {
  scrollBehavior: reseeScrollBehavior,
} satisfies RouterConfig;
