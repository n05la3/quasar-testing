/* eslint-disable */
import { join } from 'path';
import { createRequire } from 'module';

function getPackageJson() {
  return require(join(process.cwd(), 'package.json'));
}

function getQuasarAppRequire() {
  // Resolve through the app's own node_modules: when this package is file-linked
  // (dev workflow), bare-specifier resolution walks up from this file's realpath,
  // not the host app, so @quasar/app-webpack would be unresolvable.
  return createRequire(join(process.cwd(), 'package.json'));
}

export function injectQuasarDevServerConfig() {
  const { devDependencies } = getPackageJson();
  const isVite = devDependencies.hasOwnProperty('@quasar/app-vite');

  if (isVite) {
    return {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: async () => {
        const { getTestingConfig } = await import('@quasar/app-vite/testing');
        const viteConf = await getTestingConfig();

        // [1] -> https://github.com/cypress-io/cypress/issues/22505#issuecomment-1277855100
        // [1] Delete base so it can correctly be set by Cypress
        delete viteConf.base;

        return viteConf;
      },
    };
  }

  return {
    framework: 'vue',
    bundler: 'webpack',
    webpackConfig: async () => {
      const { getTestingConfig } = getQuasarAppRequire()(
        '@quasar/app-webpack/lib/testing.js'
      );
      return getTestingConfig();
    },
  };
}
