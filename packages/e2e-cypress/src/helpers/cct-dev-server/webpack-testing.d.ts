// @quasar/app-webpack/lib/testing.js has no type declarations upstream,
// so it can't be statically resolved even when the package is installed
declare module '@quasar/app-webpack/lib/testing.js' {
  export function getTestingConfig(
    ctxParams?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
}
