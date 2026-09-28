import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import cesium from 'vite-plugin-cesium';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        cesium(),
        AutoImport({
            imports: ['vue'],
            // 关闭组件样式自动注入，改为手动全局引入，方便手动覆盖样式
            resolvers: [ElementPlusResolver({ importStyle: false })],
            dts: 'src/types/autoImport.d.ts'
        }),
        Components({
            resolvers: [ElementPlusResolver({ importStyle: false })],
            dts: 'src/types/components.d.ts'
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    base: './',
    css: {
        preprocessorOptions: {
            scss: {
                // 令牌函数层全局注入：组件 scoped 样式内可裸调 base() / font()
                additionalData: `@use '@/styles/tokens/functions' as *;`
            }
        }
    },
    build: {
        sourcemap: true
    },
    server: {
        host: true,
        port: 3005,
        hmr: true,
        proxy: {
            '^/user': {
                target: 'http://10.222.125.103:38081/',
                secure: false,
                changeOrigin: true,
                rewrite: (path: string) => {
                    return path.replace(/^\/user/, '');
                }
            }
        }
    }
});
