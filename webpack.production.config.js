"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var config = require('/source/proper-config.json');
var webpackUglifyJsPlugin = require('webpack-uglify-js-plugin');

// var source = `/source/${config.source}`;
var source = `/source`;

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
});

// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'sass')
});
// global css files
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loader: ExtractTextPlugin.extract('style', 'css')
});

module.exports = {
	entry: [
		`${source}/src/index.jsx`
	],
	// context : "/source",
	// devtool : 'source-map',
	output: {
		path: path.join(source, 'public'),
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	plugins: [
		new WebpackCleanupPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpackUglifyJsPlugin({
		  cacheFolder: path.resolve(__dirname, 'public/cached_uglify/'),
		  debug: true,
		  minimize: true,
		  sourceMap: false,
		  output: {
		    comments: false
		  },
		  compressor: {
		    warnings: false
		  }
		}),
		// new webpack.optimize.UglifyJsPlugin({
  //     compress: {warnings: false},
  //     output: {comments: false},
  //     sourceMap: true
  //   }),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false,
		// 		screw_ie8: true,
		// 		drop_console: true,
		// 		drop_debugger: true
		// 	}
		// }),
		new webpack.optimize.OccurenceOrderPlugin(),
		new ExtractTextPlugin('style.css', {
			allChunks: true
		}),
		new HtmlWebpackPlugin({
			template: `${source}/src/template.html`,
			title: 'Webpack App'
		})
	]
};