import { defineConfig } from 'rollup';

export default defineConfig({
    input: 'scripts/index.js',
    output: {
        dir: 'dist',
        format: 'esm'
    }
});