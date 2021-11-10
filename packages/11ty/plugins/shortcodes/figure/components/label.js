const { oneLine } = require('common-tags')
/**
 * A figure label element
 * @params {string} label - the figure's label
 * @params {string} link - the link that opens the figure modal element. If provided, the label will include a fullscreen icon.
 * @return
 */
module.exports = function(eleventyConfig, { config }, { caption, id, label, src }) {
  const qicon = eleventyConfig.getFilter('qicon')
  const markdownify = eleventyConfig.getFilter('markdownify')
  const slugify = eleventyConfig.getFilter('slugify')

  const modalLink = function (content) {
    return config.params.figureModal
      ? `<a
            href="#deepzoom-${ id }"
            class="inline popup"
            data-type="inline"
            title="${markdownify(caption)}}">
            <span class="q-figure__label-icon">${qicon('fullscreen', 'Expand')}</span>
            ${content}
          </a>`
      : content
  }

  let labelElement

  if (config.epub && label) {
    labelElement = `<span class="q-figure__label">${markdownify(label)}</span>`
  } else {
    const modifier = config.params.figureLabelLocation || ''
    const labelText = label ? `<span class="q-figure__label-text">${markdownify(label)}</span>` : ''
    labelElement = `<span class="q-figure__label q-figure__label--${modifier}">
      ${modalLink(labelText)}
    </span>`
  }

  return oneLine`${labelElement}`
}
