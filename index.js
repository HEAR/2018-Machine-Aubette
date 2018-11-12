const express 	= require('express')
const app 		= express()
const port 		= 3000

const puppeteer = require('puppeteer')


app.use(express.static('public'))


// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, function(){

	console.log(`Example app listening on port ${port}!`);

	// https://github.com/GoogleChrome/puppeteer
	(async () => {
		const browser = await puppeteer.launch();
		const page = await browser.newPage();
		await page.goto('http://localhost:3000', {waitUntil: 'networkidle2'});
		await page.pdf({path: 'pdf/test.pdf', format: 'A4', printBackground: true});
		await browser.close();
	})();

})
