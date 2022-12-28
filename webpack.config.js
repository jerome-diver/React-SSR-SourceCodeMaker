
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const LoadablePlugin = require('@loadable/webpack-plugin')
const { I18NextHMRPlugin } = require('i18next-hmr/plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const mode = (process.env.NODE_ENV === 'development') ? 'development' : 'production'
const isDev = mode !== 'production';

/* GENERAL config */
var config = {
    mode: mode,
    devServer: {
	    hot: true,
    },
    module: {
        rules: [
            {   test: /\.jsx?$/,
                exclude: /node_modules/,
			 loader: 'babel-loader',
			 options: {
          		plugins: [isDev && require.resolve('react-refresh/babel')].filter(Boolean),
        		}, },
            {   test: /\.s[ac]ss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ] },
            {   test: /\.(png|jpe?g|gif|ico|svg)$/i,
                exclude: [/node_modules/],
                use: [ {
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/img',
                        outputPath: 'img'
                    }
                } ],
            },
            {
                test: /\.json$/,
                exclude: [/node_modules/],
                loader: 'file-loader',
                type: 'javascript/auto',
                options: {
                    name: '[folder]/[name].[ext]',
                    publicPath: '/locales',
                    outputPath: 'locales'
                }
            },
            {   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                exclude: [/img/],
                use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        publicPath: '/fonts',
                        outputPath: 'fonts'
                    }
                } ],
      }
        ]
    },
    plugins: [
        new LoadablePlugin(),
        new webpack.ProvidePlugin({ process: ['process'] }),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: (mode === 'production') ? 'css/[contentHash].css' : 'css/[id].css',
            chunkFilename: (mode === 'production') ? 'css/[contentHash].css' : 'css/[id].css'
            }),
	isDev  && new webpack.HotModuleReplacementPlugin(),
	isDev && new ReactRefreshWebpackPlugin(),
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'locales'),
        })
    ].filter(Boolean),
 }

/* Frontend (client browser with React.js) side config  */
const clientConfig = Object.assign({}, config, {
    name: "clientReact",
    target: "web",
    entry: {
        client: [ './frontend/client.js' ],
    },
    output: {
        path: path.resolve(__dirname, 'build/public/'),
        filename: (mode === 'production') ? 'js/[chunkhash].js' : 'js/[name].js',
        publicPath: '/build/public/',
    },
})

/* Backend (server with Express.js) side config  */
const serverConfig = Object.assign({}, config, {
    name: "serverExpress",
    target: "node",
    entry: { server: './backend/server.js' },
    output: {
        path: path.resolve(__dirname, 'build/'),
        filename: (mode === 'production') ? 'js/[chunkhash].js' : 'js/[name].js',
        publicPath: '/build/',
    },
    externals: [ nodeExternals() ]
})

module.exports = [ serverConfig, clientConfig ]
