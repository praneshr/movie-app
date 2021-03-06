const HTMLwebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin')

const entries = [
  'react-hot-loader/patch',
  'webpack-hot-middleware/client',
  './app/index.jsx',
]

module.exports = {
  browser: {
    entry: entries,
    resolve: {
      alias: {
        'global-styles': path.join(process.cwd(), './app/globals/styles/index.scss'),
        'global-assets': path.join(process.cwd(), './app/globals/assets'),
        nucleo: path.join(process.cwd(), './node_modules/nucleo-icons/build/outline.scss'),
      },
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.html', '.ejs', '.js', '.gql', '.graphql'],
    },
    node: {
      fs: 'empty',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          loaders: [
            'style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.join(process.cwd(), './app/globals/styles/_colors.scss'),
                  path.join(process.cwd(), './app/globals/styles/_variables.scss'),
                ],
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.ico$|\.svg$/,
          loader: 'url-loader',
          options: {
            limit: 500000,
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'url-loader',
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.hbs$/,
          loader: 'handlebars-loader',
        },
      ],
    },
    output: {
      path: path.resolve('./build/assets/'),
      filename: '[name].js',
      chunkFilename: '[name].js',
      publicPath: '/assets/',
    },
    plugins: [
      // Have the html-webpack-plugin as the first plugin else dev build will break
      new HTMLwebpackPlugin({
        filename: '../head.hbs',
        template: './app/views/head.hbs',
        inject: false,
        minify: false,
      }),
      new HTMLwebpackPlugin({
        filename: '../body.hbs',
        template: './app/views/body.hbs',
        inject: false,
        minify: false,
      }),
      new HTMLwebpackPlugin({
        filename: '../tail.hbs',
        template: './app/views/tail.hbs',
        inject: false,
        minify: false,
      }),
      new ManifestPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.LoaderOptionsPlugin({
        options: {
          resolve: {},
          postcss: [
            autoprefixer(),
          ],
          context: path.resolve(__dirname, '../../'),
        },
      }),
    ],
  },
  server: {
    entry: './server/index.jsx',
    resolve: {
      extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.html', '.ejs', '.js', '.gql', '.graphql'],
    },
    target: 'node',
    node: {
      __dirname: false,
      __filename: false,
      process: false,
    },
    externals: /^[a-z\-0-9]+$/,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loaders: [
            {
              loader: 'babel-loader',
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          loaders: [
            'isomorphic-style-loader',
            'css-loader',
            'postcss-loader',
          ],
        },
        {
          test: /\.jpe?g$|\.gif$|\.png$|\.ico$|\.svg$/,
          loader: 'url-loader',
          options: {
            limit: 500000,
            fallback: 'file-loader?publicPath=/assets/&emitFile=false',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          loader: 'url-loader',
        },
        {
          test: /\.scss$/,
          loaders: [
            'isomorphic-style-loader',
            'css-loader?minimize&modules&sourceMap&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  path.join(process.cwd(), './app/globals/styles/_colors.scss'),
                  path.join(process.cwd(), './app/globals/styles/_variables.scss'),
                ],
              },
            },
            'postcss-loader',
          ],
        },
      ],
    },
    output: {
      path: path.resolve('./'),
      filename: 'server.js',
      publicPath: '/assets/',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({
        options: {
          resolve: {},
          postcss: [
            autoprefixer(),
          ],
          context: path.resolve(__dirname, '../../'),
        },
      }),
    ],
  },
}
