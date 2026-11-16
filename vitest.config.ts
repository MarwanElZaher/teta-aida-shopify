import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Standalone on purpose: vite.config.ts loads the Hydrogen/Oxygen plugins,
// which don't run under Vitest. Tests here cover pure modules only.
export default defineConfig({
  resolve: {
    alias: { '~': fileURLToPath(new URL('./app', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['app/**/*.test.ts'],
  },
});
