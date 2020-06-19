"use strict";

// Libraries
const CMD = require( "node-cmd" );
const FS = require( "fs" );
const PNG = require( "pngjs" ).PNG;
const TOML = require( "@iarna/toml" );

// Global constants
const BROWSER1 = "\"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe\"";
const BROWSER2 = "chromium-browser";
const HOME = "http://localhost:8080/";
const TEMPLATE_FILE = "test/index-template.html";
const INDEX_FILE = "test/index.html";
//const LOG_FILE = "test/log_" + ( new Date() ).getTime() + ".log";
const LOG_FILE = "test/log.log";
const SCREENSHOTS_FOLDER = "test/tests/screenshots/";
const TESTS_URL = "http://localhost:8080/test/tests/";
const IMG_URL_ROOT = "tests/screenshots/";
const TESTS_FOLDER = "test/tests";
const ROOT_DIR = __dirname.substring( 0, __dirname.lastIndexOf( "\\" ) ) + "\\";
const TEST_HTML_ID = "test_";

// Global variables
let g_ImgHtml = [];
let g_Errors = [];
let g_MismatchCount = 0;
let g_NewTestsCount = 0;
let g_totalTestsCount = 0;
let g_totalTestsParsedCount = 0;
let g_StrHtml = FS.readFileSync( TEMPLATE_FILE ).toString();
let g_Files = FS.readdirSync( TESTS_FOLDER );
let g_StrLog = "";
let g_indexFile = INDEX_FILE;
let g_Browser = BROWSER2;

if( process.platform === "win32" ) {
	g_Browser = BROWSER1;
}
if( process.argv.length > 2 ) {
	g_Files = [ process.argv[ 2 ] ];
	g_indexFile = "test/test-" + g_Files[ 0 ];
}

// Run the first 10 tests without delay
// then add 100 millisecond delay between each test run
for( let i = 0; i < g_Files.length; i++ ) {

	let file = g_Files[ i ];

	//console.log( file, "1" );
	//Make the html look nice

	if( isHtmlFile( file ) ) {
		//console.log( file, "2" );
		g_ImgHtml.push( "\n\t" );
		g_totalTestsCount += 1;
		if( i < 10 ) {
			run_test( file, i );
		} else {
			trigger_test( file, i, i * 100 );
		}
	}
}

function trigger_test( file, i, delay ) {
	setTimeout( function () {
		run_test( file );
	}, delay );
}

function run_test( file, i ) {

	//console.log( file, "run_test" );

	//Get current test
	let test = getTestInfo( file );

	//Set the name of the image file
	test.img_file = SCREENSHOTS_FOLDER + test.file + ".png";

	let saveFile = "";
	if( FS.existsSync( test.img_file ) ) {
		saveFile = SCREENSHOTS_FOLDER + test.file + "_new.png";
		test.new_img_file = saveFile;
	} else {
		saveFile = SCREENSHOTS_FOLDER + test.file + ".png";
		test.new_img_file = false;
	}

	//Set the test url
	test.url = TESTS_URL + test.file + ".html";
	test.id = i;

	//Update the image html
	g_ImgHtml[ i ] += "\n\t\t<div id='" + TEST_HTML_ID + i + "'></div>";
	g_ImgHtml[ i ] += "\n\t\t<h2>" + test.name + "</h2>";
	g_ImgHtml[ i ] += "\n\t\t<div class='link'><a href='" + test.url + "' target='_blank'>" + test.url +
		"</a>&nbsp;&nbsp;-&nbsp;&nbsp;<a href='#stats'>Go back</a></div>";
	g_ImgHtml[ i ] += "\n\t\t[" + test.file + "]<br />";
	g_ImgHtml[ i ] += "\n\t\t<img src='" + IMG_URL_ROOT + test.file + ".png' />";
	g_ImgHtml[ i ] += "\n\t\t<img src='" + IMG_URL_ROOT + test.file + "_new.png' />";

	let cmdStr = g_Browser + " --headless --screenshot=" + ROOT_DIR + saveFile + " --window-size=" + test.width + "," + test.height + " " + test.url;

	//Log some output
	console.log( "" );
	console.log( "********************************************" );
	console.log( test.name );
	console.log( cmdStr );

	// Increment the count of totalTestsCounted
	//g_totalTestsCount += 1;

	//run the command
	CMD.get( cmdStr, function ( err, data, stderr ) {

		var img1, img2, filesLoaded, diffRounded;

		function parsed() {
			var diff;

			filesLoaded += 1;
			if( filesLoaded < 2 ) {
				return;
			}

			diff = compare_images( img1, img2 );
			diffRounded = Math.round( diff * 100 ) / 100;
			console.log( "***********************" );
			console.log( test.name );
			console.log( "Difference: " + diff );
			if( diff > 0 ) {
				console.log( "NOT MATCHED" );
				g_ImgHtml[ i ] = g_ImgHtml[ i ].replace( "[" + test.file + "]",
					"<span class='error'>NOT MATCHED - Difference: " + diffRounded + "</span>"
				);
				g_Errors.push( {
					"test": test,
					"type": "Not Matched"
				} );
				g_MismatchCount += 1;
			} else {
				g_ImgHtml[ i ] = g_ImgHtml[ i ].replace( "[" + test.file + "]",
					"<span class='good'>MATCHED</span>" );
			}
			updateCounts();
			//run_test( i + 1 );
		}

		if( err ) {
			g_StrLog += "Error: " + err + "\n";
		}
		if( data ) {
			console.log( data );
		}
		if( stderr ) {
			g_StrLog += "StdError: " + stderr + "\n";
		}

		//console.log(test);

		//Load Image Files
		if( test.new_img_file ) {
			filesLoaded = 0;
			img1 = FS.createReadStream( test.img_file ).pipe( new PNG() ).on( "parsed", parsed );
			img2 = FS.createReadStream( test.new_img_file ).pipe( new PNG() ).on( "parsed", parsed );
		} else {
			console.log( "IMAGE NOT VERIFIED" );
			g_ImgHtml[ i ] = g_ImgHtml[ i ].replace( "[" + test.file + "]",
				"<span class='neutral'>Not Verified</span>"
			);
			g_Errors.push( {
				"test": test,
				"type": "Not Verified"
			} );
			g_NewTestsCount += 1;
			updateCounts();
		}

	} );

}

function updateCounts() {
	g_totalTestsParsedCount += 1;
	console.log( g_totalTestsParsedCount, g_totalTestsCount );
	if( g_totalTestsParsedCount === g_totalTestsCount ) {
		setTimeout( function () {
			writeFinalHtml();
		}, 500 );
	}
}

function writeFinalHtml() {

	//Update the stats
	let statsHtml = "<div id='stats'></div>";
	if( g_MismatchCount === 0 && g_NewTestsCount === 0 ) {
		statsHtml = "\n\t\t\t<span class='good'>All images match!</span>\n\t\t";
	} else {
		statsHtml += "\n\t\t\t<span class='error'>Discrepancies Found</span>";
		if( g_MismatchCount ) {
			statsHtml += "\n\t\t\t<span class='error'>" + g_MismatchCount +
				" mismatched images.</span>";
			if( ! g_NewTestsCount ) {
				statsHtml += "\n\t\t";
			}
		}
		if( g_NewTestsCount ) {
			statsHtml += "\n\t\t\t<span class='neutral'>" + g_NewTestsCount +
				" new images not verified.</span>\n\t\t";
		}
		if( g_Errors.length > 0 ) {
			statsHtml += "\n\t\t\t<ol>";
		}
		for( let i = 0; i < g_Errors.length; i++ ) {
			statsHtml += "\n\t\t\t\t<li><a href='#" + TEST_HTML_ID + g_Errors[ i ].test.id + "'>" +
				g_Errors[ i ].test.name + " - " + g_Errors[ i ].type + "</a></li>";
		}
		if( g_Errors.length > 0 ) {
			statsHtml += "\n\t\t\t</ol>";
		}
	}
	g_StrHtml = g_StrHtml.replace( "[TEST-STATS]", statsHtml );

	//Update the index_html
	g_StrHtml = g_StrHtml.replace( "[WEB-TESTS]", g_ImgHtml.join( "" ) );

	//Write the index.html file
	FS.writeFile( LOG_FILE, g_StrLog, function () {} );

	FS.writeFile( g_indexFile, g_StrHtml, function () {
		console.log( "Tests completed" );
	} );

	//Set the command to startup chrome and point to the home page
	let cmdStr = g_Browser + " " + HOME + g_indexFile;

	//Launch Chrome with link to test file
	CMD.get( cmdStr, function ( err, data, stderr ) {
		if( err ) {
			g_StrLog += "Error: " + err + "\n";
		}
		if( data ) {
			console.log( data );
		}
		if( stderr ) {
			g_StrLog += "Error: " + stderr + "\n";
		}
	} );
}

function getTestInfo( filename ) {
	console.log( filename, "getTestInfo" );
	let text = FS.readFileSync( TESTS_FOLDER + "/" + filename ).toString();
	let tomlText = text.substring( text.indexOf( "[[TOML_START]]" ) + 14, text.indexOf( "[[TOML_END]]" ) ).replace( /\t/g, "" );
	let data = TOML.parse( tomlText );
	return data;
}

function isHtmlFile( filename ) {
	//console.log( filename, "3" );
	let parts = filename.split( "." );
	if( parts.length < 2 ) {
		return false;
	}
	//console.log( filename, "4" );
	return parts[ 1 ] === "html";
}

function compare_images( img1, img2 ) {

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
