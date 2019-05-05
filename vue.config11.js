const isProduction = process.env.NODE_ENV === "production";
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

/** 将文件转成utf-8 bom格式，解决中文乱码的问题
 * https://www.npmjs.com/package/webpack-utf8-bom
 * https://blog.csdn.net/weizengxun/article/details/53448885
 * https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
 */
const BomPlugin = require("./src/plugins/webpack-utf8-bom");

module.exports = {
  // baseUrl 3.4版本已废弃  refs:https://cli.vuejs.org/zh/config/#baseurl
  // publicPath 等价于 webpack 的 output.publicPath
  publicPath: isProduction ? "./areas/app/content/ppm/" : "/",
  devServer: {
    disableHostCheck: true, //禁用主机检查
    proxy: {
      "/api": {
        target: process.env.PROXY_TARGET,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  },
  chainWebpack: config => {
    // 为生产环境设置的配置
    if (isProduction) {
      config.mode = "production";
      config.optimization.minimizer = [
        new UglifyJsPlugin({
          // sourceMap: true,
          uglifyOptions: {
            compress: {
              warnings: false,
              drop_console: false,
              drop_debugger: true
            }
          }
        })
      ];
      config.plugins.delete("move-index");
      config
        // refs:https://github.com/neutrinojs/webpack-chain/tree/v4
        // 添加插件
        .plugin("utf8bom")
        .use(BomPlugin, [
          {
            addBOM: true,
            fileMask: /\.(cshtml|html)$/
          }
        ])
        .end()
        .plugin("utf8bom")
        // 初始化插件
        .init((Plugin, args) => {
          return new Plugin(...args);
        })
        .before("html")
        .end()
        .plugin("html")
        .tap(args => {
          /* 传递给 html-webpack-plugin's 构造函数的新参数 */
          /**
           * refs: https://cli.vuejs.org/zh/guide/webpack.html#%E4%BF%AE%E6%94%B9%E6%8F%92%E4%BB%B6%E9%80%89%E9%A1%B9
           * https://segmentfault.com/q/1010000009350223
           * https://github.com/liangxiaojuan/vue-Meizi/blob/master/build/webpack.prod.conf.js#L50
           */
          args[0].minify.removeAttributeQuotes = false; // 禁用移除属性双引号
          args[0].filename = "index.cshtml";
          args[0].inject = true;
          return args;
        });
    }
  }
};
