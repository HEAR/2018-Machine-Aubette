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
	var fileout = folderOut + "image-" + filesOutNum + ".png" 


	console.log(filein+ "\n\t -> "+fileout)

	// http://www.imagemagick.org/discourse-server/viewtopic.php?t=21677
	// convert gris.png -colorspace Gray -negate -alpha copy mask.png
	// convert gris.png -colorspace Gray -fill black  mask.png -compose Copy_Opacity -composite gris-alpha.png
	// convert -define png:size=600x600 vertical.png -thumbnail 600x600^ -gravity center -extent 600x600 square.png

	im.convert([filein, "-resize", "200x200", "-colorspace", "Gray", "-ordered-dither", "o3x3", "-transparent", "white",  fileout],
	function(err, stdout) {
		if (err) throw err
		// console.log('stdout:', stdout)
	})

	var phrases = JSON.parse( fs.readFileSync("./texte.json") )

	// var phrases = require("./texte.json")
	var la_phrase1 = phrases[ Math.floor( phrases.length * Math.random() ) ] ;
	var la_phrase2 = phrases[ Math.floor( phrases.length * Math.random() ) ] ;
	var la_phrase3 = phrases[ Math.floor( phrases.length * Math.random() ) ] ;


	var flyerURL = 'http://localhost:3000/flyer.html?texte1='+ la_phrase1 + '&texte2='+ la_phrase2 + '&texte3='+ la_phrase3 + '&image1=' + "image-" + filesOutNum + ".png" + '&image2=' + "image-" + filesOutNum + ".png";

	console.log(flyerURL)

	puppeteer.launch().then(browser => {
		browser.newPage()
		.then(page => {
			page.goto(flyerURL, {waitUntil: 'networkidle2'})
			// .then(resp => page.screenshot({path: 'example.png'}))
			.then(resp => page.pdf({path: pdfOut+'flyer-'+filesPDFOutNum+'.pdf', width:"20cm", height:"20cm", printBackground: true, preferCSSPageSize:true}))
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