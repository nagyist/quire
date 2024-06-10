import { paths, projectRoot  } from '#lib/11ty/index.js'
import Command from '#src/Command.js'
import fs from 'fs-extra'
import libPdf from '#lib/pdf/index.js'
import open from 'open'
import path from 'node:path'
import { validateUserConfig } from '../../../11ty/_plugins/globalData/validator.js'
import yaml from 'js-yaml'

/**
 * @function loadConfig(path) - loads and validates quire config, returns an empty object if not found
 *  
 * @param {path} string - file path to config file
 * 
 * @todo refactor loading configs to a separate module,
 * which uses the same validator(s) as the build proceess
 * 
 * @return {Object|undefined} User configuration object or undefined
 */
function loadConfig(confPath) {
  if (!fs.existsSync(confPath)) {
    return undefined
  }

  const data = fs.readFileSync(confPath)
  let config = yaml.load(data)

  // NB: Schemas may be project specific so the CLI must loads from project root rather than package root
  const schemaPath = path.join(projectRoot,'_plugins','schemas','config.json')

  // TODO: Check the project version string for whether we should check the schema
  if (fs.existsSync(schemaPath)) {

    const sch = fs.readFileSync(schemaPath)
    const schema = JSON.parse(sch)      

    config = validateUserConfig('config',data,{config: schema})
  }

  return config
}

const quireConfig = loadConfig(path.join(projectRoot,'content','_data','config.yaml'))

/**
 * Quire CLI `pdf` Command
 *
 * Generate PDF from Eleventy `build` output.
 *
 * @class      PDFCommand
 * @extends    {Command}
 */
export default class PDFCommand extends Command {
  static definition = {
    name: 'pdf',
    description: 'Generate publication PDF',
    summary: 'run build pdf',
    version: '1.0.0',
    args: [
    ],
    options: [
      [
        '--lib <module>', 'use the specified pdf module', 'pagedjs',
        { choices: ['pagedjs', 'prince'], default: 'pagedjs' }
      ],
      [ '--page-pdfs', 'Produce PDFs for each quire page enabled with `paged-pdf`'],
      // @todo [ '--websafe', 'Make the PDF websafe (no crop marks+margins, downsample images)'],
      // @todo [ '--output-dir', 'Output the PDF to this directory'],
      // @todo (also name the default text here "configured"? [ '--filename <string>', 'Use this as the prefix for PDF ouptuts', {default: quireConfig?.pdf?.filename ?? 'publication' }],
      [ '--open', 'open PDF in default application' ],
      [ '--debug', 'run build with debug output to console' ],
    ],
  }

  constructor() {
    const config = loadConfig(path.join(projectRoot,'content','_data','config.yaml'))
    super(PDFCommand.definition)
  }

  async action(options, command) {
    if (options.debug) {
      console.debug('[CLI] Command \'%s\' called with options %o', this.name(), options)
    }

    const publicationInput = path.join(projectRoot, paths.output, 'pdf.html')
    const coversInput = path.join(projectRoot, paths.output, 'pdf-covers.html')

    if (quireConfig===undefined) {
      console.error(`[quire pdf]: ERROR Unable to find a configuration file at ${path.join(projectRoot,'content','_data','config.yaml')}\nIs the command being run in a quire project?`)
      process.exit(1)
    }

    if (!fs.existsSync(publicationInput)) {
      console.error(`[quire pdf]: ERROR Unable to find PDF input at ${publicationInput}\nPlease first run the 'quire build' command.`)
      process.exit(1)
    }

    const output = quireConfig.pdf !== undefined ? path.join(paths.output, quireConfig.pdf.outputDir, `${quireConfig.pdf.filename}.pdf`) : path.join(projectRoot, `${options.lib}.pdf`)

    const pdfLib = await libPdf(options.lib, { ...options, pdfConfig: quireConfig.pdf })
    await pdfLib(publicationInput, coversInput, output)

    try {
      if (fs.existsSync(output) && options.open) open(output)
    } catch (error) {
      console.error(`[quire pdf]: ERROR`,error)
      process.exit(1)
    }
  }

  /**
   * @todo test if build has already be run and output can be reused
   */
  preAction(command) {
    // testcwd(command)
  }
}
