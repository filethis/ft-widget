// Import rollup plugins
import html from '@web/rollup-plugin-html';
import { copy } from '@web/rollup-plugin-copy';
import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';

export default {
  plugins: [

    // Entry point for application build
    html({
      input: 'index.html',
    }),

    // Resolve bare module specifiers to relative paths
    resolve(),

    // Print bundle summary
    summary(),

    // Optional: copy any static assets to build directory
    copy({
      patterns: ['images/**/*'],
    }),
  ],

  output: {
    dir: 'dist',
  },

  preserveEntrySignatures: 'strict',
};