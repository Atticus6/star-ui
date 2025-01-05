const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

const generators = ['component', 'util', 'hook']
const generatorsName = {
  component: '组件',
  util: '工具函数',
  hook: 'hook',
}
/**
 * @param {import("plop").NodePlopAPI} plop
 */
module.exports = function main(plop) {
  plop.setHelper('capitalize', (text) => {
    return capitalize(camelCase(text))
  })
  plop.setHelper('camelCase', (text) => {
    return camelCase(text)
  })

  generators.forEach((gen) => {
    const nickname = generatorsName[gen]
    plop.setGenerator(gen, {
      description: `生成一个${nickname}`,
      prompts: [{
        type: 'input',
        name: `${gen}Name`,
        message: `请输入${nickname}的名字:`,
        validate: (value) => {
          if (!value) {
            return `${nickname}的名字是必须的`
          }

          if (gen === 'hook' && !value.startsWith('use-')) {
            return 'hooks 必须以\'use-\'开始'
          }
          if (value !== value.toLowerCase()) {
            return `${nickname}的名字必须小写`
          }

          if (value.includes(' ')) {
            return `${nickname}的名字不能有空格`
          }

          return true
        },
      }, ...(gen === 'component'
        ? [
            {
              type: 'list',
              name: 'type',
              message: '请选择组件类型:',
              choices: ['tsx', 'sfc'],
            },
          ]
        : []), {
        type: 'input',
        name: 'description',
        message: `请输入${nickname}的描述:`,
      }],
      actions(answers) {
        const actions = []

        if (!answers)
          return actions

        const { description, outDir, type } = answers
        const generatorName = answers[`${gen}Name`] ?? ''

        const user = getGitUser()

        const data = {
          [`${gen}Name`]: generatorName,
          description,
          outDir,
          username: user.name,
          email: user.email,
          createAt: new Date().toISOString().split('T')[0],
        }

        let cmpType = ''
        if (type && type.length !== 0) {
          cmpType = `-${type}`
        }

        actions.push({
          type: 'addMany',
          templateFiles: `plop/${gen + cmpType}/**`,
          destination: `./src/${gen}s/${generatorName}`,
          base: `plop/${gen + cmpType}`,
          data,
          abortOnFail: true,
        })

        return actions
      },
    })
  })
}

// 工具函数
function getGitUser() {
  try {
    const name = execSync('git config user.name', { encoding: 'utf-8' }).trim()
    const email = execSync('git config user.email', {
      encoding: 'utf-8',
    }).trim()
    const contributorsPath = path.resolve(__dirname, 'contributors.json')
    let contributors = []
    if (fs.existsSync(contributorsPath)) {
      contributors = JSON.parse(fs.readFileSync(contributorsPath, 'utf-8'))
    }
    const existingContributor = contributors.find(
      contributor => contributor.name === name || contributor.email === email,
    )
    if (!existingContributor) {
      contributors.push({
        name,
        email,
        contributions: 1,
        avatar: '',
      })
    }
    else {
      existingContributor.contributions
          = (existingContributor.contributions || 0) + 1
    }
    fs.writeFileSync(
      contributorsPath,
      JSON.stringify(contributors, null, 2),
      'utf-8',
    )
    return { name, email }
  }
  catch (error) {
    console.error('Failed to get Git user:', error.message)
    return { user: '', email: '' }
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function camelCase(str) {
  return str.replace(/[-_](\w)/g, (_, c) => c.toUpperCase())
}
