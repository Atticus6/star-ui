import { readdirSync } from 'node:fs'
import { basename, extname, join } from 'node:path'
import {
  componentPreview,
  containerPreview,
  // eslint-disable-next-line ts/ban-ts-comment
  // @ts-expect-error
} from '@vitepress-demo-preview/plugin'
import { defineConfig } from 'vitepress'
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'My Awesome Project',
  description: 'A VitePress Site',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '组件', link: '/components' },
      { text: '工具函数', link: '/utils' },
      { text: 'Hooks', link: '/hooks' },
    ],
    search: {
      provider: 'local',
    },
    lastUpdated: {
      text: '最近更新',
    },
    sidebar: {
      components: [
        {
          text: '组件',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('components')),
          ).map(text => ({
            text: text === 'index' ? '介绍' : text,
            link: `/components/${text}`,
          })),
          // items: [
          //   { text: "Markdown Examples", link: "/markdown-examples" },
          // ],
        },
      ],
      utils: [
        {
          text: '工具函数',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('utils')),
          ).map(text => ({
            text: text === 'index' ? '介绍' : text,
            link: `/utils/${text}`,
          })),
        },
      ],
      hooks: [
        {
          text: 'Hooks',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('hooks')),
          ).map(text => ({
            text: text === 'index' ? '介绍' : text,
            link: `/utils/${text}`,
          })),
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  markdown: {
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)
    },
  },
})

function getFilesInDirectory(directoryPath: string) {
  try {
    const files = readdirSync(`./docs/${directoryPath}`) // 同步读取文件夹内容
    const filePaths = files.map(file => join(directoryPath, file)) // 生成完整路径
    return filePaths
  }
  catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

function extractFileNames(filePaths: string[]) {
  return filePaths.map((filePath) => {
    const fileName = basename(filePath, extname(filePath)) // 获取文件名并移除扩展名
    return fileName
  })
}

function sortFilenames(fileNames: string[]) {
  return fileNames.sort((a, b) => {
    if (a === 'index')
      return -1 // `index` 总是在最前
    if (b === 'index')
      return 1
    return a.localeCompare(b) // 按字母顺序排序
  })
}
