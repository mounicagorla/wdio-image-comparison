const { remote } = require("webdriverio");
const path = require('path');
const pages = require(path.join(process.cwd(), './pagedata'));
const WdioImageComparisonService = require('wdio-image-comparison-service').default;

let wdioImageComparisonService = new WdioImageComparisonService({});

main().catch(async e => {
  console.error(e)
});

async function main() {
  const browser = await remote({
    logLevel: "silent",
    capabilities: {
      browserName: 'MicrosoftEdge',
    }
  });

  global.browser = browser;
  wdioImageComparisonService.defaultOptions.autoSaveBaseline = true;
  wdioImageComparisonService.defaultOptions.formatImageName = '{tag}';
  browser.defaultOptions = wdioImageComparisonService.defaultOptions;
  browser.folders = wdioImageComparisonService.folders;
  wdioImageComparisonService.before(browser.capabilities)

  for (var page in pages.url) {

    await browser.url(pages.url[page]);
    const saveResult = {
      // The device pixel ratio of the instance that has run
      devicePixelRatio: 1,
      actualFolder: path.join(process.cwd(), './.tmp/actual/edge'),
      baselineFolder: path.join(process.cwd(), './wic/baseline'),
      diffFolder: path.join(process.cwd(), './.tmp/testDiff'),
      returnAllCompareData: true
    };
    // or use this for ONLY saving a screenshot
    let savefile = await browser.saveFullPageScreen(`${page}`, saveResult);
    console.log(savefile)
    console.log("Screenshot taken and stored in edge")
    await browser.pause(3000)
  }
  await browser.deleteSession();
  console.log("session completed in edge")
  await othrBrowser();
}
async function othrBrowser() {
  const browser = await remote({
    logLevel: "silent",
    capabilities: {
      browserName: "chrome"
    }
  });

  global.browser = browser;
  wdioImageComparisonService.defaultOptions.autoSaveBaseline = true;
  browser.defaultOptions = wdioImageComparisonService.defaultOptions;
  browser.folders = wdioImageComparisonService.folders;
  wdioImageComparisonService.before(browser.capabilities)
  
  for (var page in pages.url) {
    await browser.url(pages.url[page]);
    await browser.pause(3000)
    const checkResult = {
      actualFolder: path.join(process.cwd(), './.tmp/actual/chrome'),
      baselineFolder: path.join(process.cwd(), './wic/baseline'),
      diffFolder: path.join(process.cwd(), './.tmp/testDiff'),
      returnAllCompareData: true
    };

    // or use this for validating. 
    let checkFile = await browser.checkFullPageScreen(`${page}`, checkResult);
    console.log(checkFile)
  }
  await browser.deleteSession();
  console.log("session completed in chrome")

}

