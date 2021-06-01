import injectCraDevServer from "@cypress/react/plugins/react-scripts";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

const webpackPreprocessor = require("@cypress/webpack-preprocessor");
const defaults = webpackPreprocessor.defaultOptions;

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  injectCraDevServer(on, { ...config, addTranspiledFolders: [".storybook"] });

  // Dealing with TSConfig paths
  config.resolve = {
    plugins: [new TsconfigPathsPlugin({})],
  };

  // Dealing with Emotion
  delete defaults.webpackOptions.module.rules[0].use[0].options.presets;
  on("file:preprocessor", webpackPreprocessor(defaults));

  return config;
};
