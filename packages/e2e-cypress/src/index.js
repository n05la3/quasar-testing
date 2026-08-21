/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const { enforcedDevServerPort, enforcedCypress15Vite8Compatibility } = require('./shared');

module.exports = async function (api) {
  api.compatibleWith('quasar', '^2.0.0');

  if (api.hasWebpack === true) {
    api.compatibleWith('@quasar/app-webpack', '^3.11.0 || ^4.0.0');
  } else {
    api.compatibleWith('@quasar/app-vite', '^3.0.0');

    enforcedCypress15Vite8Compatibility(api);
  }

  // We cannot use process.env.CYPRESS here as this code is executed outside Cypress process
  if (process.env.NODE_ENV !== 'test') {
    return;
  }

  api.extendQuasarConf(async (conf) => {
    // Prevent Quasar from opening the project into a new browser
    // tab as Cypress opens its own window
    conf.devServer.open = false;

    // Force a specific port for Cypress (prompts may store it as a string)
    conf.devServer.port = Number(api.prompts.port) || enforcedDevServerPort;
  });

  if (api.prompts.options.includes('code-coverage')) {
    if (api.hasWebpack === true) {
      // TODO: add webpack code coverage support
      // See https://www.npmjs.com/package/istanbul-instrumenter-loader
      // https://github.com/vuejs/vue-cli/issues/1363#issuecomment-405352542
      // https://github.com/akoidan/vue-webpack-typescript
      return;
    }

    // TODO: known problem with Vue3 + Vite source maps: https://github.com/iFaxity/vite-plugin-istanbul/issues/14
    const { default: istanbul } = await import('vite-plugin-istanbul');

    api.extendViteConf((viteConf) => {
      viteConf.plugins.push(
        istanbul({
          forceBuildInstrument: api.ctx.prod,
        }),
      );
    });
  }
};
