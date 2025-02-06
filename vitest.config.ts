import swc from 'unplugin-swc';
import tsConfigPaths from 'vite-tsconfig-paths';
import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    exclude: ['./node_modules', './dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'clover'],
      include: ['**/src/domain/**', '**/test/**', '**/src/utils/**'],
      exclude: ['./node_modules', './build', '**/*.module.ts', ...coverageConfigDefaults.exclude],
    },
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
});
