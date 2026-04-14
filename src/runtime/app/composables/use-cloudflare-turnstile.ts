import { useHead } from '#imports';

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}


/**
 * Configurable options for Turnstile's `render` function.
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/#complete-configuration-reference
 */
export interface TurnstileRenderOptions {
  'sitekey'                      : string;
  'action'?                      : string;
  'cData'?                       : string;
  'callback'?                    : (token: string) => void;
  'error-callback'?              : () => void;
  'execution'?                   : 'render' | 'execute';
  'expired-callback'?            : () => void;
  'before-interactive-callback'? : () => void;
  'after-interactive-callback'?  : () => void;
  'unsupported-callback'?        : () => void;
  'theme'?                       : 'auto' | 'light' | 'dark';
  'language'?                    : string;
  'tabindex'?                    : number;
  'timeout-callback'?            : () => void;
  'response-field'?              : boolean;
  'response-field-name'?         : string;
  'size'?                        : 'normal' | 'flexible' | 'compact';
  'retry'?                       : 'auto' | 'never';
  'retry-interval'?              : number;
  'refresh-expired'?             : 'auto' | 'manual' | 'never';
  'refresh-timeout'?             : 'auto' | 'manual' | 'never';
  'appearance'?                  : 'always' | 'execute' | 'interaction-only';
  'feedback-enabled'?            : boolean;
}


/**
 * The Cloudflare Turnstile global instance.
 * @see https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/#explicit-rendering
 */
export interface Turnstile {
  render      : (widgetId: string, options: TurnstileRenderOptions) => void;
  reset       : (widgetId: string) => void;
  remove      : (widgetId: string) => void;
  getResponse : (widgetId: string) => string;
}


/**
 * The return type of the {@link useCloudflareTurnstile} composable.
 */
export interface UseCloudflareTurnstileReturn {
  onReady : (callback: (turnstile: Turnstile) => void) => void;
  onError : (callback: (error: unknown) => void) => void;
}


/**
 * Utilize Cloudflare's Turnstile widget via the returned `onReady` and `onError` methods.
 */
export function useCloudflareTurnstile(): UseCloudflareTurnstileReturn {
  if (import.meta.server) {
    useHead({
      link: [{ href: 'https://challenges.cloudflare.com', rel: 'preconnect' }],
    });
  }

  const onReady: UseCloudflareTurnstileReturn['onReady'] = function onTurnstileReady(callback) {
    if (import.meta.client) {
      readyTurnstile().then((turnstile) => callback(turnstile));
    }
  };

  const onError: UseCloudflareTurnstileReturn['onError'] = function onTurnstileError(callback) {
    if (import.meta.client) {
      readyTurnstile().catch((e) => callback(e));
    }
  };

  return { onReady, onError };
}


/**
 * Caching the promise for when the Turnstile script is first loaded so that
 * multiple requests to this composable do not result in multiple load attempts.
 *
 * It also makes the callback wrappers in the exported composable easier to
 * manage, as both the `onReady` and `onError` methods will receive the same
 * Promise instance that can be watched for different outcomes.
 */
let pending: Promise<Turnstile> | undefined = undefined;


/**
 * Prepares the Turnstile script for use, loading it if needed. This method
 * does not against server/client execution, and so will throw an exception
 * during SSR due to the direct reading of the Window global.
 */
function readyTurnstile(): Promise<Turnstile> {
  if (window.turnstile) {
    return Promise.resolve(window.turnstile);
  }

  if (pending) {
    return pending;
  }

  pending = new Promise((resolve, reject) => {
    const onScriptLoad = () => {
      pending = undefined;

      try {
        if (window.turnstile) {
          return resolve(window.turnstile);
        }

        reject(new Error('Turnstile script loaded, but global is not available.'));
      }
      catch (e) {
        reject(e);
      }
    };

    const onScriptError = (e: unknown) => {
      pending = undefined;
      reject(e);
    };

    try {
      useHead({
        script: [{
          src            : 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
          async          : true,
          defer          : true,
          fetchpriority  : 'low',
          crossorigin    : 'anonymous',
          referrerpolicy : 'no-referrer',
          onload         : onScriptLoad,
          onerror        : onScriptError,
        }],
      });
    }
    catch (e) {
      reject(e);
    }
  });

  return pending;
}
