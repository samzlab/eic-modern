import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'url';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            outDir: 'dist',
        }),
    ],
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
