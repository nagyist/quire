const path = require('path')
const { html } = require('~lib/common-tags')
/**
 * Renders a TOC List
 *
 * @param     {Object} eleventyConfig
 * @param     {Object} params
 * @property  {Object} collection An eleventy collection, such as `collection.tableOfContentsEpub`
 * @property  {Object} page The current page object
 * @property  {String} presentation How the TOC should display. Possible values: ['abstract', 'brief', 'grid']
 *
 * @return {String} TOC list
 */
module.exports = function(eleventyConfig) {
  const eleventyNavigation = eleventyConfig.getFilter('eleventyNavigation')
  const tableOfContentsItem = eleventyConfig.getFilter('tableOfContentsItem')

  return function(params) {
    const { collection, currentPageUrl, presentation } = params

    /**
     * Determine if we are rendering a section or publication Table of Contents
     */
    const findNavigationItem = (url, items) => {
      if (!items || !items.length) return
      let item = items.find((page) => url === page.url)
      if (!item) {
        items = items.flatMap((item) => item.children)
        return findNavigationItem(url, items)
      }
      return item
    }
    const currentNavigationItem = findNavigationItem(currentPageUrl, eleventyNavigation(collection))

    if (!currentNavigationItem) return

    const navigation = currentNavigationItem.children && currentNavigationItem.children.length
      ? currentNavigationItem.children
      : eleventyNavigation(collection)

    const filterCurrentPage = (pages) => {
      return pages.filter((page) => {
        return page && page.url !== currentPageUrl
      })
    }

    const renderList = (pages) => {
      const otherPages = filterCurrentPage(pages);
      return html`
        <ol class="toc-list">
          ${otherPages.map((page) => {
            if (presentation !== 'brief' && page.children && page.children.length) {
              const children = renderList(page.children)
              return `${tableOfContentsItem({ children, page, presentation })}`
            }
            return `${tableOfContentsItem({ page, presentation })}`
          })}
        </ol>`
    }

    return html`
      <div class="menu-list">
        ${renderList(navigation)}
      </div>
    `
  }
}