import { SourceMapSource, RawSource } from 'webpack-sources';
import {
  createReplacer, generateChecksum, initialReviver, renameMessageKeys,
} from './utils';
import { METADATA_NAME } from '../consts';
import optimize from '../optimizer/index';
import { IdMap } from '../optimizer/id-map';

class ReactIntlOptimizer {
  constructor({
    messages,
    languages,
    chunkName,
    optimization = {},
    defaultLanguage,
    output = langKey => `messages/${langKey}.json`,
  }) {
    this.messages = JSON.parse(JSON.stringify(
      messages,
      initialReviver(languages, defaultLanguage, optimization),
    ));

    this.optimization = optimization;
    this.chunkName = chunkName;
    this.defaultLanguage = defaultLanguage;
    this.output = output;
  }

  prepareChunks(compilation, chunks) {
    chunks = Array.from(chunks);

    if (this.chunkName !== undefined) {
      chunks = chunks.filter(chunk => (typeof this.chunkName === 'string'
        ? chunk.name === this.chunkName
        : this.chunkName.test(chunk.name)
      ));
    }

    return chunks
      .reduce((acc, chunk) => acc.concat(chunk.files || []), [])
      .concat(compilation.additionalChunkAssets || []);
  }

  apply(compiler) {
    const {
      messages,
      defaultLanguage,
      optimization,
      optimization: {
        inlineDefaultLanguage = false,
        removeUnused = false,
        whitelist = [],
      },
    } = this;

    const idMap = new IdMap(messages, defaultLanguage, optimization);
    const shouldOptimize = compiler.options.mode === 'production';
    const manifest = {};

    const allMessagesIDs = shouldOptimize && removeUnused
      ? new Set()
      : null;

    compiler.hooks.compilation.tap(ReactIntlOptimizer.name, (compilation) => {
      if (shouldOptimize) {
        compilation.hooks
          .buildModule
          .tap(ReactIntlOptimizer.name, (module) => {
            module.useSourceMap = true;
          });

        compilation.hooks.optimizeChunkAssets.tapAsync(
          ReactIntlOptimizer.name,
          (chunks, callback) => {
            Promise.all(this.prepareChunks(compilation, chunks).map(async (file) => {
              const asset = compilation.assets[file];
              const { source, map } = asset.sourceAndMap();

              const result = await optimize(
                source,
                {
                  sourceFileName: file,
                  inputSourceMap: map,
                },
                {
                  inlineDefaultLanguage,
                  idMap,
                  whitelist,
                  messages: messages[defaultLanguage],
                },
              );

              if (result.metadata[METADATA_NAME] !== undefined) {
                for (const [id] of result.metadata[METADATA_NAME]) {
                  if (allMessagesIDs !== null) {
                    allMessagesIDs.add(id);
                  }
                }
              }

              compilation.assets[file] = new SourceMapSource(
                result.code,
                file,
                result.map,
                source.code,
                source.map,
              );
            }))
              .then(() => callback())
              .catch(callback);
          });
      }

      if (compilation.hooks.htmlWebpackPluginAlterAssetTags !== undefined) {
        compilation.hooks
          .htmlWebpackPluginAlterAssetTags
          .tapAsync(ReactIntlOptimizer.name, ({ head }, callback) => {
            if (Array.isArray(head)) {
              head.unshift({
                tagName: 'script',
                closeTag: true,
                attributes: {
                  type: 'text/javascript',
                },
                innerHTML: `;var __REACT_INTL_OPTIMIZER__=${JSON.stringify(manifest)};`,
              });
            }

            callback();
          });
      }
    });

    compiler.hooks.emit.tapAsync({
      name: ReactIntlOptimizer.name,
      before: 'HtmlWebpackPlugin',
    }, (compilation, callback) => {
      for (const [langKey, allMessages] of Object.entries(messages)) {
        const replacer = shouldOptimize
          ? createReplacer(
            whitelist,
            inlineDefaultLanguage && defaultLanguage === langKey ? new Set() : allMessagesIDs,
          )
          : null;

        if (shouldOptimize && idMap.size > 0) {
          renameMessageKeys(allMessages, idMap);
        }

        const stringifiedMessages = JSON.stringify(allMessages, replacer);
        const filename = this.output(langKey); // todo: pass use output.publicPath
        manifest[langKey] = {
          path: filename,
          empty: stringifiedMessages === '{}',
          checksum: shouldOptimize
            ? generateChecksum(stringifiedMessages)
            : undefined,
        };

        compilation.assets[filename] = new RawSource(stringifiedMessages);
      }

      if (compilation.hooks.htmlWebpackPluginAlterAssetTags === undefined) {
        const filename = this.output('manifest.json'); // todo: pass use output.publicPath
        compilation.assets[filename] = new RawSource(manifest);
      }

      callback();
    });
  }
}

export default ReactIntlOptimizer;
