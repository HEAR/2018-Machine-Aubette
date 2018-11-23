const express 			= require('express')
const app 				= express()

const puppeteer 		= require('puppeteer')

const im 				= require('imagemagick')
const fs 				= require('fs')

const JSONGoogleDocs 	= require('json-google-docs')


const mkdirp 			= require('mkdirp');

// ------------------

const port 				= 3000

const folderIn 	= './python/images/'
const folderOut = './public/images/'
const folderMask= './mask/'
const pdfOut	= './pdf/'

// ------------------


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
	var maskout = folderMask + "mask.png" 


	console.log(filein+ "\n\t -> "+fileout)

	// http://www.imagemagick.org/discourse-server/viewtopic.php?t=21677
	// convert gris.png -colorspace Gray -negate -alpha copy mask.png
	// convert gris.png -colorspace Gray -fill black  mask.png -compose Copy_Opacity -composite gris-alpha.png
	// convert -define png:size=600x600 vertical.png -thumbnail 600x600^ -gravity center -extent 600x600 square.png

	// im.convert([filein, "-resize", "200x200", "-colorspace", "Gray", "-ordered-dither", "o3x3", "-transparent", "white",  fileout],
	// 	function(err, stdout) {
	// 		if (err) throw err
	// 		// console.log('stdout:', stdout)
	// 	}
	// )

	im.convert([filein, "-colorspace", "Gray", "-negate", "-alpha", "copy",  maskout],
		function(err, stdout) {
			if (err) throw err
			// console.log('stdout:', stdout)
			im.convert([filein, "-colorspace", "Gray", "-fill", "black", maskout, "-compose", "Copy-opacity", "-composite", fileout],
				function(err, stdout) {
					if (err) throw err
					// console.log('stdout:', stdout)
					im.convert(["-define", "png:size=600x600", fileout, "-thumbnail", "600x600^", "-gravity", "center", "-extent", "600x600", fileout],
						function(err, stdout) {
							if (err) throw err
							// console.log('stdout:', stdout)
						}
					)
				}
			)
		}
	)	
}





var timerPdf = setInterval(tramerImage, 10000)
// var timerTxt = setInterval(refreshText, 20000)