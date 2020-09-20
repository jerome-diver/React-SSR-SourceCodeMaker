
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const mode = (process.env.NODE_ENV === 'dev') ? 'development' : 'production'
const { I18NextHMRPlugin } = require('i18next-hmr/plugin')


var config = {
    mode: mode,
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [ 'babel-loader' ] },
            {   test: /\.s(a|c)ss$/,
                use: [ 
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { 
                            publicPath: '/css',
                            reloadAll: true }
                    } ,
                    'css-loader', 'sass-loader' ] },
            {   test: /\.(png|jpe?g|gif|ico|svg)$/i,
                exclude: [/node_modules/],
                use: [ {
                    loader: 'file-loader',
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
                    name: '[name].[ext]',
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
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: (mode === 'production') ? 'css/[contentHash].css' : 'css/[id].css',
            chunkFilename: (mode === 'production') ? 'css/[contentHash].css' : 'css/[id].css'
            }),
        new I18NextHMRPlugin({
          localesDir: path.resolve(__dirname, 'locales'),
        })
    ],
 }

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
