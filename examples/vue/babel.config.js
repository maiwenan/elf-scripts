
module.exports = {
  plugins: [
    '@vue/babel-plugin-transform-vue-jsx'
  ],
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 2
      }
    ]
  ]
}
