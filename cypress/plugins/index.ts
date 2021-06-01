import injectCraDevServer from "@cypress/react/plugins/react-scripts";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";

require("../../tsconfig.json");

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  injectCraDevServer(on, { ...config, addTranspiledFolders: [".storybook"] });

  config.resolve = {
    plugins: [new TsconfigPathsPlugin({})],
  };

  return config;
};
