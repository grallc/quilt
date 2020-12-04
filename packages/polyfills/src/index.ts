import {isSupported} from 'caniuse-api';

export interface PolyfillDescriptor {
  featureTest?: string;
}

export const polyfills: {[polyfill: string]: PolyfillDescriptor} = {
  fetch: {
    featureTest: 'fetch',
  },
  formdata: {},
  'idle-callback': {
    featureTest: 'requestidlecallback',
  },
  'intersection-observer': {
    featureTest: 'intersectionobserver',
  },
  intl: {
    featureTest: 'intl-pluralrules',
  },
  'mutation-observer': {
    featureTest: 'mutationobserver',
  },
  'unhandled-rejection': {
    featureTest: 'unhandledrejection',
  },
};

export function mappedPolyfillsForEnv(
  env: 'node' | 'jest' | string[],
): {[key: string]: string} {
  const prefix = `@shopify/polyfills/dist/src`;
  const noop = `${prefix}/noop`;

  return Object.entries(polyfills).reduce(
    (mappedPolyfills, [polyfill, {featureTest}]) => {
      const mapFrom = `@shopify/polyfills/${polyfill}$`;

      if (env === 'node' || env === 'jest') {
        mappedPolyfills[mapFrom] = `${prefix}/${polyfill}.${env}`;
      } else {
        mappedPolyfills[mapFrom] =
          featureTest == null || !isSupported(featureTest, env)
            ? `${prefix}/${polyfill}.browser`
            : noop;
      }

      return mappedPolyfills;
    },
    {},
  );
}
