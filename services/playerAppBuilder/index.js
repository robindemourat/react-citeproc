const kotatsu = require('kotatsu');
const webpackConfig = require('./webpack.config.js');

function buildPresentationApplication () {
  console.log('building application');
  kotatsu.build('front', {
    entry: './services/playerAppBuilder/application.js',
    config: webpackConfig,
    babel: true,
    progress: true,
    minify: true,
    output: './build/application.js'
  });
}

buildPresentationApplication();

module.exports = buildPresentationApplication;