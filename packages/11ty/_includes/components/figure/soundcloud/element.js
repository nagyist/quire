const { html } = require('~lib/common-tags')
const chalkFactory = require('~lib/chalk')

const { error } = chalkFactory('Figure Video')

module.exports = function (eleventyConfig) {
  return function ({ id, media_id: mediaId }) {
    if (!mediaId) {
      error(`Cannot render SoundCloud component without 'media_id'. Check that figures data for id: ${id} has a valid 'media_id'`)
      return ''
    }

    const src = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${mediaId}`

    return html`
      <iframe
        allow="autoplay"
        frameborder="no"
        height="166"
        scrolling="no"
        src="${src}&auto_play=false&color=%23ff5500&hide_related=true&show_comments=false&show_reposts=false&show_teaser=false&show_user=false"
        width="100%"
      ></iframe>
    `
  }
}
