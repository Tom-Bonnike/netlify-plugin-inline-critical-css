const readdirp = require('readdirp')
const critical = require('critical')

const getHtmlFiles = async (directory) => {
  const files = await readdirp.promise(directory, { fileFilter: '*.html' })

  return files.map((file) => file.fullPath)
}

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR)

    try {
      // Ignore penthouse/puppeteer max listener warnings.
      // See https://github.com/pocketjoso/penthouse/issues/250.
      // One penthouse call is made per page and per screen resolution.
      process.setMaxListeners(htmlFiles.length * inputs.dimensions.length)

      const inlineCriticalPromises = htmlFiles.map((filePath) =>
        critical.generate({
          base: constants.PUBLISH_DIR,
          // Overwrite files by passing the same path for `src` and `target`.
          src: filePath,
          target: filePath,
          inline: true,
          minify: inputs.minify,
          extract: inputs.extract,
          dimensions: inputs.dimensions
        })
      )

      await Promise.all(inlineCriticalPromises)
      console.log('Critical CSS successfully inlined!')
    } catch (error) {
      return utils.build.failBuild('Failed to inline critical CSS.', { error })
    }
  }
}
