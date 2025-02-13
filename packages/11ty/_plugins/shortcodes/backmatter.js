/**
 * Style wrapped `content` as "backmatter"
 *
 * @param      {String}  content  content between shortcode tags
 *
 * @return     {boolean}  A styled HTML <div> element with the content
 */
export default function (eleventyConfig) {
  return (content) => `<div class="backmatter">${content}</div>`
}
