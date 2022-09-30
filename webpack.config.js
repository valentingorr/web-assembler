const path = require("path");

const webpack = require("webpack");

module.exports = {
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	target: "electron-renderer",
	devtool: "inline-source-map",
	watch: process.env.NODE_ENV === "production" ? false : true,
	watchOptions: {
		ignored: [
			"./index.js",
			"./package.json",
			"./package-lock.json",
			"**/modules",
			"**/node_modules",
		],
	},
	stats: "errors-only",
	entry: path.resolve(__dirname, "./src/index.jsx"),
	output: {
		path: path.resolve(__dirname, "./public/"),
		filename: "app.bundle.js"
	},
	plugins: [
		new webpack.DefinePlugin({
			"__REACT_DEVTOOLS_GLOBAL_HOOK__": "({ isDisabled: true })"
		})
	],
	module: {
		rules: [
			{
				test: /\.jsx?/,
				exclude: path.resolve(__dirname, "/node_modules/"),
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react"
						]
					}
				}
			},
			{
				test: /\.s?[ac]ss$/,
				use: [
					"style-loader",
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: ["@svgr/webpack", "url-loader"]
			},
			{
				test: /\.png/,
				exclude: /node_modules/,
				use: ["file-loader"]
			}
		]
	}
};