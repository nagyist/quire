/**
 * Renders <head> <meta> data tags for Open Graph protocol data
 *
 * @param      {Object}  data    data
 * @return     {String}  HTML meta and link elements
 */
module.exports = class OpenGraph {
  data() {
    const { description, identifier, promo_image, pub_date, pub_type } = publication
    const pageType = this.page.type

    const meta: [
      {
        property: 'og:title',
        content: pageType != 'essay' ? site.title : page.title
      },
      {
        property: 'og:url',
        content: pageType != 'essay' ? site.baseURL : permalink
      },
      {
        property: 'og:image',
        content: pageType != 'essay'
          ? promo_image
          : page.cover || promo_image
      },
      {
        property: 'og:description',
        content: pageType != 'essay'
          ? description.one_line || description.full
          : page.abstract || description.one_line || description.full
      }
    ]

    if (pageType != 'essay' && pub_type === 'book') {
      meta.push({ property: 'og:type', content: 'book' })
      meta.push({
        property: 'og:book:isbn', content: identifier.isbn.replace(/-/g, '')
      })
      meta.push({ property: 'og:book:release_date', content: pub_date })
    } else {
      meta.push({ property: 'og:type', content: 'article' })
      meta.push({ property: 'og:site_name', content: site.title })
      meta.push({ property: 'og:article:published_time', content: pub_date })
    }

    /**
     * Builds an array of page or publication contributor objects
     */
    publication.contributor.forEach((contributor, { id }) => {
      // resolve a page contributor id to a publication contributor
      contributor = publication.contributor[id] ?? contributor

      const { type, full_name, first_name, last_name } = contributor
      const name = full_name || `${first_name} ${last_name}`

      if (pageType === 'essay') {
        meta.push({ name: 'og:article:author', content: name })
      } else if (pub_type === 'book' && type === 'primary') {
        meta.push({ name: 'og:book:author', content: name })
      }
    })
  }

  render({ link, meta }) {
    const metaTags = meta.map(({ property, content }) => (
      `<meta property="${property}" content="${content}">`
    ))
    return `${metaTags.join('\n')}`
  }
}