
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");

const {
  NODE_ENV = 'development',
} = process.env;

module.exports = {
  entry: ["webpack/hot/poll?100", "./src/lib/server.ts"],
  watch: true,
  target: "node",
  mode: NODE_ENV,
  externals: [
    nodeExternals({
      whitelist: ["webpack/hot/poll?100"]
    })
  ],
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "server.js"
  }
};
