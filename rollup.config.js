import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default {
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
};
