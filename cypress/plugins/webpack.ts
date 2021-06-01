import { startDevServer } from "@cypress/webpack-dev-server";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import webpack from "webpack";

module.exports = (on, config) => {
  on("dev-server:start", async (options) => {
    startDevServer({
      options,
      webpackConfig: {
        resolve: {
          plugins: [new TsconfigPathsPlugin()],
        },
      } as webpack.Configuration,
    });
  });

  return config;
};
