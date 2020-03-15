/*
* File: qbs-screen-print.js
*/

// Start of File Encapsulation
( function () {

"use strict";
var qbData, qbWait, qbResume;

qbData = qbs._.data;
qbWait = qbs._.wait;
qbResume = qbs._.resume;

// Print Command
qbs._.addCommand( "print", print, false, true );
function print( screenData, args ) {
	var msg, inLine, parts, i;

	msg = args[ 0 ];
	inLine = args[ 1 ];

	if( msg === undefined ) {
		msg = "";
	} else if( typeof msg !== "string" ) {
		msg = "" + msg;
	}

	// Add tabs
	msg = msg.replace( /\t/g, "    " );

	// Split messages by \n
	parts = msg.split( /\n/ );
	for( i = 0; i < parts.length; i++ ) {
		startPrint( screenData, parts[ i ], inLine );
	}
}

function startPrint( screenData, msg, inLine ) {
	var width, overlap, onScreen, onScreenPct, msgSplit, index, msg1, msg2, printCursor;

	printCursor = screenData.printCursor;

	//Adjust if the text is too wide for the screen
	width = printCursor.calcWidth( screenData, msg );
	if( width + printCursor.x > screenData.width && ! inLine && msg.length > 1 ) {
		overlap = ( width + printCursor.x ) - screenData.width;
		onScreen = width - overlap;
		onScreenPct = onScreen / width;
		msgSplit = Math.floor( msg.length * onScreenPct );
		msg1 = msg.substring( 0, msgSplit );
		msg2 = msg.substring( msgSplit, msg.length );
		if( printCursor.breakWord ) {
			index = msg1.lastIndexOf( " " );
			if( index > -1 ) {
				msg2 = msg1.substring( index ).trim() + msg2;
				msg1 = msg1.substring( 0, index );
			}
		}
		startPrint( screenData, msg1, inLine );
		startPrint( screenData, msg2, inLine );
		return;
	}

	//Adjust if the text is too tall for the screen
	if( printCursor.y + printCursor.charHeight > screenData.height ) {

		//Draw the canvas
		screenData.screenObj.render();

		//Draw the image on the buffer
		screenData.bufferContext.clearRect( 0, 0, screenData.width, screenData.height );
		screenData.bufferContext.drawImage( screenData.canvas, 0, 0 );

		//Clear the current context and draw the buffer image
		screenData.context.clearRect( 0, 0, screenData.width, screenData.height );
		screenData.context.drawImage( screenData.bufferCanvas, 0, -printCursor.charHeight );

		// Get the image data
		screenData.dirty = false;
		qbData.commands.getImageData( screenData );

		//Backup the print_cursor
		printCursor.y -= printCursor.charHeight;
	}

	printCursor.printFunction( screenData, msg, printCursor.x, printCursor.y );

	//If it's not in_line print the advance to next line
	if( ! inLine ) {
		printCursor.y += printCursor.charHeight;
		printCursor.x = 0;
	} else {
		printCursor.x += printCursor.charWidth * msg.length;
		if( printCursor.x > qbData.screenData.width - printCursor.charWidth ) {
			printCursor.x = 0;
			printCursor.y += printCursor.charHeight;
		}
	}
}

function qbsCalcWidth( screenData, msg ) {
	return screenData.printCursor.charWidth * msg.length;
}

function contextCalcWidth( screenData, msg ) {
	return screenData.context.measureText( msg ).width;
}

// Set Word Break Command
qbs._.addCommand( "setWordBreak", setWordBreak, false, true );
function setWordBreak( screenData, args ) {
	var enabled;

	enabled = args[ 0 ];

	if( enabled ) {
		screenData.printCursor.breakWord = true;
	} else {
		screenData.printCursor.breakWord = false;
	}
}

// Print to the screen by using qbs_fonts
function qbsPrint( screenData, msg, x, y ) {
	var i, printCursor, defaultPal;

	// Get reference to printCursor data
	printCursor = screenData.printCursor;

	// Setup a temporary pallette with the fore color and back color
	defaultPal = screenData.pal;
	screenData.pal = [ defaultPal[ 0 ], defaultPal[ screenData.fColor ] ];

	//Loop through each character in the message and put it on the screen
	for( i = 0; i < msg.length; i++ ) {
		screenData.screenObj.put( printCursor.font[ msg.charCodeAt( i ) ], x + printCursor.charWidth * i, y );
	}

	// Reset the palette to the default
	screenData.pal = defaultPal;
}

function contextPrint( screenData, msg, x, y ) {
	screenData.context.fillText( msg, x, y );
}

// Locate Command
qbs._.addCommand( "locate", locate, false, true );
function locate( screenData, args ) {
	var col, row, x, y;

	col = args[ 0 ];
	row = args[ 1 ];

	// Set the x value
	if( col !== null ) {
		x = Math.floor( col * screenData.printCursor.charWidth );
		if(x > screenData.width) {
			x = screenData.width - screenData.printCursor.charWidth;
		}
		screenData.printCursor.x = x;
	}

	// Set the y value
	if( row !== null ) {
		y = Math.floor( row * screenData.printCursor.charHeight );
		if( y > screenData.height ) {
			y = screenData.height - screenData.printCursor.charHeight;
		}
		screenData.printCursor.y = y;
	}
}

// Locate Px Command
qbs._.addCommand( "locatePx", locatePx, false, true );
function locatePx( screenData, args, x, y ) {
	var x, y;

	x = args[ 0 ];
	y = args[ 1 ];

	if( ! isNaN( x ) ) {
		screenData.printCursor.x = parseInt( x );
	}
	if( ! isNaN( y ) ) {
		screenData.printCursor.y = parseInt( y );
	}
}

// Pos Command
qbs._.addCommand( "pos", pos, false, true );
function pos( screenData ) {
	return {
		col: Math.floor( screenData.printCursor.x / screenData.printCursor.charWidth ),
		row: Math.floor( screenData.printCursor.y / screenData.printCursor.charHeight )
	};
}

// Pos Px Command
qbs._.addCommand( "posPx", posPx, false, true );
function posPx( screenData ) {
	return {
		x: screenData.printCursor.x,
		y: screenData.printCursor.y
	};
}

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

// Set Font Command
qbs._.addCommand( "setFont", setFont, false, true );
function setFont( screenData, args ) {
	var fontId, font, size;

	fontId = args[ 0 ];

	// Check if this is a valid font
	if( qbData.fonts[ fontId ] ) {

		// Set the font data for the current print cursor
		font = qbData.fonts[ fontId ];
		screenData.printCursor.font = font.data;

		// Set the font dimensions
		screenData.printCursor.charWidth = font.width;
		screenData.printCursor.charHeight = font.height;

		// Set the rows and cols
		screenData.printCursor.cols = Math.floor( screenData.width / font.width );
		screenData.printCursor.rows = Math.floor( screenData.height / font.height );

		// Set the print functions
		screenData.printCursor.printFunction = qbsPrint;
		screenData.printCursor.calcWidth = qbsCalcWidth;

	} else if( typeof fontId === "string" ) {

		// Set the context font
		screenData.context.font = fontId;
		screenData.context.textBaseline = "top";

		// Set the font data
		screenData.printCursor.font = screenData.context.font;

		// Set the font dimensions
		size = calcFontSize( screenData.context );
		screenData.printCursor.charWidth = size.width;
		screenData.printCursor.charHeight = size.height;

		// Set the rows and cols
		screenData.printCursor.cols = Math.floor( screenData.width / size.width );
		screenData.printCursor.rows = Math.floor( screenData.height / size.height );

		// Set the print functions
		screenData.printCursor.printFunction = contextPrint;
		screenData.printCursor.calcWidth = contextCalcWidth;
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
	data = "HMIyjg_";
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

// Set the default print functions
qbData.defaultFont.printFunction = qbsPrint;
qbData.defaultFont.calcWidth = qbsCalcWidth;

// End of File Encapsulation
} )(); 
