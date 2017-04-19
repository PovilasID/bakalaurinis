const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options) => {
  const ExtractSASS = new ExtractTextPlugin(`/styles/${options.cssFileName}`);

  const webpackConfig = {
    devtool: options.devtool,
    sassLoaders: 'style-loader!css-loader?localIdentName=[local]__[path]    [name]__[hash:base64:5]&modules&importLoaders=1&sourceMap!postcss-loader!sass-loader',

    entry: [
      `webpack-dev-server/client?http://localhost:${+options.port}`,
      'webpack/hot/dev-server',
      Path.join(__dirname, '../src/app/index'),
    ],
    output: {
      path: Path.join(__dirname, '../dist'),
      filename: `/scripts/${options.jsFileName}`,
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [
        {test: /.jsx?$/, include: Path.join(__dirname, '../src/app'), loader: 'babel',},
        {test: /\.jsx?$/, exclude: /(node_modules|bower_components)/, loader: 'babel'},
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss?sourceMap&sourceComments',
        ],
      },
        {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
        {test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000"},
        {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"},
        {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"},
      ],
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development'),
        },
      }),
      new HtmlWebpackPlugin({
        template: Path.join(__dirname, '../src/index.html'),
      }),
    require('postcss-cssnext'),

    ],
  };

  if (options.isProduction) {
    webpackConfig.entry = [Path.join(__dirname, '../src/app/index')];

    webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
      ExtractSASS
    );

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      include: /node_modules/,
      loader: options.sassLoaders,
    });
  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    });

    webpackConfig.devServer = {
      contentBase: Path.join(__dirname, '../'),
      hot: true,
      port: options.port,
      inline: true,
      progress: true,
      historyApiFallback: true,
    };
  }

  return webpackConfig;
};
