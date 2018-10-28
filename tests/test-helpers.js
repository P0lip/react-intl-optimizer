const fs = require('fs');
const path = require('path');

const fixtures = [];
const BASE_DIR = path.resolve(__dirname, 'fixtures', 'definitions');

global.fixtures = fixtures;

for (const directory of fs.readdirSync(BASE_DIR)) {
  const DIR_PATH = path.resolve(BASE_DIR, directory);

  fixtures.push({
    code: fs.readFileSync(path.resolve(DIR_PATH, 'sample.js'), 'utf-8'),
    outputMin: fs.readFileSync(path.resolve(DIR_PATH, 'output-min.js'), 'utf-8'),
    outputInline: fs.readFileSync(path.resolve(DIR_PATH, 'output-inline.js'), 'utf-8'),
    outputWhitelist: fs.readFileSync(path.resolve(DIR_PATH, 'output-whitelist.js'), 'utf-8'),
  });
}
