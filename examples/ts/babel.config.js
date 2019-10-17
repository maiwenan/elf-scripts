
module.exports = {
  plugins: [
    '@vue/babel-plugin-transform-vue-jsx',
    ['@babel/plugin-proposal-decorators', { legacy: true }]
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
