const path = require ('path')
const { oneLine } = require('common-tags')

/**
 * Renders a TOC item
 *
 * @param     {Object} context
 * @param     {String} params
 * @property  {Array} children - The TOC page item's child pages
 * @property  {String} page - The TOC item's page data
 * @property  {String} presentation How the TOC should display. Possible values: ['abstract', 'brief', 'grid', 'list']
 *
 * @return {String} TOC item markup
 */
module.exports = function (eleventyConfig) {
  const tableOfContentsGridItem = eleventyConfig.getFilter('tableOfContentsGridItem')
  const tableOfContentsListItem = eleventyConfig.getFilter('tableOfContentsListItem')

  return function (params) {
    const {
      children='',
      page,
      presentation
    } = params

    const classes = []
    const level = page.parent ? page.parent.split('/').length : 0
    classes.push(`level-${level}`)
    if (children) {
      classes.push('section-item')
    } else {
      classes.push('page-item')
    }

    return presentation === 'grid' 
      ? tableOfContentsGridItem({ children, classes, page })
      : tableOfContentsListItem({ children, classes, page, presentation })
  }
}
