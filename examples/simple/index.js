const fs = require('fs');

const bundlePlayer = require('../../services/playerBundler');

const simple = require('../../stories/compositions/compo-1.json');

console.log('bundling simple example');

const bundle = bundlePlayer(simple, {displayMode: 'columns'});

fs.writeFile(__dirname + '/index.html', bundle, 'utf8', (err) => {
  if (err) {
    console.log('an error occured: ');
    return console.log(err);
  }
  console.log('done');
});