var cmd,
	img_html,
	str_html,
	browser,
	home,
	png,
	mis_match_count,
	new_tests_count;

//Link to my local web browser
browser = "\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\"";
//browser = "firefox";

//Link to testing home page on local system
home = "http://localhost:8080/test/index.html";

//Import node cmd
cmd = require( "node-cmd" );

//Import the file system handler
fs = require( "fs" );

//Import PNG tool
png = require( "pngjs" ).PNG;

let templateFile = "test/index-template.html";
let indexFile = "test/index.html";
let screenshotsFolder = "test/tests/screenshots/";
let testsUrl = "http://localhost:8080/test/tests/";
let imgUrlRoot = "tests/screenshots/";
let testsFolder = "test/tests";
let root_dir = __dirname.substring(0, __dirname.lastIndexOf("\\")) + "\\";

const toml = require("@iarna/toml");

//Setup the img html
img_html = "";

//Setup counters
mis_match_count = 0;
new_tests_count = 0;

str_html = fs.readFileSync(templateFile).toString();

let files = fs.readdirSync(testsFolder);

next_test(0);

function getTestInfo(filename) {
	let text = fs.readFileSync(testsFolder + "/" + filename).toString();
	let tomlText = text.substring(text.indexOf("[[TOML_START]]") + 14, text.indexOf("[[TOML_END]]")).replace(/\t/g, "");
	let data = toml.parse(tomlText);
	return data;
}

function isHtmlFile(filename) {
	let parts = filename.split(".");
	if(parts.length < 2) {
		return false;
	}
	return parts[1] === "html";
}

function next_test( i ) {
	"use strict";

	var test, cmd_str, save_file, stats_html;
	
	//Check if tests are completed
	if( i >= files.length ) {

		//Make the html look nice
		img_html += "\n\t";

		//Update the stats
		stats_html = "";
		if( mis_match_count === 0 && new_tests_count === 0 ) {
			stats_html = "\n\t\t\t<span class='good'>All images match!</span>\n\t\t";
		} else {
			stats_html += "\n\t\t\t<span class='error'>Discrepancies Found</span>";
			if( mis_match_count ) {
				stats_html += "\n\t\t\t<span class='error'>" + mis_match_count +
					" mismatched images.</span>";
				if( ! new_tests_count ) {
					stats_html += "\n\t\t";
				}
			}
			if( new_tests_count ) {
				stats_html += "\n\t\t\t<span class='neutral'>" + new_tests_count +
					" new images not verified.</span>\n\t\t";
			}
		}
		str_html = str_html.replace( "[TEST-STATS]", stats_html );

		//Update the index_html
		str_html = str_html.replace( "[WEB-TESTS]", img_html );

		//Write the index.html file
		fs.writeFile( indexFile, str_html, function () {
			console.log( "Tests completed" );
		} );

		//Set the command to startup chrome and point to the home page
		//cmd_str = "start /b \"" + browser + "\" \"" + home;
		cmd_str = browser + " " + home;

		//Launch Chrome with link to test file
		cmd.get( cmd_str, function ( err, data, stderr ) {
			if( err ) {
				console.log( err );
			}
			if( data ) {
				console.log( data );
			}
			if( stderr ) {
				console.log( stderr );
			}
		} );

		return;
	}

	let file = files[i];

	if(!isHtmlFile(file)) {
		next_test(i + 1);
		return;
	}

	//Get current test
	test = getTestInfo(file);

	//Set the name of the image file
	test.img_file = screenshotsFolder + test.file + ".png";

	if( fs.existsSync( test.img_file ) ) {
		save_file = screenshotsFolder + test.file + "_new.png";
		test.new_img_file = save_file;
	} else {
		save_file = screenshotsFolder + test.file + ".png";
		test.new_img_file = false;
	}

	//Set the test url
	test.url = testsUrl + test.file + ".html";

	//Update the image html
	img_html += "\n\t\t<h2>" + test.name + "</h2>";
	img_html += "\n\t\t<div class='link'><a href='" + test.url + "'>" + test.url + "</a></div>";
	img_html += "\n\t\t[" + test.file + "]<br />";
	img_html += "\n\t\t<img src='" + imgUrlRoot + test.file + ".png' />";
	img_html += "\n\t\t<img src='" + imgUrlRoot + test.file + "_new.png' />";

	//Set the command to run pegjs to create the basic parser
	//cmd_str = casperCmd + test.test + " " + test.url + " " +
	//	save_file + " " + test.width + " " + test.height + " " +
	//	test.delay;
	cmd_str = browser + " --headless --screenshot=" + root_dir + save_file + " --window-size=" + test.width + "," + test.height + " " + test.url;

	//Log some output
	console.log( "" );
	console.log( "********************************************" );
	console.log( test.name );
	console.log( cmd_str );

	//run the command
	cmd.get( cmd_str, function ( err, data, stderr ) {

		var img1, img2, files_loaded, diff_rounded;

		function parsed() {
			var diff;

			files_loaded += 1;
			if( files_loaded < 2 ) {
				return;
			}

			diff = compare_images( img1, img2 );
			diff_rounded = Math.round( diff * 100 ) / 100;
			console.log( "Difference: " + diff );
			if( diff > 0 ) {
				console.log( "NOT MATCHED" );
				img_html = img_html.replace( "[" + test.file + "]",
					"<span class='error'>NOT MATCHED - Difference: " + diff_rounded + "</span>" );
				mis_match_count += 1;
			} else {
				img_html = img_html.replace( "[" + test.file + "]",
					"<span class='good'>MATCHED</span>" );
			}
			next_test( i + 1 );
		}

		if( err ) {
			console.log( "error", err );
			//return;
		}
		if( data ) {
			console.log( data );
		}
		if( stderr ) {
			console.log( "stderr", stderr );
			//return;
		}

		//console.log(test);

		//Load Image Files
		if( test.new_img_file ) {
			files_loaded = 0;
			img1 = fs.createReadStream( test.img_file ).pipe( new png() ).on( "parsed", parsed );
			img2 = fs.createReadStream( test.new_img_file ).pipe( new png() ).on( "parsed", parsed );
		} else {
			console.log( "IMAGE NOT VERIFIED" );
			img_html = img_html.replace( "[" + test.file + "]", "<span class='neutral'>Not Verified</span>" );
			new_tests_count += 1;
			next_test( i + 1 );
		}

	} );

}

function compare_images( img1, img2 ) {
	"use strict";

	var x, y, i, diff, p_diff, width, height;

	diff = 0;
	width = img1.width;
	height = img1.height;

	for ( y = 0; y < height; y++ ) {
		for ( x = 0; x < width; x++ ) {
			i = ( width * y + x ) << 2;
			p_diff = 0;
			p_diff += Math.abs( img1.data[ i ] - img2.data[ i ] );
			p_diff += Math.abs( img1.data[ i + 1 ] - img2.data[ i + 1 ] );
			p_diff += Math.abs( img1.data[ i + 2 ] - img2.data[ i + 2 ] );
			diff += ( p_diff / 765 );
		}
	}

	return diff;
}
