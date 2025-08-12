/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: [
                'src/index.ts'
            ],
            exclude: [
                'node_modules/',
                'dist/',
                '**/*.d.ts',
                '**/*.test.ts',
                'vite.config.ts',
                'vitest.config.ts',
                'test-script.js',
                'debug-random.js',
            ],
        },
    },
});
