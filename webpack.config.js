const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
// const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// const CopyWebpackPlugin = require('copy-webpack-plugin')


const mode = process.env.NODE_ENV || 'development';
const devMode = mode === 'development';
const target = devMode ? 'web' : 'browserslist';
const devtool = devMode ? 'source-map' : undefined;

const filename = (ext, path='') => devMode ? `${path}[name]${ext}` : `${path}[name].[contenthash]${ext}`
const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    }
    if(!devMode) {
        config.minimizer = [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin(),
        ]
    }
    return config
}
const babelOptions = preset => {
    const opts = {
        presets: ['@babel/preset-env']
    }
    if(preset) {
        opts.presets.push(preset)
    }
    return opts
}

module.exports = {
    mode,
    target,
    devtool,
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: ['@babel/polyfill', path.resolve(__dirname, 'src/index.js')],
    },
    output: {
        filename: filename('.js'),
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        assetModuleFilename: filename('[ext]', 'assets/images/')
    },
    devServer: {
        port: 4200,
        open: true,
        hot: true,
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@fonts': path.resolve(__dirname, 'src/assets/fonts'),
            '@images': path.resolve(__dirname, 'src/assets/images')
        }
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html'),
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
            filename: filename('.css')
        }),
        // new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, 'src/start-screen-puppy.ico'),
        //             to: path.resolve(__dirname, 'dist')
        //         },
        //         ],
        //     }),
    ],
    optimization: optimization(),
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.(c|sa|sc)ss$/i,
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(ttf|woff|woff2|eot|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: filename('[ext]', 'assets/fonts/')
                }
            },
            {
                test: /\.(png|jpe?g|gif|ico|webp|svg)$/i,
                type: 'asset/resource',
                use: [
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: true,
                    //         },
                    //         // optipng.enabled: false will disable optipng
                    //         optipng: {
                    //             enabled: false,
                    //         },
                    //         pngquant: {
                    //             quality: [0.65, 0.90],
                    //             speed: 4
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         // the webp option will enable WEBP
                    //         webp: {
                    //             quality: 75
                    //         }
                    //     }
                    // }
                ],
            },
            // {
            //     test: /\.xml$/i,
            //     use: ['xml-loader']
            // },
            // {
            //     test: /\.csv$/i,
            //     use: ['csv-loader']
            // },
            {
                test: /\.(?:js|mjs|cjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: babelOptions()
                }
            },
            // {
            //     test: /\.ts$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: babelOptions('@babel/preset-typescript')
            //     }
            // },
            // {
            //     test: /\.jsx$/,
            //     exclude: /node_modules/,
            //     use: {
            //         loader: 'babel-loader',
            //         options: babelOptions('@babel/preset-react')
            //     }
            // },
        ]
    }
}