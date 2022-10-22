import { execaCommand } from 'execa'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import paths from './paths.js'

/**
 * A wrapper module for the Eleventy CLI
 * @see https://www.11ty.dev/docs/usage/#command-line-usage
 */
export default {
  build: async (options = {}) => {
    const projectRoot = path.resolve('../../packages/11ty')
    process.cwd(projectRoot)

    console.info('[CLI:11ty] running eleventy build')
    console.info(`[CLI:11ty] projectRoot ${projectRoot}`)

    const { config, input, output } = paths

    console.debug('[CLI:11ty] %o', paths)

    const eleventyOptions = [
      `--config=${config}`,
      `--input=${input}`,
      `--output=${output}`,
      `--incremental`,
    ]

    if (options['dry-run']) cmdOpts.push('--dryrun')
    if (options.quiet) cmdOpts.push('--quite')

    const command = `npx @11ty/eleventy ${eleventyOptions.join(' ')}`

    execaCommand(command).stdout.pipe(process.stdout)
  }
}