import UiLayoutPageColumn from '@resee-movies/nuxt-ux/components/UiLayoutPageColumn.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, } from 'vitest';


describe('Components | UiLayoutPageColumn', () => {
  it('can be mounted', async () => {
    const component = await mountSuspended(UiLayoutPageColumn, {
      props: {},
    });

    expect(component.html()).to.exist;
  });
});
