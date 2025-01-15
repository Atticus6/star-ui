import { readdirSync, readFileSync } from 'node:fs'
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
          items: [
            { text: '开发规范', link: '/start' },
            { text: 'Vite插件', link: '/start/vite' },
          ],
        },
      ],
      components: [
        {
          text: '组件',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('components')),
          ).map(({ title, filePath }) => ({
            text: title === 'index' ? '介绍' : title,
            link: `/${filePath.replace(/\.md$/, '')}`,
          })),
        },
      ],
      utils: [
        {
          text: '工具函数',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('utils')),
          ).map(({ title, filePath }) => ({
            text: title === 'index' ? '介绍' : title,
            link: `/${filePath.replace(/\.md$/, '')}`,
          })),
        },
      ],
      hooks: [
        {
          text: 'Hooks',
          items: sortFilenames(
            extractFileNames(getFilesInDirectory('hooks')),
          ).map(({ title, filePath }) => ({
            text: title === 'index' ? '介绍' : title,
            link: `/${filePath.replace(/\.md$/, '')}`,
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
    const filePaths = markdownFiles.map((file) => {
      const filePath = join(directoryPath, file)
      const content = readFileSync(`./docs/${filePath}`, 'utf-8') // 读取文件内容
      return { filePath, content }
    })
    return filePaths
  }
  catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
}

// 从文件内容中提取一级标题（# 标题），如果没有找到一级标题，使用文件名
function extractFileNames(fileInfos: { filePath: string, content: string }[]) {
  return fileInfos.map(({ filePath, content }) => {
    const match = content.match(/^#\s+(.*)/m) // 匹配一级标题
    const title = match ? match[1].trim() : basename(filePath, extname(filePath)) // 如果找不到标题，使用文件名
    return { title, filePath }
  })
}

function sortFilenames(fileInfos: { title: string, filePath: string }[]) {
  return fileInfos.sort((a, b) => {
    if (a.title === 'index')
      return -1 // `index` 总是在最前
    if (b.title === 'index')
      return 1
    return a.title.localeCompare(b.title) // 按字母顺序排序
  })
}
