module.exports = {
  entry: 'src/index.js',
  name: '', // the rollup output.name, default to package.json name attr
  serveDir: 'dist',
  outputDir: 'lib',
  modes: 'esm',
  lintOnSave: false,
  configureRollup: null,
  modules: undefined,
  pluginOptions: {
    replace: {},
    alias: {
      vue$: 'vue/dist/vue.esm.js'
    },
    resolve: {
      browser: true,
      extensions: ['.js', '.jsx', '.css', '.less', '.sass', '.scss', '.vue', '.ts', '.tsx']
    },
    postcss: {},
    commonjs: {},
    vue: {
      include: [/\.vue$/i],
      css: false
    },
    typescript2: false,
    terser: {},
    visualizer: {},
    progress: {},
    serve: {},
    livereload: {},
    html: {}
    // ...
  },
  watchOptions: {
    include: [
      'src/**'
    ]
  }
}
