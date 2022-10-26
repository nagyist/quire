Promise.resolve(); // dummy call
/**
 * @fileOverview Quire CLI
 * @license MIT
 */

/**
 * Program
 *
 * @description CLI using the Commander library. Quire supports the following
 * commands:
 *
 * ### new <projectName>
 * Creates a new Quire project in the named directory. Uses `git clone` to grab
 * the Quire starter kit and starter theme from GitHub. Also uses `npm install`
 * to install theme dependencies.
 *
 * ### preview
 * Runs the `hugo server` and `webpack --watch` commands in their appropriate
 * directories at the same time, supporting live-reloading for both content
 * and theme files.
 *
 * ### site
 * Builds the theme using Webpack and then builds the website using Hugo.
 *
 * ### pdf
 * Runs the Hugo preview server, and then uses [Prince](http://www.princexml.com/)
 * to hit all pages that do not have `pdf: false` specified in their frontmatter.
 *
 * ### epub
 * Builds an epub version of the site. To be implemented.
 *
 */

/** Add polyfill for async await ES7 */
import "@babel/polyfill";
import CLI from "./cli";

const program = require("commander");
const cli = new CLI();

program.allowUnknownOption(false);

// Shut down child processes on program exit
process.on("SIGINT", () => {
  cli.emit("shutdown");
});

program
  .version(`v${require("../package").version}`)
  .option("-v, --verbose", "log verbose output")
  .option("-f, --file", "Add Filename and optional new filepath")
  .option("-e, --env", "Add environment variable");

program
  .command("new <projectName>")
  .description("Create a new Quire project in the current directory.")
  .action(projectName => {
    cli.verbose = program.verbose;
    cli.emit("new", projectName);
  });

program
  .command("preview [options]")
  .description("Run the preview server in the current directory")
  .action(() => {
    cli.verbose = program.verbose;
    cli.emit("preview");
  });

program
  .command("install")
  .description("Install this project's theme dependencies")
  .action(() => {
    cli.verbose = program.verbose;
    cli.emit("install");
  });

// quire site
//
// run the build command in the current directory
// Pass optional config from config/environments/[env].yml to hugo
//
program
  .command("site [env]")
  .option("-e, --env", "Add environment variable")
  .alias("build")
  .description("Run the build command in the current directory")
  .action(env => {
    cli.verbose = program.verbose;
    cli.emit("site", env);
  });

// quire pdf
//
// run the build command in the current directory
// Pass optional config from config/environments/[env].yml to hugo
//
program
  .command("pdf [file] [env]")
  .option("-f, --file", "Add Filename and optional new filepath")
  .option("-e, --env", "Add environment variable")
  .description("Generate a PDF version of the current project")
  .action((file, env) => {
    cli.verbose = program.verbose;
    cli.emit("pdf", file, env);
  });

// quire epub
//
// run the build command in the current directory
// Pass optional config from config/environments/[env].yml to hugo
//
program
  .command("epub [file] [env]")
  .option("-f, --file", "Add Filename and optional new filepath")
  .option("-e, --env", "Add environment variable")
  .description("Generate an EPUB version of the current project")
  .action((file, env) => {
    cli.verbose = program.verbose;
    cli.emit("epub", file, env);
  });

// quire process
//
// Run Quire processes.
// Options:
// --iiif Tile images for IIIF
//
program
  .command("process")
  .option("--iiif", "Tile images for IIIF.")
  .description("Run Quire processes.")
  .action((options) => {
    const validOptions = options.options.map((o) => o.long.replace('--', ''));
    const option = validOptions.find((key) => options[key]);
    if (!option) {
      console.error(`"quire process" requires an option. Run "quire process --help" to list options.`);
      return false;
    }

    cli.verbose = program.verbose;
    cli.emit("process", option);
  });


// quire epub
//
// run the build command in the current directory
// Pass optional config from config/environments/[env].yml to hugo
//
program
  .command("mobi [file] [env]")
  .option("-f, --file", "Add Filename and optional new filepath")
  .option("-e, --env", "Add environment variable")
  .description("Generate an MOBI version of the current project")
  .action((file, env) => {
    cli.verbose = program.verbose;
    cli.emit("mobi", file, env);
  });

// quire template
//
// download quire templates
//
program
  .command("template [type]")
  .option("-t, --type", "Select template to download (Currently only EPUB supported)")
  .description("Download templates to customize your file output (Currently only EPUB supported)")
  .action(type => {
    cli.verbose = program.verbose;
    cli.emit("template", type);
  });

// quire debug
program
  .command("debug")
  .description("Development use only - log info about current project")
  .action(() => {
    cli.verbose = program.verbose;
    cli.emit("debug");
  });

// check for invalid command -- if none output --help
program.on("command:*", function() {
  console.error("Invalid command: %s\n", program.args.join(" "));
  program.help();
  process.exit(1);
});

// Run the program
program.parse(process.argv);

// check for argument -- if none output --help
if (!process.argv.slice(2).length) {
  program.help();
  process.exit(1);
}