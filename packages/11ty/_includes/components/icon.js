const { html } = require('~lib/common-tags')
const path = require('path')

/**
 * A shortcode for including an inline SVG icon with a PNG fallback.
 *
 * Should be passed with a "type" that corresponds to an id in the "icons" partial, and an optional "description"
 *
 * @example.js
 * icon("link", "Open in new window")
 *
 * @example.liquid
 * {% icon type="link", description="Open in new window" %}
 */
module.exports = function(eleventyConfig) {
  const { imageDir } = eleventyConfig.globalData.config.params

  return function (params) {
    const { description, type } = params
    const iconPath = path.join(imageDir, 'icons', `${type}.png`)
    const descriptionElement = description
      ? `<span class="visually-hidden" data-outputs-exclude="epub">${description}</span>`
      : ''

    return html`
      <svg data-outputs-exclude="epub">
        <switch>
          <use xlink:href="#${type}-icon"></use>
          <foreignObject width="24" height="24">
            <img src="${iconPath}" alt="${description}" />
          </foreignObject>
        </switch>
      </svg>
      ${descriptionElement}
    `
  }
}
