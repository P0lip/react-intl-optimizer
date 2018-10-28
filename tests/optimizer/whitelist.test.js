import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';
import messages from '../fixtures/messages/sample-0';

describe('whitelist', () => {
  pluginTester({
    plugin,
    pluginName: 'whitelist',
    pluginOptions: {
      messages: messages.en,
      minifyIDs: true,
      inlineDefaultLanguage: true,
      whitelist: ['cancel', 'send_later'],
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
