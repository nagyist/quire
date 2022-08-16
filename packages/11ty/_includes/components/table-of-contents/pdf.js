/**
 * Render `table-of-contents` component with data from collections.pdf
 */
module.exports = function(eleventyConfig) {
  const tableOfContentsList = eleventyConfig.getFilter('tableOfContentsList')
  return function(params) {
    const { collections, currentPageUrl, presentation } = params
    return tableOfContentsList({ 
      collection: collections.tableOfContentsPdf,
      currentPageUrl,
      presentation
    })
  }
}