const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/led_status.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'leds.bundle.js',
    library: 'LEDS',
  },
  module: {
    rules: [
      {   // rule 1 - for loading svg files
        test: /\.svg/,
        type: 'asset/source',
      },  // end of rule 1
      {   // rule 2
        test: /\.js$/,
        exclude: ["/node_modules/"],
        use: [
          {
            loader: "babel-loader",
          },
        ],  // end of use
      },  // end of rule 2
    ]  // end of rules
  }
};