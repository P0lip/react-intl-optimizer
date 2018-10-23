import { createReplacer, mangleMessagesObj } from './utils';
import { SUBSCRIBER_NAME, METADATA_NAME } from '../consts';
import { MangleMap } from '../mangler/mangler';

class ReactIntlOptimizer {
  constructor({
    messages,
    optimization = {},
    output = langKey => `messages/${langKey}.json`,
  }) {
    this.messages = messages;
    this.optimization = optimization;
    this.output = output;
  }

  static get metadataContextFunctionName() {
    return SUBSCRIBER_NAME;
  }

  apply(compiler) {
    const {
      mangle,
      unsafeMangling,
      removeUnused = false,
      whitelist = [],
    } = this.optimization;

    const allMessagesIDs = removeUnused
      ? new Set()
      : null;

    const mangleMap = mangle
      ? new MangleMap(whitelist)
      : null;

    compiler.hooks.beforeRun.tapAsync(ReactIntlOptimizer.name, (compilation, callback) => {
      // todo: let's try to avoid such exposure...
      // prepare mangle map aot and just pass it as an option to babel-loader
      global[ReactIntlOptimizer.metadataContextFunctionName] = {
        mangleMap,
      };

      callback();
    });

    if (removeUnused) {
      compiler.hooks.compilation.tap(ReactIntlOptimizer.name, (compilation) => {
        compilation.hooks.normalModuleLoader.tap(ReactIntlOptimizer.name, (context) => {
          context[ReactIntlOptimizer.metadataContextFunctionName] = (metadata) => {
            if (metadata[METADATA_NAME] !== undefined) {
              for (const id of metadata[METADATA_NAME]) {
                allMessagesIDs.add(id);
              }
            }
          };
        });
      });
    }

    compiler.hooks.emit.tapAsync(ReactIntlOptimizer.name, (compilation, callback) => {
      const replacer = createReplacer(
        whitelist,
        allMessagesIDs,
      );

      for (const [langKey, allMessages] of Object.entries(this.messages)) {
        let messages = allMessages;

        if (mangle) {
          messages = mangleMessagesObj(messages, mangleMap);
        }

        const jsonString = JSON.stringify(messages, replacer);

        const filename = this.output(langKey);

        compilation.assets[filename] = {
          source: () => jsonString,
          size: () => jsonString.length,
        };
      }

      callback();
    });
  }
}

export default ReactIntlOptimizer;
