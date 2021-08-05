// vue.config.js
const path = require('path')
const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    disableHostCheck: true,
    // proxy: {
    //   '/local': {
    //     target: 'http://d.cn',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/online': {
    //     target: 'http://d.cn',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/api': {
    //     target: 'http://ding.ycy-inc.cn',
    //     ws: true,
    //     changeOrigin: true
    //   },
    //   '/japi': {
    //     target: 'http://ding.ycy-inc.cn',
    //     ws: true,
    //     changeOrigin: true
    //   }
    // }
  },
  configureWebpack: () => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new PrerenderSPAPlugin({
            staticDir: resolve('dist'),
            routes: ['/','/about'], // 你需要预渲染的路由
            renderer: new Renderer({
              inject: {
                _m: 'prerender'
              },
              // 渲染时显示浏览器窗口，调试时有用
              headless: true,
              // 等待触发目标时间后，开始预渲染
              renderAfterDocumentEvent: 'render-event'
            })
          })
        ]
      }
    }
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('tools', resolve('src/tools'))
      .set('components', resolve('src/components'))
      .set('layout', resolve('src/layout'))
      .set('assets', resolve('src/assets'))
      .set('scss', resolve('src/assets/scss'))
      .set('api', resolve('src/api'))
      .set('store', resolve('src/store'))
      .set('pc', resolve('src/views/pc'))
    // 修复HMR
    config.resolve.symlinks(true)
  },
   css: {
    extract: false,
    sourceMap: false,
    loaderOptions: {
      scss: {
        // 向全局sass样式传入共享的全局变量, $src可以配置图片cdn前缀
        // 详情: https://cli.vuejs.org/guide/css.html#passing-options-to-pre-processor-loaders
        prependData: `
        @import "~scss/variables.scss";
        @import "~scss/mixin.scss";
        $src: "${process.env.VUE_APP_OSS_SRC}";
        `
      }
    }
  }
}