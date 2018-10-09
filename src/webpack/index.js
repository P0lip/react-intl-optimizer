import { filterMessagesObj } from './utils';

class ReactIntlPlugin {
  constructor({ messages, keepUnused = true }) {
    this.messages = messages;
    this.keepUnused = keepUnused;
  }

  static get metadataContextFunctionName() {
    return 'metadataReactIntlPlugin';
  }

  apply(compiler) {
    const allMessagesIDs = new Set();

    compiler.hooks.compilation.tap('ReactIntlPlugin', (compilation) => {
      compilation.hooks.normalModuleLoader.tap('ReactIntlPlugin', (context) => {
        context[ReactIntlPlugin.metadataContextFunctionName] = (metadata) => {
          if (!this.keepUnused && metadata['react-intl']) {
            for (const id of metadata['react-intl']) {
              allMessagesIDs.add(id);
            }
          }
        };
      });
    });

    compiler.hooks.emit.tapAsync('ReactIntlPlugin', (compilation, callback) => {
      allMessagesIDs.delete('');

      for (const [langKey, messages] of Object.entries(this.messages)) {
        const jsonString = JSON.stringify(
          this.keepUnused
            ? messages
            : filterMessagesObj({ ...messages }, allMessagesIDs),
        );

        const filename = `messages/${langKey}.json`;

        compilation.fileDependencies.add(filename);
        compilation.assets[filename] = {
          source: () => jsonString,
          size: () => jsonString.length,
        };
      }

      callback();
    });
  }
}

export default ReactIntlPlugin;
