import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/node.ts',
        'src/scss.ts',
        'src/tailwind.ts',
        'src/index.ts',
        'src/**/types.ts',
        'src/color-converter/index.ts',
        'src/css-specificity/index.ts',
      ],
      thresholds: {
        statements: 90,
        branches: 80,
        functions: 90,
        lines: 90,
      },
    },
  },
});
