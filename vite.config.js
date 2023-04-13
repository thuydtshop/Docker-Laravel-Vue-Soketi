import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
const env = loadEnv('mock', process.cwd(),'' );

export default defineConfig({
    server: {
        host: true, // if not working, try 'localhost' here
        hmr: {
            host: env.VITE_HOST
        },
        watch: {
            usePolling: true,
            interval: 2000
        }
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false
                }
            }
        }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vue-router': ['vue-router'],
                    'dayjs': ['dayjs'],
                    'axios': ['axios'],
                }
            },
            plugins: [
                splitVendorChunkPlugin({
                    chunks: ['vue-router', 'dayjs', 'axios'],
                }),
            ],
        }
    }
});
