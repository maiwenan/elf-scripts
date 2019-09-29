module.exports = mode => {
  return {
    entry: mode === 'build' ? 'src' : 'src/index.js'
  }
}
