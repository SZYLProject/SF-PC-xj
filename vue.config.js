const webpack = require('webpack')


module.exports = {
  publicPath: "./", // 打包部署
  productionSourceMap: false,
  devServer: {
    open: true,
    // public: '193.169.100.179:8080',
    proxy: {
      "/api": {
        target: "http://172.17.128.13:8080/fums-web", //崔祥
        //target: "http://172.16.117.174:9003", //崔祥
        // target: 'http://117.16.115.55:9002', //李伟
        // target: "http://172.16.118.53:9003", // 许振伟

        // target: 'http://193.169.100.185:9002', //许振伟 重庆本地 新
        // target: 'http://193.169.100.182:9002', //许振伟 重庆本地
        // target: 'http://192.168.1.192:9002', //许振伟 重庆线上服务器1
        // target: 'http://192.168.1.191:8098', // 许振伟 重庆线上服务器2
        // target: 'http://172.16.116.131:9002', //王和章
        // target: 'http://172.16.115.235:9002', //许振伟
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": "/api"
        }
      }
    }
  },
  // jquery
  chainWebpack: config => {
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }])
  }
};
