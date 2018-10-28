import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';

describe('optimization', () => {
  pluginTester({
    plugin,
    pluginName: 'minifyIDs',
    pluginOptions: {
      messages: {},
      minifyIDs: true,
      whitelist: [],
    },
    babelOptions: {
      babelrc: false,
    },
    tests: global.fixtures.map(({ code, outputMin: output }) => ({
      code,
      output,
    })),
  });
});
