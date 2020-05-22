const readdirp = require('readdirp')
const critical = require('critical')
const asyncPool = require('tiny-async-pool')

const getHtmlFiles = async (directory) => {
  const files = await readdirp.promise(directory, {
    fileFilter: '*.html',
    directoryFilter: ['!node_modules']
  })

  return files.map((file) => file.fullPath)
}

const CRITICAL_CONCURRENCY_LIMIT = 4

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR)
    const criticalOptions = htmlFiles.map((filePath) => ({
      base: constants.PUBLISH_DIR,
      // Overwrite files by passing the same path for `src` and `target`.
      src: filePath,
      target: filePath,
      inline: true,
      minify: inputs.minify,
      extract: inputs.extract,
      dimensions: inputs.dimensions
    }))

    try {
      // Ignore penthouse/puppeteer max listener warnings.
      // See https://github.com/pocketjoso/penthouse/issues/250.
      // One penthouse call is made per page and per screen resolution.
      process.setMaxListeners(
        CRITICAL_CONCURRENCY_LIMIT * inputs.dimensions.length + 1
      )

      await asyncPool(
        CRITICAL_CONCURRENCY_LIMIT,
        criticalOptions,
        critical.generate
      )

      console.log('Critical CSS successfully inlined!')
    } catch (error) {
      return utils.build.failBuild('Failed to inline critical CSS.', { error })
    }
  }
}
