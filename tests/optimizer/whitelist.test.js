import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';
import messages from '../fixtures/messages/sample-0';
import { IdMap } from '../../src/optimizer/id-map';

describe('whitelist', () => {
  pluginTester({
    plugin,
    pluginName: 'whitelist',
    pluginOptions: {
      idMap: new IdMap(messages, 'en', {
        minifyIDs: true,
        whitelist: ['cancel', 'send_later'],
      }),
      messages: messages.en,
      inlineDefaultLanguage: true,
    },
    babelOptions: {
      babelrc: false,
    },
    tests: global.fixtures.map(({ code, outputWhitelist: output }) => ({
      code,
      output,
    })),
  });
});
