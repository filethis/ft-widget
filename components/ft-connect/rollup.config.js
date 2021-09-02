// Import rollup plugins
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';

export default {

  preserveEntrySignatures: 'strict',

  input: 'ft-connect.js',

  output: {
    file: 'dist/component/ft-connect.js',
    format: 'iife',
    name: 'FtConnect'
  },

  plugins: [

    // Resolve bare module specifiers to relative paths
    resolve(),

    // Print bundle summary
    summary()
]
};