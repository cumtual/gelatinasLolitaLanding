// @ts-check
import { defineConfig } from 'astro/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
    vite: {
        resolve: {
            alias: [
                { find: '@', replacement: path.resolve(__dirname, './src') },
                { find: '@components', replacement: path.resolve(__dirname, './src/components') },
                { find: '@styles', replacement: path.resolve(__dirname, './src/styles') },
                { find: '@layouts', replacement: path.resolve(__dirname, './src/layouts') },
                { find: '@pages', replacement: path.resolve(__dirname, './src/pages') },
                { find: '@assets', replacement: path.resolve(__dirname, './src/assets') },
                { find: '@utils', replacement: path.resolve(__dirname, './src/utils') }
            ]
        }
    }
});
