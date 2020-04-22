/*
* File: qbs-screen-helper.js
*/

// Start of File Encapsulation
( function () {
"use strict";

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "getImageData", getImageData, true, false );
function getImageData( screenData ) {
	if( screenData.dirty === false ) {
		screenData.imageData = screenData.context.getImageData( 0, 0, screenData.width, screenData.height );
	}
}

qbs._.addCommand( "setPixel", setPixel, true, false );
function setPixel( screenData, x, y, c ) {
	var data, i;

	// Get the image data
	data = screenData.imageData.data

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

}

qbs._.addCommand( "setPixelSafe", setPixelSafe, true, false );
qbs._.addPen( "pixel", setPixelSafe );
function setPixelSafe( screenData, x, y, c ) {
	var data, i;

	if( x < 0 || x >= screenData.width || y < 0 || y >= screenData.height ) {
		return;
	}

	qbData.commands.getImageData( screenData );

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

	screenData.dirty = true;
}

qbs._.addCommand( "drawSquarePen", drawSquarePen, true, false );
qbs._.addPen( "square", drawSquarePen );
function drawSquarePen( screenData, x, y, c ) {
	var size, x2, y2, offset;

	size = screenData.pen.size * 2 - 1;
	offset = Math.round( size / 2 ) - 1;
	for( y2 = 0; y2 < size; y2++ ) {
		for( x2 = 0; x2 < size; x2++ ) {
			qbData.commands.setPixelSafe( screenData, x2 + x - offset, y2 + y - offset, c );
		}
	}

	screenData.dirty = true;
}

qbs._.addCommand( "drawCirclePen", drawCirclePen, true, false );
qbs._.addPen( "circle", drawCirclePen );
function drawCirclePen( screenData, x, y, c ) {
	var size, half, x2, y2, x3, y3, offset, r;

	if( screenData.pen.size === 2 ) {
		qbData.commands.setPixelSafe( screenData, x, y, c );
		qbData.commands.setPixelSafe( screenData, x + 1, y, c );
		qbData.commands.setPixelSafe( screenData, x - 1, y, c );
		qbData.commands.setPixelSafe( screenData, x, y + 1, c );
		qbData.commands.setPixelSafe( screenData, x, y - 1, c );
		screenData.dirty = true;
		return;
	}

	size = screenData.pen.size * 2;
	half = size / 2;
	offset = Math.round( size / 2 ) - 1;
	for( y2 = 0; y2 < size; y2++ ) {
		for( x2 = 0; x2 < size; x2++ ) {
			x3 = x2 - offset;
			y3 = y2 - offset;
			r = Math.round( Math.sqrt( x3 * x3 + y3 * y3 ) );
			if( r < half ) {
				qbData.commands.setPixelSafe( screenData, x3 + x, y3 + y, c );
			}
		}
	}

	screenData.dirty = true;
}

qbs._.addCommand( "getPixel", getPixel, true, false );
function getPixel( screenData, x, y ) {
	var data, i;

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index of the color
	i = ( ( screenData.width * y ) + x ) * 4;

	return {
		r: data[i],
		g: data[i + 1],
		b: data[i + 2],
		a: data[i + 3]
	};
}

qbs._.addCommand( "getPixelSafe", getPixelSafe, true, false );
function getPixelSafe( screenData, x, y ) {

	qbData.commands.getImageData( screenData );

	return getPixel( screenData, x, y );
}

// Set the default pen draw function
qbData.defaultPenDraw = setPixelSafe;

// End of File Encapsulation
} )();
