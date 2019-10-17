
module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 2
      }
    ]
  ]
}
