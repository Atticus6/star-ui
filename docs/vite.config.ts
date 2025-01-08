import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'

export default defineConfig(async () => {
  return {
    server: {
      hmr: {
        overlay: false,
      },
      fs: {
        allow: [resolve(__dirname, '..')],
      },
      watch: {

      },
    },
    plugins: [

      UnoCSS(),
      vueJsx(),
      Components({
        dirs: resolve(__dirname, '.vitepress/theme/components'),
        dts: '../src/types/components.d.ts',
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        transformer: 'vue3',
      }),
      AutoImport({
        imports: ['vue'],
        dts: '../src/types/auto-imports.d.ts',
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('../src', import.meta.url)),
      },
    },
  }
})
