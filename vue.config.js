const prefix = process.env.NODE_ENV === 'production' ? '/' : '/';
const host = process.env.NODE_ENV === 'production' ? '/' : '/';
//const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const path = require('path');
/* function resolve (dir) {
    return path.join(__dirname, dir);
} */
module.exports = {
  // Project deployment base
  // By default we assume your app will be deployed at the root of a domain,
  // e.g. https://www.my-app.com/
  // If your app is deployed at a sub-path, you will need to specify that
  // sub-path here. For example, if your app is deployed at
  // https://www.foobar.com/my-app/
  // then change this to '/my-app/'
  // publicPath: 'newapp',
  publicPath: process.env.NODE_ENV === 'production'? '/newapp/' : '/',

  // where to output built files
  outputDir: 'newapp',

  // 默认在生成的静态资源文件名中包含hash以控制缓存
  filenameHashing: true,

  // whether to use eslint-loader for lint on save.
  // valid values: true | false | 'error'
  // when set to 'error', lint errors will cause compilation to fail.
  lintOnSave: false,

  // use the full build with in-browser compiler?
  // https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only
  runtimeCompiler: true,

  // tweak internal webpack configuration.
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: () => {
    //config.resolve.alias.set('excel', resolve('./src/util/excel'));
    //config.module.rule('eslint');
    //config.module.rule('eslint').use('eslint-loader')
  },
  configureWebpack: () => {
  
    
  },

  // vue-loader options
  // https://vue-loader.vuejs.org/en/options.html
  // vueLoader: {},

  // generate sourceMap for production build?
  productionSourceMap: true,

  // CSS related options
  css: {
    // extract CSS in components into a single CSS file (only in production)
    // can also be an object of options to pass to extract-text-webpack-plugin
    extract: true,

    // enable CSS source maps?
    sourceMap: false,

    // pass custom options to pre-processor loaders. e.g. to pass options to
    // sass-loader, use { sass: { ... } }
    loaderOptions: {},

    // Enable CSS modules for all css / pre-processor files.
    // This option does not affect *.vue files.
    modules: false
  },

  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,

  // split vendors using autoDLLPlugin?
  // can also be an explicit Array of dependencies to include in the DLL chunk.
  // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#dll-mode
  // dll: false,

  // options for the PWA plugin.
  // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8082,
    https: false,
    hotOnly: false,
    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      [host]: {
        // target: "http://139.159.191.204:8086",
        // target: "http://192.168.51.78:20068",
        target: "http://127.0.0.1:18080",
        // target: "http://rems.ktwlrj.com:20072",
        changeOrigin: true,
        // logLevel:'debug',
        secure: false,
        ws: false
      }
      // '/fwzs':{
      //   target: "http://192.168.51.78:20068",
      //   // target: "http://rems.ktwlrj.com:20072",
      //   // target: "http://192.168.32.53:8082",
      //   changeOrigin: true,
      //   logLevel:'debug',
      //   secure: false,
      //   ws: false
      // }
    } // string | Object
  },
 
  // options for 3rd party plugins
  pluginOptions: {
    // ...
  },
 
};
