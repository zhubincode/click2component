"use strict";
const path = require("path");
const os = require("os");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = process.env.port || process.env.npm_config_port || 80;

module.exports = {
  configureWebpack: {
    name: process.env.VUE_APP_TITLE,
    devtool: "source-map",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
    output: {
      filename: `static/js/[name]-test-[hash].js`,
      chunkFilename: `static/js/[name]-test-[hash].js`,
    },
    plugins: [
      // 注入项目根路径和环境变量
      new (require("webpack").DefinePlugin)({
        "process.env.VUE_APP_PROJECT_ROOT": JSON.stringify(
          path.resolve(__dirname)
        ),
        "process.env.HOME": JSON.stringify(os.homedir()),
        "process.env.USER": JSON.stringify(
          process.env.USER || os.userInfo().username
        ),
        "window.__WEBPACK_CONFIG__": JSON.stringify({
          context: path.resolve(__dirname),
          projectRoot: path.resolve(__dirname),
          srcRoot: path.resolve(__dirname, "src"),
        }),
      }),
    ],
  },
  chainWebpack: (config) => {
    // 注入 webpack context 到全局变量
    config.plugin("define").tap((args) => {
      const existingDefines = args[0] || {};
      args[0] = {
        ...existingDefines,
        "window.__WEBPACK_CONFIG__": JSON.stringify({
          context: path.resolve(__dirname),
          projectRoot: path.resolve(__dirname),
          srcRoot: path.resolve(__dirname, "src"),
        }),
      };
      return args;
    });
  },
};
