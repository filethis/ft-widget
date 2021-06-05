// Import rollup plugins
import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';

export default {

  preserveEntrySignatures: 'strict',

  output: {
    dir: './dev/dist',
  },

  plugins: [

    // Entry point for application build
    html({
      input: './dev/index.html',
    }),

    // Resolve bare module specifiers to relative paths
    resolve(),

    copy({
      patterns: '../components/**/assets/*'
    }),

    // Print bundle summary
    summary()
]
};