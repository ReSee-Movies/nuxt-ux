import { blockBodyScroll as block, unblockBodyScroll as unblock } from '@primeuix/utils/dom';
import { OverflowHiddenClass, ScrollbarWidthPropName } from '../constants';


/**
 * Blocks the body from being able to scroll in the same way that Primevue does
 * internally, but with the added functionality of returning the method that can
 * be used to perform the unblock. If the body has already been scroll-blocked by
 * something else (say, this is being trigger by a menu that is being used inside
 * a drawer), then the returned method is a noop.
 */
export function blockBodyScroll() {
  try {
    if (!document.body.classList.contains(OverflowHiddenClass)) {
      block({
        className    : OverflowHiddenClass,
        variableName : ScrollbarWidthPropName,
      });

      return () => unblockBodyScroll();
    }
  }
  catch {
    // noop
  }

  return () => {};
}


export function unblockBodyScroll() {
  try {
    unblock({
      className    : OverflowHiddenClass,
      variableName : ScrollbarWidthPropName,
    });
  }
  catch {
    // noop
  }
}
