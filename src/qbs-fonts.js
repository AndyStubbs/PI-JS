/*
* File: qbs-fonts.js
*/

// Start of File Encapsulation
( function () {

"use strict";
var qbData, qbWait, qbResume;

qbData = qbs._.data;
qbWait = qbs._.wait;
qbResume = qbs._.resume;

// Loads a font into memory
qbs._.addCommand( "loadFont", loadFont, false, false );
function loadFont( args ) {
	var fontSrc, width, height, img, font;

	fontSrc = args[ 0 ];
	width = args[ 1 ];
	height = args[ 2 ];

	// Create a new image
	img = new Image();

	// Set the source
	img.src = fontSrc;

	// Set the font data
	font = {
		"id": qbData.nextFontId,
		"width": width,
		"height": height,
		"data": []
	};

	// Add this to the font data
	qbData.fonts[ font.id ] = font;

	// Increment the next font id
	qbData.nextFontId += 1;

	// Signal qbs to wait
	qbWait();

	// Need to wait until the image is loaded
	img.onload = function () {
		var canvas, context, data, i, x, y, index, xStart, yStart, cols, r, g, b, a;

		// Create a new canvas to read the pixel data
		canvas = document.createElement( "canvas" );
		context = canvas.getContext( "2d" );
		canvas.width = img.width;
		canvas.height = img.height;

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
					if( ( r > 1 || g > 1 || b > 1 ) && a > 1 ) {
						font.data[ i ][ y - yStart ].push( 1 );
					} else {
						font.data[ i ][ y - yStart ].push( 0 );
					}
				}
			}
			xStart += width;
			if( xStart >= cols ) {
				xStart = 0;
				yStart += height;
			}
		}
		qbResume();
	};
	return font.id;
}

qbs._.addCommand( "setFont", setFont, false, true, "both", "setFont" );
function setFont( screenData, args ) {

	var fontId, font;

	fontId = args[ 0 ];

	// Check if this is a valid font
	if( qbData.fonts[ fontId ]) {
		// Set the font data for the current print cursor
		font = qbData.fonts[ fontId ];
		screenData.printCursor.font = font.data;

		// Set the font dimensions
		screenData.printCursor.charWidth = font.width;
		screenData.printCursor.charHeight = font.height;

		// Set the rows and cols
		screenData.printCursor.cols = Math.floor( screenData.width / font.width );
		screenData.printCursor.rows = Math.floor( screenData.height / font.height );
	}
}

// End of File Encapsulation
} )();
