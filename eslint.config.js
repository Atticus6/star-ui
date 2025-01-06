import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  unocss: true,
  rules: {
    'style/eol-last': 'off',
  },
})
