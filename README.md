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


## Options: elf.config.js

---

### entry

* Type: `String | String[] | { [entryName: string]: string }`

* Default: `src/index.js`

The bundle's entry point(s).

### name

* Type: `String`

* Default: `package.json` name prop

Necessary for iife/umd bundles that exports values in which case it is the global variable name representing your bundle

### serveDir

* Type: `String`

* Default: `dist`

The directory in which all generated bundle are placed. Only works for `serve` command.

### outputDir

* Type: `String`

* Default: `lib`

The directory in which all generated bundle are placed. Works for `build`, `iife`, `umd` command.

### modes

* Type: `String | String[]`
* Default: `esm`

Specifies the format of the generated bundle. Only works for `build` command. 

The value can be one or more than one of the following:

  * amd
  * cjs
  * esm
  * system

### modules

* Type: `Object[]`
* Default: undefined

Build the library in multi-module mode. Each item spacifies the `elf.config.js` attrs and extends `elf.config.js`
attrs value

### configureRollup

* Type: `Function | Object`
* Default: `null`

Being an Object, it will be merged into the final rollup config using `_.merge`

Being a Function, it will receive the rollup config as the argument, and return an object as the rollup config

### pluginOptions

* Type: `Object`
* Default: see default options structure

The 3rd party plugin options

### watchOptions

* Type: `Object`
* Default: see default options structure

It is rollup's `watch-options`. See [#watch-options](https://rollupjs.org/guide/en/#watch-options)

## Default Options Structure

```js
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
```

## License

[MIT](https://github.com/maiwenan/vuex-wait/blob/master/README.md)
