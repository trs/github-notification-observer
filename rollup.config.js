import typescript from '@rollup/plugin-typescript';
import path from 'path';

import pkg from './package.json';

const mainPath = path.dirname(pkg.main);

const external = [
  'rxjs',
  'rxjs/fetch',
  'rxjs/operators',
  'node-fetch',
  'abort-controller'
];

export default [{
  input: 'src/mod.ts',
  output: {
    dir: mainPath,
    format: 'cjs',
    sourcemap: 'inline'
  },
  external,
  plugins: [typescript({
    declaration: true,
    declarationDir: mainPath
  })]
}, {
  input: 'src/mod.ts',
  output: {
    file: pkg.module,
    format: 'esm',
    sourcemap: 'inline'
  },
  external,
  plugins: [typescript()]
}];
