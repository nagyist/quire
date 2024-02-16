import chalkFactory from '#lib/chalk/index.js'
import fs from 'fs-extra'
import path from 'node:path'
import parser from './parser.js'

const logger = chalkFactory('[plugins:globalData]')

/**
 * Throws an error if data contains duplicate ids
 * @param  {Object|Array} data
 */
const checkForDuplicateIds = function (data, filename) {
  if (!data) return

  if (Array.isArray(data)) {
    if (data.every((item) => item.hasOwnProperty('id'))) {
      const duplicates = data.filter((a, index) => {
        return index !== data.findIndex((b) => b.id === a.id)
      })
      if (duplicates.length) {
        const ids = duplicates.map(({ id }) => id)
        throw new Error(`Duplicates ids: ${ids.join(', ')}`)
      }
    }
  }

  if (typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      try {
        checkForDuplicateIds(data[key])
      } catch (error) {
        logger.error(`${filename} ${key} contains multiple entries with the same id.\nEach entry in ${key} must have a unique id. ${error.message}`)
      }
    })
  }
}

/**
 * @todo replace with ajv schema validation
 */
const validatePublication = (publication) => {
  const { url } = publication
  try {
    publication.url = url.endsWith('/') ? url : url + '/'
    publication.pathname = new URL(publication.url).pathname
  } catch (errorMessage) {
    logger.error(
      `Publication.yaml url property must be a valid url. Current url value: "${url}"`
    )
    throw new Error(errorMessage)
  }
  return publication
}

/**
 * Eleventy plugin to programmatically load global data from files
 * so that it is available to plugins and shortcode components.
 *
 * Nota bene: data is loaded from a sub directory of the `input` directory,
 * distinct from the `eleventyConfig.dir.data` directory.
 *
 * @param {Object} eleventyConfig
 * @param {Object} directoryConfig
 * @property {String} inputDir
 * @property {String} outputDir
 * @property {String} publicDir
 */
export default function(eleventyConfig, directoryConfig) {
  const dir = path.resolve(directoryConfig.inputDir, '_data')
  // console.debug(`[plugins:globalData] ${dir}`)
  const files = fs.readdirSync(dir)
    .filter((file) => path.extname(file) !== '.md')
  const parse = parser(eleventyConfig)

  for (const file of files) {
    const { name: key } = path.parse(file)
    let value = parse(path.join(dir, file))
    if (key === 'publication') {
      value = validatePublication(value)
    }
    if (key && value) {
      checkForDuplicateIds(value, file)
      eleventyConfig.addGlobalData(key, value)
    }
  }

  // Add directory config to globalData so that it is available to other plugins
  eleventyConfig.globalData.directoryConfig = directoryConfig

  return eleventyConfig.globalData
}
