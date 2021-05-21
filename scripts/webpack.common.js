const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/index.tsx",
    devtool: "inline-source-map",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
        alias: {
            src: path.resolve(__dirname, "../src"),
        },
    },
    output: {
        publicPath: "/",
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../build"),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "../src", "index.html"),
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
        }),
    ],
};
