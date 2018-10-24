import { RawSource } from 'webpack-sources';
import { createReplacer, renameMessageKeys } from './utils';
import { SUBSCRIBER_NAME, METADATA_NAME } from '../consts';

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
      removeUnused = false,
      whitelist = [],
    } = this.optimization;

    const idMap = new Map();

    const allMessagesIDs = removeUnused
      ? new Set()
      : null;

    compiler.hooks.compilation.tap(ReactIntlOptimizer.name, (compilation) => {
      compilation.hooks.normalModuleLoader.tap(ReactIntlOptimizer.name, (context) => {
        context[ReactIntlOptimizer.metadataContextFunctionName] = (metadata) => {
          if (metadata[METADATA_NAME] !== undefined) {
            for (const [id, prevId] of metadata[METADATA_NAME]) {
              if (removeUnused) {
                allMessagesIDs.add(id);
              }

              if (prevId !== id) {
                // let's check for a potential collision to avoid any nasty situation
                // while the collision rate is low, it still may happen
                // and since no mangler is in use, it's better to be prepared
                const existingId = idMap.get(id);
                if (existingId !== undefined && existingId !== prevId) {
                  throw new Error('Collision happened. Please turn off ID minification.');
                }

                idMap.set(id, prevId);
              }
            }
          }
        };
      });
    });

    compiler.hooks.emit.tapAsync(ReactIntlOptimizer.name, (compilation, callback) => {
      const replacer = createReplacer(
        whitelist,
        allMessagesIDs,
      );

      for (const [langKey, allMessages] of Object.entries(this.messages)) {
        let messages = allMessages;

        if (idMap.size > 0) {
          messages = renameMessageKeys(Object.assign({}, messages), idMap);
        }

        const stringifiedMessages = JSON.stringify(messages, replacer);

        const filename = this.output(langKey);

        compilation.assets[filename] = new RawSource(stringifiedMessages);
      }

      callback();
    });
  }
}

export default ReactIntlOptimizer;
