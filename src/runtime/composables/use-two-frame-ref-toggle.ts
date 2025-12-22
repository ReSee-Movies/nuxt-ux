import { ref, type Ref } from 'vue';

/**
 * Configuration for the {@link useTwoFrameRefToggle} composable.
 *
 * - `direction` (default: "one-way"): The order in which the refs will be updated,
 *   depending on whether they are being toggled true or false.
 *   - `"one-way"`: refA -> refB, always.
 *   - `"reverse"`: refA -> refB, if true. refB -> refA, if false.
 * - `defaultValue` (default: false): The initial value to set the refs as.
 */
type UseTwoFrameRefToggleOptions = {
  direction?    : 'one-way' | 'reverse';
  defaultValue? : boolean;
}


/**
 * Returns two boolean refs and an `update` method that accepts a boolean that the
 * refs will be updated to. The setting of the ref values is staggered, with one
 * happening one re-paint after the first.
 *
 * Why? This sort of one-two-step can be very useful in certain scenarios - like
 * when CSS properties need to be applied in a specific order (e.x. initial state,
 * and then some kind of transition).
 */
export function useTwoFrameRefToggle(options?: UseTwoFrameRefToggleOptions) {
  const refA = ref(options?.defaultValue ?? false);
  const refB = ref(options?.defaultValue ?? false);

  const update = (value: boolean) => {
    if (refA.value === value) {
      return;
    }

    // If the order is set to "reverse", then when setting to false
    // the second ref is changed on the leading frame.
    const refOrder: [Ref<boolean>, Ref<boolean>] = !value && options?.direction === 'reverse'
      ? [refB, refA]
      : [refA, refB];

    refOrder[0].value = value;

    let frameId: number | undefined;

    if (frameId) {
      cancelAnimationFrame(frameId);
      frameId = undefined;
    }

    // Ye ol' double requestAnimationFrame trick.
    // This doesn't look like a hack at all. Nope,
    // not one bit.
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        refOrder[1].value = value;
        frameId = undefined;
      });
    });
  };

  return [refA, refB, update] as [refA: Ref<boolean>, refB: Ref<boolean>, updateMethod: (value: boolean) => void];
}
