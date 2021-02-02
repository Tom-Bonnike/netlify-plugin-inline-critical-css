# netlify-plugin-inline-critical-css

A Netlify Build plugin to extract and inline your [critical CSS](https://web.dev/extract-critical-css/), built on top of the [`critical` package](https://github.com/addyosmani/critical). It extracts the CSS for above-the-fold content and inlines it into the HTML document in order to render content to the user as fast as possible.

Inlining the critical CSS directly into the HTML document eliminates additional requests and can be used to deliver a “one roundtrip” critical path where only the HTML is a blocking resource. You can use this plugin together with [`netlify-plugin-inline-source`](https://github.com/tom-bonnike/netlify-plugin-inline-source) to inline your other assets/sources such as small images, SVGs or render-blocking scripts.

## Usage and inputs

To install the plugin in the Netlify UI, use this [direct in-app installation link](https://app.netlify.com/plugins/netlify-plugin-inline-critical-css/install) or go to the [Plugins directory](https://app.netlify.com/plugins).

For file-based installation, add it to your `netlify.toml` file.

```toml
[[plugins]]
  package = "netlify-plugin-inline-critical-css"

  # All inputs are optional, so you can omit this section.
  # Defaults are shown below.
  # You can also refer to `critical`’s documentation: https://github.com/addyosmani/critical.
  [plugins.inputs]
    # Whether to minify the generated critical-path CSS.
    minify = true

    # A filter used to target files in the publish directory. This option is
    # passed onto the readdirp library. Be sure to target only HTML files.
    fileFilter = "*.html"

    # A list of directories to target or ignore. This is also passed on to
    # readdirp.
    directoryFilter = ["!node_modules"]

    # Whether to remove the inlined styles from any stylesheets referenced in the HTML. Use with caution. Removing the critical CSS per page results in a unique async loaded CSS file for every page, meaning you can’t rely on cache across multiple pages.
    extract = false

    # An array of objects containing `width` and `height` to deliver critical CSS for multiple screen resolutions.
    [[plugins.inputs.dimensions]]
      width = 414
      height = 896
    [[plugins.inputs.dimensions]]
      width = 1920
      height = 1080
```

To complete file-based installation, from your project's base directory, use npm, yarn, or any other Node.js package manager to add the plugin to `devDependencies` in `package.json`.

```bash
npm install -D netlify-plugin-inline-critical-css
```

Once installed and configured, the plugin will automatically run on the Netlify CI.

### Testing locally

To test this plugin locally, you can use the [Netlify CLI](https://github.com/netlify/cli):

```bash
# Install the Netlify CLI.
npm install netlify-cli -g

# In the project working directory, run the build as Netlify would with the build bot.
netlify build
```
