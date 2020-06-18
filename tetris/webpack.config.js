const HtmlWebPackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
  entry: "./src/index.js",
  output:  { filename: 'bundle.js' },

  optimization: {
    minimize: false,
  },

  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",  // preprocessor (aka 'loader') name
//            options: {minimize: true}
          }
        ]
      },
     {
       test: /\.css$/i,
       use: ExtractTextPlugin.extract({
         fallback: 'style-loader', use: 'css-loader'
       }),
     },
     {
       test: /\.s[ac]ss$/i,
       use: ExtractTextPlugin.extract({ use: [
         // Creates `style` nodes from JS strings
         // 'style-loader',
         // Translates CSS into CommonJS
         'css-loader',
         // Compiles Sass to CSS
         'sass-loader',
         ] }),
     },
     {
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [ 
            [
              '@babel/preset-env',
              {
                "targets": {
                 "chrome": "48",
                 "ie": "11"
                }
              },
            ]
          ]
        }
      }
     },
    ]
  },

  plugins: [
    new HtmlWebPackPlugin({
      inject: true, // by default
      template: "./src/index.html",
      filename: "./bundle.html"
    }),
    new ExtractTextPlugin('bundle.css')
  ],

  devServer: {
    index: 'bundle.html' // index.html by default (package.json?)
  }
}
