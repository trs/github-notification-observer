import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

export default {
  input: 'src/mod.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: 'inline'
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: 'inline'
    }
  ],
  plugins: [typescript()]
};
