const { enforcedDevServerPort } = require('./shared');

module.exports = function (api) {
  if (api.hasWebpack === true) {
    return [
      {
        name: 'port',
        type: 'text',
        required: true,
        default: enforcedDevServerPort,
        message: 'Choose which port the app will be served when run for Cypress:',
      },
      {
        name: 'options',
        type: 'checkbox',
        message:
          'Cypress e2e and component Test Harness will now be installed. Please choose additional options:',
        choices: [
          {
            name: 'enable code coverage (currently only supported using Vite, not Webpack)',
            value: 'code-coverage',
            checked: false,
          },
        ],
      },
    ];
  }

  return {
    port: enforcedDevServerPort,
    options: ['code-coverage'],
  };
};
