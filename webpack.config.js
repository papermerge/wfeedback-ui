const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/led_status.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'leds.bundle.js',
    library: 'LEDS',
  },
};