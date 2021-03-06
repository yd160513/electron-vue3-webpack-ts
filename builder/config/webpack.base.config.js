const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const NODE_ENV = process.env.NODE_ENV ? 'development' : 'production'

module.exports = {
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          /**
           * vue 文件中的 js 代码需要按照 ts 来执行，增加 appendTsSuffixTo 是为了让 ts-loader 识别以 .vue 结尾的文件。
           */
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  resolve: {
    /**
     * https://segmentfault.com/a/1190000013176083?utm_source=tag-newest
     * 在导入语句没带文件后缀时，webpack会自动带上后缀去尝试访问文件是否存在。
     * resolve.extensions用于配置在尝试过程中用到的后缀列表，默认是：
     * extensions:['.js', '.json']
     * 也就是说当遇到 require('./data')这样的导入语句时，webpack会先去寻找./data.js文件，如果找不到则去找./data.json文件，如果还是找不到则会报错。
     */
    extensions: ['.js', '.vue', '.json', 'ts', 'tsx']
  }
}