/**
 * @param  {Object} context
 */
module.exports = function (eleventyConfig) {
  const publicationContributors = eleventyConfig.getFilter('MLAPublicationContributors');
  const publishers = eleventyConfig.getFilter('MLAPublishers');
  const pubSeries = eleventyConfig.getFilter('pubSeries');
  const pubYear = eleventyConfig.getFilter('pubYear');
  const siteTitle = eleventyConfig.getFilter('siteTitle');
  const {
    contributor: contributors,
    identifier,
    pub_date: pubDate,
    publisher,
  } = eleventyConfig.globalData.publication;

  return function (params) {
    let citation;

    if (contributors) citation = publicationContributors()

    const titleElement = `<em>${siteTitle()}.</em>`
    citation = (citation)
      ? [citation, titleElement].join('. ')
      : titleElement;

    if (pubSeries()) citation = [citation, pubSeries()].join('');

    if (publisher.length) citation = [citation, publishers()].join(' ');

    if (pubDate) {
      citation = [citation, pubYear({ date: pubDate })].join(', ');
    }

    citation += '. ';

    if (identifier.url) {
      citation += `<span class="url-string">${identifier.url}</span>.`;
    }

    citation = [citation, `Accessed <span class="cite-current-date">DD Mon. YYYY</span>.`].join(' ');

    return citation;
  };
};