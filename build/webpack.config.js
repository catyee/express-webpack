var webpack = require('webpack');
var path = require('path');
var publicPath = '/';
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var extractTextPlugin = require('extract-text-webpack-plugin');
var htmlPlugins = require('./webpack.html.js');
var isMobile = require('./environment'); // 判断是不是手机端
let entry = require('./webpack.entry.js');
var CleanWebpackPlugin = require('clean-webpack-plugin');
let buildPath = 'pc';
if (isMobile) {
    buildPath = 'mobile';
}
var devConfig = {
    entry: entry,
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../public', buildPath),
        publicPath: '/'
    },
    mode: 'development',
    devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: "/node_modules/"
            },
            {
                test: /\.(css|scss)$/,
                use: extractTextPlugin.extract({
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
                        // outputPath: "images"
                    }
                }]
            },
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
        // new CleanWebpackPlugin(['public/'+buildPath]),
        new extractTextPlugin({
            filename: '[name].[hash:8].css'
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'window.$': 'jquery'
        }),
    ].concat(htmlPlugins)

};
module.exports = devConfig;