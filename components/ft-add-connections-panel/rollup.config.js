// Import rollup plugins
import copy from 'rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';

export default {

  preserveEntrySignatures: 'strict',

  input: 'ft-add-connections-panel.js',

  output: {
    dir: 'dist/component',
  },

  plugins: [

    copy({
      targets: [
        { src: 'assets/*', dest: 'dist/component/assets' }
      ]
    }),

    // Resolve bare module specifiers to relative paths
    resolve(),

    // Print bundle summary
    summary()
]
};