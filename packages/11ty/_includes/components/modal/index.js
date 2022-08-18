const { html } = require('~lib/common-tags')

/**
 * Modal Tag
 *
 * @param      {Object}  eleventyConfig
 * @param      {Object}  globalData
 */
module.exports = function (eleventyConfig, { page }) {
  const lightboxSlides = eleventyConfig.getFilter('lightboxSlides')
  const lightboxUI = eleventyConfig.getFilter('lightboxUI')

  return function (figures=page.figures) {
    if (!figures) return;
    figures = figures.map((figure) => ({
      ...figure,
      preset: 'zoom'
    }))

    return html`
      <q-modal>
        <q-lightbox>
          ${lightboxSlides(figures)}
          ${lightboxUI(figures)}
        </q-lightbox>
        <button
          data-modal-close
          class="q-modal__close-button"
          id="close-modal"
        ></button>
      </q-modal>
    `;
  }
}
