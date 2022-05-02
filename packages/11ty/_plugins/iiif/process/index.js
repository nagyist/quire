const fs = require('fs-extra')
const path = require('path')
const initCreateImage = require('./createImage')
const initCreateManifest = require('./createManifest')
const initTileImage = require('./tileImage')

/**
 * Creates tiles for zoomable images 
 * Processes image transformations from `config.imageTransformations`
 * Creates manifests for figures in figures.yaml with `choices`
 * Outputs manifests, images, and tiles to IIIF config.output
 *
 * @param  {Object} eleventyConfig
 */
module.exports = {
  init: (eleventyConfig) => {
    /**
     * IIIF config
     */
    const { config, iiifConfig, figures } = eleventyConfig.globalData
    const {
      imageTransformations,
      root
    } = iiifConfig
    const { imageDir } = config.params

    const createImage = initCreateImage(eleventyConfig)
    const createManifest = initCreateManifest(eleventyConfig)
    const tileImage = initTileImage(eleventyConfig)

    const figuresToTile = figures.figure_list
      .filter(({ preset, iiifContent, manifestId }) => preset === 'zoom' && !iiifContent && !manifestId)
      .flatMap((figure) => figure.choices || figure)

    /**
     * IIIF Processor
     * @param  {Object} options
     * @property  {Boolean} debug Default `false`
     * @property  {Boolean} lazy If true, only processes new images. Default `true`
     */
    return async(options = {}) => {
      options = {
        debug: false,
        lazy: true,
        ...options
      }
      const { debug, lazy } = options

      const promises = []
      figuresToTile.forEach((figure) => {
        const imagePath = path.join(root, imageDir, figure.src)
        const id = path.parse(imagePath).name

        if (debug) {
          console.warn(`[iiif:processImages:${id}] Starting`)
        }

        promises.push(
          imageTransformations.map((transformation) => {
            return createImage(imagePath, transformation, options);
          })
        )
        promises.push(tileImage(imagePath, options))
      })

      // Build manifests for figures with choices
      const figuresWithChoices = figures.figure_list.filter(
        ({ choices }) => choices && choices.length
      )
      promises.push(figuresWithChoices.map((figure) => {
        return createManifest(figure, options)
      }))

      await Promise.all(promises)

      if (debug) {
        console.warn(`[iiif:processImages] Done`)
      }
    }
  }
}
