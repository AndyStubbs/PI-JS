/*
* File: qbs-font.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_qbData, m_qbWait, m_qbResume;

m_qbData = qbs._.data;
m_qbWait = qbs._.wait;
m_qbResume = qbs._.resume;

// Loads a font into memory
qbs._.addCommand( "loadFont", loadFont, false, false,
	[ "fontSrc", "width", "height", "charSet", "isEncoded" ] );
function loadFont( args ) {
	var fontSrc, width, height, charSet, isEncoded, font, chars, i;

	fontSrc = args[ 0 ];
	width = args[ 1 ];
	height = args[ 2 ];
	charSet = args[ 3 ];
	isEncoded = !!( args[ 4 ] );

	// Default charset to 0 to 255
	if( ! charSet ) {
		charSet = [];
		for( i = 0; i < 256; i += 1 ) {
			charSet.push( i );
		}
	}

	if( ! qbs.util.isArray( charSet ) ) {
		console.error( "loadFont: charSet must be an array." );
		return;
	}

	// Load the chars
	chars = {};
	for( i = 0; i < charSet.length; i += 1 ) {
		chars[ charSet[ i ] ] = i;
	}

	// Set the font data
	font = {
		"id": m_qbData.nextFontId,
		"width": width,
		"height": height,
		"data": [],
		"chars": chars,
		"colorCount": 2,
		"mode": "pixel",
		"printFunction": m_qbData.commands.qbsPrint,
		"calcWidth": m_qbData.commands.qbsCalcWidth
	};

	// Add this to the font data
	m_qbData.fonts[ font.id ] = font;

	// Increment the next font id
	m_qbData.nextFontId += 1;

	if( isEncoded ) {
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
		m_qbWait();

		// Need to wait until the image is loaded
		img.onload = function () {
			readImageData( img, width, height, font );
			m_qbResume();
		};
		img.onerror = function ( err ) {
			console.error( "loadFont: unable to load image for font." );
			m_qbResume();
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
	[ "fontId" ]
);
qbs._.addSetting( "defaultFont", setDefaultFont, false, [ "fontId" ] );
function setDefaultFont( args ) {
	var fontId;

	fontId = parseInt( args[ 0 ] );
	if( isNaN( fontId ) || fontId < 0 || fontId < m_qbData.fonts.length ) {
		console.error( "setDefaultFont: invalid fontId" );
		return;
	}
	m_qbData.defaultFont = m_qbData.fonts[ fontId ];

}


// Set Font Command
qbs._.addCommand( "setFont", setFont, false, true, [ "fontId" ] );
qbs._.addSetting( "font", setFont, true, [ "fontId" ] );
function setFont( screenData, args ) {
	var fontId, font, size;

	fontId = args[ 0 ];

	// Check if this is a valid font
	if( m_qbData.fonts[ fontId ] ) {

		// Set the font data for the current print cursor
		font = m_qbData.fonts[ fontId ];
		screenData.printCursor.font = font;

		// Set the rows and cols
		screenData.printCursor.cols = Math.floor(
			screenData.width / font.width
		);
		screenData.printCursor.rows = Math.floor(
			screenData.height / font.height
		);

	} else if( typeof fontId === "string" ) {

		// Set the context font
		screenData.context.font = fontId;
		screenData.context.textBaseline = "top";

		// Set the font dimensions
		size = calcFontSize( screenData.context );

		// Set the font data
		screenData.printCursor.font = {
			"name": screenData.context.font,
			"width": size.width,
			"height": size.height,
			"mode": "canvas",
			"printFunction": m_qbData.commands.canvasPrint,
			"calcWidth": m_qbData.commands.canvasCalcWidth
		};

		// Set the rows and cols
		screenData.printCursor.cols = Math.floor(
			screenData.width / size.width
		);
		screenData.printCursor.rows = Math.floor(
			screenData.height / size.height
		);
	}
}

function calcFontSize( context ) {
	var font, start, end, px, tCanvas, tContext, data, i, i2, size, x, y;

	font = context.font;

	// Get the font size from the name of the font
	end = font.indexOf( "px" );
	font = font.substring( 0, end );
	start = font.lastIndexOf( " " );
	if( start === -1 ) {
		start = 0;
	}
	px = parseInt( font.substring( start, end ) );

	// Add some padding to px just in case
	px = Math.round( px * 1.5 );

	// Create a temporary canvas the size of the font px
	tCanvas = document.createElement( "canvas" );
	tCanvas.width = px;
	tCanvas.height = px;

	// Create a temporary canvas
	tContext = tCanvas.getContext( "2d" );
	tContext.font = context.font;
	tContext.textBaseline = "top";
	tContext.fillStyle = "#FF0000";

	// Set a blank size object
	size = {
		"width": 0, "height": 0
	};

	// Fill text with some characters at the same spot to read data
	data = "HMIyjg_|";
	for( i = 0; i < data.length; i++ ) {
		tContext.fillText( data[ i ], 0, 0 );
	}

	// Loop through all the pixels to get the dimensions
	data = tContext.getImageData( 0, 0, px, px );
	for( i = 0; i < data.data.length; i += 4 ) {
		if( data.data[ i ] === 255 ) {
			i2 = i / 4;
			y = Math.floor( i2 / px );
			x = i2 - y * px;
			if( y > size.height ) {
				size.height = y;
			}
			if( x > size.width ) {
				size.width = x;
			}
		}
	}

	return size;
}

// End of File Encapsulation
} )();
