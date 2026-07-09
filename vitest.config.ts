import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./tests/setup.ts'],
        include: ['tests/unit/**/*.{test,spec}.{ts,tsx}', 'tests/integration/**/*.{test,spec}.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json-summary', 'html'],
            include: [
                'services/nguonc-stream-provider.ts',
                'services/stream-provider.ts',
                'store/**/*.ts',
                'lib/utils.ts',
                'lib/source-mapping.ts',
                'lib/rate-limit.ts',
            ],
            thresholds: { statements: 80, branches: 70, functions: 80, lines: 80 },
        },
    },
});
