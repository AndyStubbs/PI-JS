/*
* File: qbs-font.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData, qbWait, qbResume;

qbData = qbs._.data;
qbWait = qbs._.wait;
qbResume = qbs._.resume;

// Loads a font into memory
qbs._.addCommand( "loadFont", loadFont, false, false,
	[ "fontSrc", "width", "height", "isBase32Encoded" ] );
function loadFont( args ) {
	var fontSrc, width, height, isBase32Encoded, font;

	fontSrc = args[ 0 ];
	width = args[ 1 ];
	height = args[ 2 ];
	isBase32Encoded = !!( args[ 3 ] );

	// Set the font data
	font = {
		"id": qbData.nextFontId,
		"width": width,
		"height": height,
		"data": [],
		"colorCount": 2
	};

	// Add this to the font data
	qbData.fonts[ font.id ] = font;

	// Increment the next font id
	qbData.nextFontId += 1;

	if( isBase32Encoded ) {
		loadFontFromBase32Encoded( fontSrc, width, height, font );
	} else {
		loadFontFromImg( fontSrc, width, height, font );
	}

	return font.id;
}

function loadFontFromBase32Encoded( fontSrc, width, height, font ) {
	font.data = decompressFont( fontSrc, width, height );
}

function decompressFont( numStr, width, height ) {
	var i, j, bin, nums, num, size, base, x, y, data, index;

	size = 32;
	base = 32;
	bin = "";
	data = [];
	//numStr = lzw_decode( numStr );
	numStr = "" + numStr;
	nums = numStr.split( "," );

	// Loop through all the nums
	for( i = 0; i < nums.length; i++ ) {

		// Convert the string to base number then to binary string
		num = parseInt( nums[ i ], base ).toString( 2 );

		// Pad the front with 0's so that num has length of size
		for( j = num.length; j < size; j++ ) {
			num = "0" + num;
		}

		// Add to the bin
		bin += num;
	}

	// Loop through all the bits
	i = 0;
	if( bin.length % size > 0 ) {
		console.error( "Invalid font data." );
		return;
	}
	while( i < bin.length ) {

		// Push a new character onto data
		data.push( [] );

		// Store the index of the font character
		index = data.length - 1;

		// Loop through all the characters
		for( y = 0; y < height; y += 1 ) {

			// Push a new row onto the character data
			data[ index ].push( [] );

			// Loop through a row
			for( x = 0; x < width; x += 1 ) {

				if( i >= bin.length ) {
					num = 0;
					//console.error( "Invalid font data" );
					//return;
				} else {
					num = parseInt( bin[ i ] );
					if( isNaN( num ) ) {
						num = 0;
						//console.error( "Invalid font data" );
						//return;
					}
				}

				// Push the bit onto the character
				data[ index ][ y ].push( num );

				// Increment the bit
				i += 1;
			}
		}
	}

	return data;
}

function loadFontFromImg( fontSrc, width, height, font ) {

	var img;

	if( typeof fontSrc === "string" ) {
		// Create a new image
		img = new Image();

		// Set the source
		img.src = fontSrc;
	} else {
		img = fontSrc;
	}

	if( ! img.complete ) {
		// Signal qbs to wait
		qbWait();

		// Need to wait until the image is loaded
		img.onload = function () {
			readImageData( img, width, height, font );
			qbResume();
		};
		img.onerror = function ( err ) {
			console.error( "loadFont: unable to load image for font." );
			qbResume();
		};
	} else {
		readImageData( img, width, height, font );
	}
}

function readImageData( img, width, height, font ) {
	var canvas, context, data, i, x, y, index, xStart, yStart, cols,
		r, g, b, a, colors, colorIndex;

	// Create a new canvas to read the pixel data
	canvas = document.createElement( "canvas" );
	context = canvas.getContext( "2d" );
	canvas.width = img.width;
	canvas.height = img.height;

	// Colors lookup
	colors = [];

	// Draw the image onto the canva
	context.drawImage( img, 0, 0 );

	// Get the image data
	data = context.getImageData( 0, 0, img.width, img.height );
	xStart = 0;
	yStart = 0;
	cols = img.width;

	// Loop through all ascii characters
	for( i = 0; i < 255; i++ ) {
		font.data.push( [] );
		for( y = yStart; y < yStart + height; y++ ) {
			font.data[ i ].push( [] );
			for( x = xStart; x < xStart + width; x++ ) {
				index = y * ( cols * 4 ) + x * 4;
				r = data.data[ index ];
				g = data.data[ index + 1 ];
				b = data.data[ index + 2 ];
				a = data.data[ index + 3 ];
				colorIndex = findColorIndex( colors, r, g, b, a );
				font.data[ i ][ y - yStart ].push( colorIndex );
			}
		}
		xStart += width;
		if( xStart >= cols ) {
			xStart = 0;
			yStart += height;
		}
	}
	font.colorCount = colors.length;
}

function findColorIndex( colors, r, g, b, a ) {
	var i, dr, dg, db, d;

	if( a === 0 ) {
		r = 0;
		g = 0;
		b = 0;
	}
	for( i = 0; i < colors.length; i++ ) {
		dr = colors[ i ].r - r;
		dg = colors[ i ].g - g;
		db = colors[ i ].b - b;
		d = dr * dr + dg * dg + db * db;
		if( d < 2 ) {
			return i;
		}
	}
	colors.push( {
		"r": r, "g": g, "b": b
	} );
	return colors.length - 1;
}

qbs._.addCommand( "setDefaultFont", setDefaultFont, false, false,
[ "fontId" ] );
function setDefaultFont( args ) {
	var fontId, font;

	fontId = parseInt( args[ 0 ] );
	if( isNaN( fontId ) || fontId < 0 || fontId < qbData.fonts.length ) {
		console.error( "setDefaultFont: invalid fontId" );
		return;
	}
	font = qbData.fonts[ fontId ];
	qbData.defaultFont.width = font.width;
	qbData.defaultFont.height = font.height;
	qbData.defaultFont.data = font.data;
}

// End of File Encapsulation
} )();
