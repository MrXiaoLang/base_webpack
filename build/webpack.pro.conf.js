// 本js为生产环境下webpack配置文件
const merge=require('webpack-merge');
const baseWebpackConfig=require('./webpack.base.conf.js');
const webpack=require('webpack');
const path=require('path');
const DIST_PATH=path.resolve(__dirname,"../dist");
//打包之前清除文件
const CleanWebpackPlugin=require('clean-webpack-plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin');
//打包的时候分析包大小等
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//分离css
const MiniCssExtractPlugin=require('mini-css-extract-plugin');
// 压缩css
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 开启gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;

module.exports=merge(baseWebpackConfig,{
  mode:"production",//会将 process.env.NODE_ENV 的值设为 production。
  devtool:'cheap-module-source-map',//不带列映射(column-map)的 SourceMap，将加载的 Source Map 简化为每行单独映射。
  output:{
    filename:"js/[name].[hash:8].js",
    path:DIST_PATH
  },
  module:{
    rules:[
      {
        test:/\.css$/,
        use:[
          MiniCssExtractPlugin.loader,
          {loader:'css-loader'},
          {loader:"postcss-loader"}
        ]
      },
      {
        test:/\.(sc|sa)ss$/,
        use:[
          MiniCssExtractPlugin.loader,
          {loader:'css-loader'},
          {loader:"sass-loader"},
          {loader:"postcss-loader"}
        ]
      },
      {
        test:/\.less$/,
        use:[
          MiniCssExtractPlugin.loader,
          {loader:'css-loader'},
          {loader:'less-loader'},
          {loader:"postcss-loader"}
        ]
      },
      {
        test:/\.(png|svg|jpg|gif)$/,
        use:[
          {
            loader:'file-loader',
            options:{
              limit:10000,
              name:"[hash:8].[ext]",
              outputPath:"images/"
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      // 默认将node_modules中依赖打包到venders.js
      chunks: 'all'
    },
    // 将webpack运行时生成代码打包到runtime.js
    runtimeChunk: true
  },
  plugins:[
    new CleanWebpackPlugin({root:path.resolve(__dirname,'../'),verbose:true}),//每次打包前清除dist
    new HtmlWebpackPlugin({
      //将目录下的index.html引进生成的dist中的index.html
      template:'index.html',
      title:'生产环境title',
      favicon:'',
      minify:{
        removeComments:true,
        collapseWhitespace:true,
        removeAttributeQuotes:true
      },
    }),
    new BundleAnalyzerPlugin({//打包分析
      analyzerPort:10000, // 打包分析端口
      openAnalyzer:true,
    }),
    new MiniCssExtractPlugin({//分离css
      filename:"css/[name].[chunkhash:8].css",
      chunkFilename:"css/[name].[hash:8].css"
    }),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: productionGzipExtensions,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});