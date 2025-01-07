import type { Plugin } from 'vite'

export function MarkdownTransform(): Plugin {
  return {
    name: 'starui-md-transform',
    enforce: 'pre',
    async transform(code, id) {
      if (!id.match(/\.md\b/))
        return null

      const [_name, i] = id.split('/').slice(-2)

      // cut index.md
      if (_name === 'docs' && i === 'index.md') {
        return code
      }

      const ContributorsSection = `## 贡献者
  <Contributors/>`

      code = replacer(code, ContributorsSection, 'FOOTER', 'tail')

      return code
    },
  }
}

export function replacer(code: string, value: string, key: string, insert: 'head' | 'tail' | 'none' = 'none') {
  const START = `<!--${key}_STARTS-->`
  const END = `<!--${key}_ENDS-->`
  const regex = new RegExp(`${START}[\\s\\S]*?${END}`, 'im')

  const target = value ? `${START}\n${value}\n${END}` : `${START}${END}`

  if (!code.match(regex)) {
    if (insert === 'none')
      return code
    else if (insert === 'head')
      return `${target}\n\n${code}`
    else
      return `${code}\n\n${target}`
  }

  return code.replace(regex, target)
}
