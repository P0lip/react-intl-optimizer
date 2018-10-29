import pluginTester from 'babel-plugin-tester';
import plugin from '../../src/optimizer/plugin';
import messages from '../fixtures/messages/sample-0';
import { IdMap } from '../../src/optimizer/id-map';

describe('optimization', () => {
  pluginTester({
    plugin,
    pluginName: 'inline',
    pluginOptions: {
      idMap: new IdMap(messages, 'en', {
        whitelist: [],
      }),
      messages: messages.en,
      inlineDefaultLanguage: true,
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
