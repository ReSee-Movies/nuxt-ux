import { mountSuspended } from '@nuxt/test-utils/runtime';
import UiIconTextPair from '@resee-movies/nuxt-ux/components/UiIconTextPair.vue';
import { describe, expect, it, } from 'vitest';


describe('Components | UiIconTextPair', () => {
  it('can be mounted', async () => {
    const component = await mountSuspended(UiIconTextPair, {
      props: {
        text: 'Hello World',
        icon: 'i-ph-chart-bar',
      },
    });

    expect(component.html()).to.exist;
  });
});
