// Import rollup plugins
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';

export default {

  preserveEntrySignatures: 'strict',

  input: 'ft-connect.js',

  output: {
    dir: 'dist/component',
  },

  plugins: [

    // Resolve bare module specifiers to relative paths
    resolve(),

    // Print bundle summary
    summary()
]
};