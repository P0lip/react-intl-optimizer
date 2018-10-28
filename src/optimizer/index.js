import * as babel from '@babel/core';
import plugin from './plugin';

export default function (code, options, pluginOptions) {
  return babel.transformAsync(code, {
    babelrc: false,
    compact: false,
    inputSourceMap: options.inputSourceMap,
    plugins: [[plugin, pluginOptions]],
    sourceMaps: true,
    sourceFileName: options.sourceFileName,
  });
}
