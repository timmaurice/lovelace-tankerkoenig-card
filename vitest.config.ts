import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './test/setup.ts',
    alias: { '\\.scss$': './test/styleMock.ts' },
    // The end-to-end specs are Playwright's, not vitest's - without this the
    // default glob picks them up and dies on the import.
    exclude: ['**/node_modules/**', '**/dist/**', 'test/e2e/**'],
  },
});
