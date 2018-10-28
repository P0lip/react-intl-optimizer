import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';
import messages from '../fixtures/messages/sample-0';

describe('optimization', () => {
  pluginTester({
    plugin,
    pluginName: 'inline',
    pluginOptions: {
      minifyIDs: false,
      messages: messages.en,
      inlineDefaultLanguage: true,
      whitelist: [],
    },
    babelOptions: {
      babelrc: false,
    },
    tests: global.fixtures.map(({ code, outputInline: output }) => ({
      code,
      output,
    })),
  });
});
