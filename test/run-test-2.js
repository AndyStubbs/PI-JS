const puppeteer = require('puppeteer');
const { TimeoutError } = require('puppeteer/Errors');
const HOME = "http://localhost:8080/";

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport( {
		width: 160,
		height: 100,
		deviceScaleFactor: 1
	});
	await page.goto( HOME + "test/tests/inmouse_01.html" );
	await page.keyboard.press( "ArrowUp", { "delay": 3500 } );
	await page.screenshot( { path: 'example.png' } );
	await browser.close();
})();

async function runTest( test ) {
	await page.setViewport( {
		width: 160,
		height: 100,
		deviceScaleFactor: 1
	});
	await page.goto( HOME + "test/tests/inmouse_01.html" );
	await page.screenshot( { path: 'example.png' } );
}
