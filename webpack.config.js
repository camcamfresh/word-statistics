const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = {
	entry: {
		'bundle.js': glob
			.sync('build/**/*.+(css|html|js|png|ico)')
			.map((file) => path.resolve(__dirname, file)),
	},
	output: {
		path: __dirname + '/build/dist',
		publicPath: '',
	},
	mode: 'production',
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.js$/,
				use: ['babel-loader'],
			},
			{
				test: /\.(png|json|ico)$/,
				use: ['url-loader'],
			},
			{
				test: /\.html$/,
				use: ['html-loader'],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: 'body',
			template: './public/index.html',
			filename: './index.html',
			favicon: './build/favicon.ico',
		}),
		new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/bundle/]),
	],
};
