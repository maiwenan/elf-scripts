
const path = require('path')
const fs = require('fs')
const fsp = fs.promises

module.exports = {
  parseName (name) {
    const match = name.match(/\/(.*)/)

    return match ? match[1] : name
  },

  camel (name) {
    const matcher = match => match.toUpperCase()

    return name
      .replace(/^[a-z]{1}/, matcher)
      .replace(/-[a-z]{1}/, matcher)
  },

  resolvePath (src) {
    return path.resolve(process.cwd(), src)
  },

  importCjsModule (moduleName) {
    const filePath = this.resolvePath(moduleName)
    let data = {}

    if (fs.existsSync(filePath)) {
      data = require(filePath)
    }
    return data
  },

  async readEntryModule (entryPath) {
    const result = {}
    const extList = ['.js', '.jsx', '.tx', '.tsx', '.vue']
    const read = async (entryPath, namespace = []) => {
      const files = await fsp.readdir(entryPath)

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filePath = path.resolve(entryPath, file)
        const stat = await fsp.stat(filePath)
        const { ext, name } = path.parse(file)
        const newspace = namespace.concat([name])

        if (stat.isDirectory()) {
          await read(filePath, newspace)
        } else if (extList.indexOf(ext) !== -1) {
          const chunk = path.normalize(newspace.join('/'))

          result[chunk] = filePath
        }
      }
    }

    await read(entryPath)
    return result
  },

  isDirectory (dir) {
    const dirPath = this.resolvePath(dir)
    const stat = fs.statSync(dirPath)

    return stat.isDirectory()
  }
}
