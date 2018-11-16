const express 			= require('express')
const app 				= express()

const puppeteer 		= require('puppeteer')

const im 				= require('imagemagick')
const fs 				= require('fs')

const JSONGoogleDocs 	= require('json-google-docs')

// ------------------

const port 				= 3000

const folderIn 	= './python/images/'
const folderOut = './public/images/'
const pdfOut	= "./pdf/"

// ------------------



app.use(express.static('public'))


function tramerImage(){

	filesIn	 	= fs.readdirSync(folderIn)
	filesOut 	= fs.readdirSync(folderOut)
	filesPDFOut = fs.readdirSync(pdfOut)

	if(filesIn[0] == '.DS_Store')
		filesIn.splice(0,1)

	if(filesOut[0] == '.DS_Store')
		filesOut.splice(0,1)

	// if(filesPDFOut[0] == '.DS_Store')
	// 	filesPDFOut.splice(0,1)

	filesOutNum 	= filesOut.length + 1
	filesPDFOutNum 	= filesPDFOut.length + 1


	image_a_tramer =  filesIn[ Math.floor(Math.random()*filesIn.length) ] 


	var filein  = folderIn + image_a_tramer
	var fileout = folderOut + "image-" + filesOutNum + ".jpg" 


	console.log(filein+ "\n\t -> "+fileout)

	im.convert([filein, "-resize", "200x200", "-colorspace", "Gray", "-ordered-dither", "o3x3",  fileout],
	function(err, stdout) {
		if (err) throw err
		// console.log('stdout:', stdout)
	})

	var phrases = JSON.parse( fs.readFileSync("./texte.json") )

	// var phrases = require("./texte.json")
	var la_phrase = phrases[ Math.floor( phrases.length * Math.random() ) ] ;



	puppeteer.launch().then(browser => {
		browser.newPage()
		.then(page => {
			page.goto('http://localhost:3000?texte='+ la_phrase + "&image=" + "image-" + filesOutNum + ".jpg", {waitUntil: 'networkidle2'})
			// .then(resp => page.screenshot({path: 'example.png'}))
			.then(resp => page.pdf({path: pdfOut+'flyer-'+filesPDFOutNum+'.pdf', width:"21cm", height:"21cm", printBackground: true}))
			.then(buffer => browser.close());
		});
	});


	// https://github.com/janl/mustache.js
	// https://github.com/twitter/hogan.js
	// https://github.com/wycats/handlebars.js/

}



function refreshText(){
	var uri = 'https://script.google.com/macros/s/AKfycbzESVyYotZfoaKMcs54o6eDiAceva1h2CklOzjGFvRBC7SLlkA/exec'
	var doc = new JSONGoogleDocs.Document(uri)

	doc.fetch().then(function() {
		console.log(doc)


		fs.writeFile("./texte.json", JSON.stringify(doc.data.contenu), function(err) {
			if(err) {
				return console.log(err);
			}

			console.log("")
			console.log("/------------ TXT from Google Docs ------------/")
			console.log("              The file was saved!");
			console.log("/------------ TXT from Google Docs ------------/")
			console.log("")
		}); 
	})
}


// app.listen(port, () => console.log(`Example app listening on port ${port}!`))
app.listen(port, function(){

	console.log(`Example app listening on port ${port}!`);

})



var timerPdf = setInterval(tramerImage, 10000)
var timerTxt = setInterval(refreshText, 20000)