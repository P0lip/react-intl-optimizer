import babel from 'rollup-plugin-babel';
import pkg from './package.json';

export default [{
  input: './src/babel/index.js',
  output: {
    file: './babel.js',
    format: 'cjs',
    name: `${pkg.name}-babel`,
    sourcemap: false,
  },
  plugins: [
    babel({
      externalHelpers: true,
    }),
  ],
}, {
  input: './src/webpack/index.js',
  output: {
    file: './webpack.js',
    format: 'cjs',
    name: `${pkg.name}-webpack`,
    sourcemap: false,
  },
  plugins: [
    babel({
      externalHelpers: true,
    }),
  ],
}];
