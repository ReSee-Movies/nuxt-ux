import { mountSuspended } from '@nuxt/test-utils/runtime';
import UiIcon from '@resee-movies/nuxt-ux/components/UiIcon.vue';
import { describe, expect, it, } from 'vitest';


describe('Components | UiIcon', () => {
  it('can be mounted', async () => {
    const component = await mountSuspended(UiIcon, {
      props: { name: 'i-ph-chart-bar' },
    });

    expect(component.html()).to.exist;
  });
});
