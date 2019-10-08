# elf-scripts

bundle your library happily with rollup


## Install

```shell
npm install elf-scripts --save-dev
```

## Usage 

add scripts in your `package.json` :

```
// package.json
{
  "scripts": {
    "serve": "elf-scripts serve",
    "iife": "elf-scripts iife",
    "umd": "elf-scripts umd",
    "build": "elf-scripts build"
  }
}
```

### elf-scripts serve

```text
Usage: elf-scripts serve [options]

Options:

  --env, -e            specify bundle environment (default: develoment)
```



### elf-scripts iife

```text
Usage: elf-scripts iife [options]

Options:

  --env, -e            specify bundle environment (default: production)
  --modern, -m         bundle library targeting modern browsers
```

### elf-scripts umd

```text
Usage: elf-scripts umd [options]

Options:

  --env, -e            specify bundle environment (default: production)
  --modern, -m         bundle library targeting modern browsers
```

### elf-scripts build

```text
Usage: elf-scripts build [options]

Options:

  --env, -e            specify bundle environment (default: production)
  --modern, -m         bundle library targeting modern browsers
```


## elf.config.js

---

### name

```js
{ name: 'girl' }
```

In which case, loading can be accessed from `store.state.girl`

Defaults to `loading`


## State Structure

```js
module.exports = {
  entry: 'src/index.js',
  name: '', // the rollup output.name, default to package.json name attr
  serveDir: 'dist',
  outputDir: 'lib',
  modes: 'esm',
  lintOnSave: false,
  configureRollup: null,
  solution: [],
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
```

## License

[MIT](https://github.com/maiwenan/vuex-wait/blob/master/README.md)
