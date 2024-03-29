const readdirp = require('readdirp')
const critical = require('critical')

const getHtmlFiles = async (directory, inputs = {}) => {
  const files = await readdirp.promise(directory, {
    fileFilter: inputs.fileFilter,
    directoryFilter: inputs.directoryFilter
  })

  return files.map((file) => file.fullPath)
}

module.exports = {
  onPostBuild: async ({ inputs, constants, utils }) => {
    const htmlFiles = await getHtmlFiles(constants.PUBLISH_DIR, inputs)

    try {
      // Ignore penthouse/puppeteer max listener warnings.
      // See https://github.com/pocketjoso/penthouse/issues/250.
      // One penthouse call is made per page and per screen resolution.
      process.setMaxListeners(inputs.dimensions.length + 1)

      // Process each page in sequence to avoid lingering processes and memory
      // issues, at the cost of a slower execution.
      // `critical` might offer this feature at some point:
      // https://github.com/addyosmani/critical/issues/111
      for (const filePath of htmlFiles) {
        await critical.generate({
          base: constants.PUBLISH_DIR,
          // Overwrite files by passing the same path for `src` and `target`.
          src: filePath,
          target: filePath,
          inline: true,
          extract: inputs.extract,
          dimensions: inputs.dimensions,
          // Force critical to run penthouse only on a single page at a time to
          // avoid timeout issues.
          concurrency: 1,
          // Bump penthouse’s page load timeout to 2 minutes to avoid crashes
          // which could cause lingering processes as it’s possible some pages
          // can take a long time to load.
          penthouse: { timeout: 120000 }
        })
      }

      console.log('Critical CSS successfully inlined!')
    } catch (error) {
      return utils.build.failBuild('Failed to inline critical CSS.', { error })
    }
  }
}
