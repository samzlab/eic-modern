import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'EicModern',
            fileName: 'index',
            formats: ['es'],
        },
        rollupOptions: {
            external: [],
            output: {
                globals: {},
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
});
