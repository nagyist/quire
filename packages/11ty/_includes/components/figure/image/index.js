/**
 * Render all `image` outputs
 */
export default function(eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function(params) {
    return renderOutputs(__dirname, params)
  }
}
