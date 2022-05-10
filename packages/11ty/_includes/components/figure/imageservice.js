const { html } = require('common-tags')

/**
 * Image Service Web Component
 * @param      {Object} eleventyConfig  eleventy configuration
 * 
 * @param      {Object} params
 * @property   {String} figure
 * @return     {String}  An <image-service> element
 */
module.exports = function(eleventyConfig) {
  return function({ alt='', height='', preset='', region='', src, virtualSizes='', width='' }) {
    return html`
      <image-service 
        alt="${alt}"
        class="q-figure__image"
        height="${height}"
        preset="${preset}"
        region="${region}"
        src="${src}"
        virtual-sizes="${virtualSizes}"
        width="${width}">
      </image-service>`
  }
}
