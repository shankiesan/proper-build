"use strict";
var webpack = require('webpack');
var path = require('path');
var loaders = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var WriteFilePlugin = require('write-file-webpack-plugin');
var config = require('/source/proper-config.json');

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || "8888";

// var source = `/source/${config.source}/`;
var source = `/source/`;

// global css
loaders.push({
	test: /[\/\\](node_modules|global)[\/\\].*\.css$/,
	loaders: [
		'style?sourceMap',
		'css'
	]
});
// local scss modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.scss/,
	loaders: [
		'style?sourceMap',
		'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
		'sass'
	]
});

// local css modules
loaders.push({
	test: /[\/\\]src[\/\\].*\.css/,
	loaders: [
		'style?sourceMap',
		'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
	]
});

module.exports = {
	entry: [
		`webpack-dev-server/client?http://${HOST}:${PORT}`,
		`webpack/hot/only-dev-server`,
		`${source}/src/index.jsx` // Your appʼs entry point
	],
	// devtool: process.env.WEBPACK_DEVTOOL || 'cheap-module-source-map',
	output: {
		path: path.join(source, 'public'),
		filename: 'bundle.js',
		hotUpdateChunkFilename : 'hotupdate.js',
		hotUpdateMainFilename : 'hotupdate.json'
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders
	},
	devServer: {
		contentBase: "./public",
		outputPath: path.join(source, 'public'), // For WriteFilePlugin
		filename: 'bundle.js',
		// do not print bundle build stats
		noInfo: true,
		// enable HMR
		hot: true,
		// embed the webpack-dev-server runtime into the bundle
		inline: true,
		// serve index.html in place of 404 responses to allow HTML5 history
		historyApiFallback: true,
		port: PORT,
		host: HOST
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new WriteFilePlugin({
			log : false,
			useHashIndex: true
		}),
		new HtmlWebpackPlugin({
			template: `${source}/src/template.html`
		}),
		// new BrowserSyncPlugin(
  //     // BrowserSync options 
  //     {
  //       // browse to http://localhost:3000/ during development 
  //       host: 'localhost',
  //       port: 3000,
  //       // proxy the Webpack Dev Server endpoint 
  //       // (which should be serving on http://localhost:3100/) 
  //       // through BrowserSync 
  //       proxy: `http://${HOST}:${PORT}/`
  //     },
  //     // plugin options 
  //     {
  //       // prevent BrowserSync from reloading the page 
  //       // and let Webpack Dev Server take care of this 
  //       reload: false
  //     }
  //   )
	]
};