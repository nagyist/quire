import { html } from '#lib/common-tags/index.js'
import path from 'node:path'

/**
 * Renders an image with a caption and annotations UI
 *
 * @param      {Object} eleventyConfig  eleventy configuration
 * @param      {Object} figure          The figure object
 *
 * @return     {String}  HTML containing  a `figureImageElement`, a caption and annotations UI
 */
export default function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureImageElement = eleventyConfig.getFilter('figureImageElement')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureModalLink = eleventyConfig.getFilter('figureModalLink')
  const markdownify = eleventyConfig.getFilter('markdownify')

  const { imageDir } = eleventyConfig.globalData.config.figures

  return async function(figure) {
    const {
      caption,
      credit,
      id,
      isSequence,
      label
    } = figure

    const labelElement = figureLabel({ id, label, isSequence })

    /**
     * Wrap image in modal link
     */
    let imageElement = await figureImageElement(figure, { interactive: false })
    imageElement = figureModalLink({ content: imageElement, id })

    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      ${imageElement}
      ${captionElement}
    `
  }
}
