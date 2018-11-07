var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
var htmlPlugins = require('./webpack.html.js');
var isMobile = require('./environment'); // 判断是不是手机端
let entry = require('./webpack.entry.js');
// 构建文件夹
let buildPath = 'pc';
if (isMobile) {
    buildPath = 'mobile';
}
var productionConfig = [{
    entry: entry,
    output: {
        filename: 'js/[name].[hash].js',
        path: path.join(__dirname, '../public/'+buildPath),
        publicPath: '../'
    },
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: "/node_modules/"
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('autoprefixer')]
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        }
                     
                    ],
                   
                })
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        limit: 5 * 1024,
                        outputPath: "images"
                    }
                }]
            }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_module[\\/]/,
                    chunks: "initial",
                    name: "vendor",
                    enforce: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(['public/'+buildPath]),
        new ExtractTextPlugin({
            filename: 'css/[name].[hash:8].css' 
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
          }),
        require('autoprefixer'),
        // 压缩css代码
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: false,
                    drop_console: true
                }
            }
        })
    ].concat(htmlPlugins)
}];

module.exports = productionConfig;