const { html } = require('~lib/common-tags')
/**
 * A shortcode for embedding a media player that supports video playback into the document.
 * @param {String} src  Source url for the video
 * @return {String}  An HTML <video> element
 */
module.exports = function(eleventyConfig) {
  const figureCaption = eleventyConfig.getFilter('figureCaption')
  const figureLabel = eleventyConfig.getFilter('figureLabel')
  const figureVideoElement = eleventyConfig.getFilter('figureVideoElement')

  return function({
    aspect_ratio: aspectRatio,
    caption,
    credit,
    id,
    label,
    media_id,
    media_type: mediaType,
    poster,
    src
  }) {
    const isEmbed = mediaType === 'vimeo' || mediaType === 'youtube'
    const videoElement = figureVideoElement({ id, media_id, media_type: mediaType, src, poster })
    const labelElement = figureLabel({ caption, id, label })
    const captionElement = figureCaption({ caption, content: labelElement, credit })

    return html`
      <div class="q-figure__media-wrapper ${isEmbed && 'q-figure__media-wrapper--' + (aspectRatio || 'widescreen')}">
        ${videoElement}
      </div>
      ${captionElement}
    `
  }
}
