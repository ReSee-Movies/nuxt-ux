import UiIcon, { type UiIconProps } from '../../../src/runtime/components/UiIcon.vue';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, test } from 'vitest';


type TestCase = [name: string, mountOptions: { props?: UiIconProps }];

const TestCases: TestCase[] = [
  ['it can be mounted', { props: {} }],
  ['it shows an icon', { props: { name: 'i-ph-chart-bar' } }],
  ['it show a small icon', { props: { name: 'i-ph-chart-bar', size: 'sm' } }],
  ['it show a large icon', { props: { name: 'i-ph-chart-bar', size: 'lg' } }],
  ['it show a jumbo icon', { props: { name: 'i-ph-chart-bar', size: 'xl' } }],
  ['it show a loading indicator', { props: { loading: true } }],
];


describe('Components | UiIcon', () => {
  test.each(TestCases)('%s', async (_name, options) => {
    const component = await mountSuspended(UiIcon, options);
    expect(component.html()).to.matchSnapshot();
  });
});
