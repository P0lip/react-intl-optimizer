import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';
import { IdMap } from '../../src/optimizer/id-map';
import messages from '../fixtures/messages/sample-0';

describe('optimization', () => {
  pluginTester({
    plugin,
    pluginName: 'minifyIDs',
    pluginOptions: {
      idMap: new IdMap(messages, 'en', {
        minifyIDs: true,
        whitelist: [],
      }),
      messages: {},
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
