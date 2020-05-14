# netlify-plugin-inline-critical-css

A Netlify Build plugin to extract and inline your [critical CSS](https://web.dev/extract-critical-css/), built on top of the [`critical` package](https://github.com/addyosmani/critical). It extracts the CSS for above-the-fold content and inlines it into the HTML document in order to render content to the user as fast as possible.

Inlining the critical CSS directly into the HTML document eliminates additional requests and can be used to deliver a “one roundtrip” critical path where only the HTML is a blocking resource. You can use this plugin together with [`netlify-plugin-inline-source`](https://github.com/tom-bonnike/netlify-plugin-inline-source) to inline your other assets/sources such as small images, SVGs or render-blocking scripts.

## Usage and inputs

To install the plugin, add it to your `netlify.toml` file.

```toml
[[plugins]]
  package = "netlify-plugin-inline-critical-css"
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
