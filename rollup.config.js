import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [
  {
    input: './src/webpack/index.js',
    output: {
      file: './dist/index.js',
      format: 'cjs',
      name: pkg.name,
      sourcemap: false,
    },
    plugins: [
      babel({
        externalHelpers: true,
      }),
    ],
  },
  {
    input: './src/client/index.js',
    output: {
      file: './client.js',
      format: 'cjs',
      name: pkg.name,
      sourcemap: true,
    },
    plugins: [
      babel({
        presets: [['@babel/env', {
          modules: false,
          targets: 'ie 11, not dead',
        }]],
        externalHelpers: true,
      }),
    ],
  },
];
