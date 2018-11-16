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
		await page.goto('http://localhost:3000/flyer.html', {waitUntil: 'networkidle2'});
		await page.pdf({path: 'pdf/test.pdf', width: '20cm', height: '20cm', printBackground: true, preferCSSPageSize:true});
		await browser.close();
	})();

	// https://github.com/janl/mustache.js
	// https://github.com/twitter/hogan.js
	// https://github.com/wycats/handlebars.js/

})
