// The cct-dev-server helper is built in a separate step (tsconfig.cct.json) to avoid
// pulling Node-based side effects into the browser-oriented helpers bundle.
// Since TS allows only one types entry point per package, the deep import it produces
// gets its types from this ambient module declaration, which is referenced by the
// main types entry point.
// This is a .ts file (not .d.ts) so it isn't elided at compile time.

declare module '@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server' {
  function injectQuasarDevServerConfig(): Cypress.DevServerConfigOptions;
}
