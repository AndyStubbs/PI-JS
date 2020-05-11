/*
* File: qbs-screen-paint.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData, maxDifference, setPixel, pixels;

qbData = qbs._.data;
maxDifference = 195075;		// 255^2 * 3

// Paint Command
qbs._.addCommand( "paint", paint, false, true, [ "x", "y", "fillColor", "tolerance" ] );
function paint( screenData, args ) {
	var x, y, fillColor, tolerance, fills, pixel, backgroundColor;

	x = args[ 0 ];
	y = args[ 1 ];
	fillColor = args[ 2 ];
	tolerance = args[ 3 ];

	if( ! qbs.util.isInteger( x ) || ! qbs.util.isInteger( y ) ) {
		console.error( "paint: Argument's x and y must be integers." );
		return;
	}

	// Set the default tolerance to 1
	if( tolerance !== 0 && ! tolerance ) {
		tolerance = 1;
	}

	if( isNaN( tolerance ) ) {
		console.error( "paint: Argument tolerance must be a number." );
		return;
	}

	// Soften the tolerance so closer to one it changes less closer to 0 changes more
	tolerance = tolerance * ( 2 - tolerance ) * maxDifference;

	if( navigator.brave && tolerance === maxDifference ) {
		tolerance -= 1;
	}

	fills = [ {
		"x": x,
		"y": y
	} ];

	// Change the setPixel command if adding noise
	if( screenData.pen.noise ) {
		setPixel = setPixelNoise;
	} else {
		setPixel = qbData.commands.setPixel;
	}

	if( qbs.util.isInteger( fillColor ) ) {
		if( fillColor > screenData.pal.length ) {
			console.error( "paint: Argument fillColor is not a color in the palette." );
			return;
		}
		fillColor = screenData.pal[ fillColor ];
	} else {
		fillColor = qbs.util.convertToColor( fillColor );
		if( fillColor === null ) {
			console.error( "paint: Argument fillColor is not a valid color format." );
			return;
		}
	}

	pixels = {};
	qbData.commands.getImageData( screenData );

	// Get the background color
	backgroundColor = qbData.commands.getPixel( screenData, x, y );

	// Loop until no fills left
	while( fills.length > 0 ) {

		pixel = fills.pop();

		// Set the current pixel
		setPixel( screenData, pixel.x, pixel.y, fillColor );

		// Add fills to neighbors
		addFill( screenData, pixel.x + 1, pixel.y, fills, fillColor, backgroundColor, tolerance );
		addFill( screenData, pixel.x - 1, pixel.y, fills, fillColor, backgroundColor, tolerance );
		addFill( screenData, pixel.x, pixel.y + 1, fills, fillColor, backgroundColor, tolerance );
		addFill( screenData, pixel.x, pixel.y - 1, fills, fillColor, backgroundColor, tolerance );
	}

	// Setup pixels for garbage collection
	pixels = null;
	qbData.commands.setImageDirty( screenData );
}

function setPixelNoise( screenData, x, y, fillColor ) {
	fillColor = qbData.commands.getPixelColor( screenData, fillColor );
	qbData.commands.setPixel( screenData, x, y, fillColor );
}

function checkPixel( x, y ) {
	var key;
	key = x + " " + y;
	if( pixels[ key ] ) {
		return true;
	}
	pixels[ key ] = true;
	return false;
}

function addFill( screenData, x, y, fills, fillColor, backgroundColor, tolerance ) {
	var fill;
	if( floodCheck( screenData, x, y, fillColor, backgroundColor, tolerance ) ) {
		setPixel( screenData, x, y, fillColor );
		fill = { x: x, y: y };
		fills.push( fill );
	}
}

function floodCheck( screenData, x, y, fillColor, backgroundColor, tolerance ) {
	var pixelColor, dr, dg, db, simularity, difference;

	if( x < 0 || x >= screenData.width || y < 0 || y >= screenData.height ) {
		return false;
	}
	pixelColor = qbData.commands.getPixel( screenData, x, y );

	// Make sure we haven't already filled this pixel
	if( ! checkPixel( x, y ) ) {

		// Calculate the difference between the two colors
		dr = ( pixelColor.r - backgroundColor.r );
		dg = ( pixelColor.g - backgroundColor.g );
		db = ( pixelColor.b - backgroundColor.b );
		difference = ( dr * dr + dg * dg + db * db );
		simularity = maxDifference - difference;

		return simularity >= tolerance;
	}
	return false;
}

// End of File Encapsulation
} )();

