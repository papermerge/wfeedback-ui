const path = require('path');

let glob = require("glob");
let entry_point = path.resolve(__dirname, 'src/js/led_status.js');
let output_path = path.resolve(__dirname, 'dist');
let output_filename = "leds.bundle.js";


if ( process.env.TESTBUILD ) {
  entry_point = glob.sync(__dirname + "/tests/**/*_test.js");
  output_path = __dirname + "/test-dist/";
  output_filename = "tests.bundle.js";
}

module.exports = {
  mode: 'development',
  entry: entry_point,
  output: {
    path: output_path,
    filename: output_filename,
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