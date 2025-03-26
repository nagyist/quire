import path from 'node:path'

/**
 * Render all `table` outputs
 */
export default function (eleventyConfig) {
  const renderOutputs = eleventyConfig.getFilter('renderOutputs')
  return function (params) {
    return renderOutputs(path.dirname(import.meta.url), params)
  }
}
