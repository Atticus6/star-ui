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
  title: '四达组件库',
  description: 'A VitePress Site',
  lang: 'zh-CN',
  lastUpdated: true,
  useWebFonts: false,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '开始', link: '/start' },
      { text: '组件', link: '/components' },
      { text: '工具函数', link: '/utils' },
      { text: 'Hooks', link: '/hooks' },
    ],

    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    returnToTopLabel: '返回顶部',
    outlineTitle: '文章目录',
    outline: [2, 6], // 侧边栏显示的层级
    darkModeSwitchLabel: '外观',
    sidebarMenuLabel: '归档',
    lastUpdatedText: '最后一次更新于',
    search: {
      provider: 'local',
    },

    sidebar: {
      start: [
        {
          text: '开始项目',
          items: [{
            text: '开发规范',
            link: '/start',
          }, {
            text: 'Vite插件',
            link: '/start/vite',
          }],

        },
      ],
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
            link: `/hooks/${text}`,
          })),
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
    ],
  },
  markdown: {
    lineNumbers: true,
    config(md) {
      md.use(containerPreview)
      md.use(componentPreview)

      md.renderer.rules.heading_close = (tokens, idx, options, env, slf) => {
        let htmlResult = slf.renderToken(tokens, idx, options)
        if (tokens[idx].tag === 'h1')
          htmlResult += `<ArticleMetadata />`
        return htmlResult
      }
    },
  },
})

function getFilesInDirectory(directoryPath: string) {
  try {
    const files = readdirSync(`./docs/${directoryPath}`)
    const markdownFiles = files.filter(file => extname(file) === '.md') // 只保留 Markdown 文件
    const filePaths = markdownFiles.map(file => join(directoryPath, file))
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
