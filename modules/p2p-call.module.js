export default async function P2PCallModule(moduleOptions) {
  console.log(moduleOptions.token); // '123'
  // console.log(this.options.exampleMsg); // 'hello'

  this.nuxt.hook("ready", async (nuxt) => {
    console.log("Nuxt is ready");
  });

  // Add a CSS Library
  // this.options.css.push("font-awesome/css/font-awesome.css");

  // Start NGROK when Nuxt server is listening
  let url;

  this.nuxt.hook("listen", async function (server, { port }) {
    // const options = nuxt.options.ngrok || {};

    // const token = process.env.NGROK_TOKEN || options.authtoken;
    // await ngrok.authtoken(token || "");

    // url = await ngrok.connect(port);

    // nuxt.options.publicRuntimeConfig.ngrok = { url };
    // nuxt.options.cli.badgeMessages.push(
    //   `Public URL: ${chalk.underline.yellow(url)}`
    // );
  });

  // Disconnect ngrok connection when closing nuxt
  this.nuxt.hook("close", function () {
    // url && ngrok.disconnect(url);
  });

  this.nuxt.hook("modules:done", (moduleContainer) => {
    // This will be called when all modules finished loading
  });

  this.nuxt.hook("render:before", (renderer) => {
    // Called after the renderer was created
  });

  this.nuxt.hook("build:compile", async ({ name, compiler }) => {
    // Called before the compiler (default: webpack) starts
  });

  this.nuxt.hook("generate:before", async (generator) => {
    // This will be called before Nuxt generates your pages
  });

  // Register `plugin.js` template
  // this.addPlugin({
  //   src: path.resolve(__dirname, 'plugin.js'),
  //   options: {
  //     // Nuxt will replace `options.ua` with `123` when copying plugin to project
  //     ua: 123,

  //     // conditional parts with dev will be stripped from plugin code on production builds
  //     debug: this.options.dev
  //   }
  // })
}

module.exports.meta = require('../package.json')