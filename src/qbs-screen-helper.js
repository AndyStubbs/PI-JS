/*
* File: qbs-screen-helper.js
*/

// Start of File Encapsulation
( function () {
"use strict";

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "getImageData", getImageData, true, false, [] );
function getImageData( screenData ) {
	if( screenData.dirty === false ) {
		screenData.imageData = screenData.context.getImageData(
			0, 0, screenData.width, screenData.height
		);
	}
}

qbs._.addCommand( "setImageDirty", setImageDirty, true, false, [] );
function setImageDirty( screenData ) {
	if( screenData.dirty === false ) {
		screenData.dirty = true;
		if( screenData.isAutoRender && ! screenData.autoRenderMicrotaskScheduled ) {
			screenData.autoRenderMicrotaskScheduled = true;
			qbs.util.queueMicrotask( function () {
				screenData.screenObj.render();
				screenData.autoRenderMicrotaskScheduled = false;
			} );
		}
	}
}

qbs._.addCommand( "setPixel", setPixel, true, false, [] );
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

qbs._.addCommand( "setPixelSafe", setPixelSafe, true, false, [] );
qbs._.addPen( "pixel", setPixelSafe, "square" );
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

	c = getPixelColor( screenData, c );

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

	qbData.commands.setImageDirty( screenData );
}

qbs._.addCommand( "getPixelColor", getPixelColor, true, false, [] );
function getPixelColor( screenData, c ) {
	var noise, change, half, c2;

	noise = screenData.pen.noise;
	if( ! noise ) {
		return c;
	}
	c2 = { "r": c.r, "g": c.g, "b": c.b, "a": c.a };
	half = noise / 2;
	if( qbs.util.isArray( noise ) ) {
		c2.r = qbs.util.clamp(
			Math.round( c2.r + qbs.util.rndRange( -noise[ 0 ], noise[ 0 ] ) ),
			0, 255
		);
		c2.g = qbs.util.clamp(
			Math.round( c2.g + qbs.util.rndRange( -noise[ 1 ], noise[ 1 ] ) ),
			0, 255
		);
		c2.b = qbs.util.clamp(
			Math.round( c2.b + qbs.util.rndRange( -noise[ 2 ], noise[ 2 ] ) ),
			0, 255
		);
		c2.a = qbs.util.clamp(
			c2.a + qbs.util.rndRange( -noise[ 3 ], noise[ 3 ] ),
			0, 255
		);
	} else {
		change = Math.round( Math.random() * noise - half );
		c2.r = qbs.util.clamp( c2.r + change, 0, 255 );
		c2.g = qbs.util.clamp( c2.g + change, 0, 255 );
		c2.b = qbs.util.clamp( c2.b + change, 0, 255 );
	}
	return c2;
}

qbs._.addCommand( "drawSquarePen", drawSquarePen, true, false, [] );
qbs._.addPen( "square", drawSquarePen, "square" );
function drawSquarePen( screenData, x, y, c ) {
	var size, x2, y2, offset;

	// Size must always be an odd number
	size = screenData.pen.size * 2 - 1;

	// Compute the center offset of the square
	offset = Math.round( size / 2 ) - 1;

	// Draw the square
	for( y2 = 0; y2 < size; y2++ ) {
		for( x2 = 0; x2 < size; x2++ ) {
			qbData.commands.setPixelSafe(
				screenData,
				x2 + x - offset,
				y2 + y - offset,
				c
			);
		}
	}

	qbData.commands.setImageDirty( screenData );
}

qbs._.addCommand( "drawCirclePen", drawCirclePen, true, false, [] );
qbs._.addPen( "circle", drawCirclePen, "round" );
function drawCirclePen( screenData, x, y, c ) {
	var size, half, x2, y2, x3, y3, offset, r;

	// Special case for pen size 2
	if( screenData.pen.size === 2 ) {
		qbData.commands.setPixelSafe( screenData, x, y, c );
		qbData.commands.setPixelSafe( screenData, x + 1, y, c );
		qbData.commands.setPixelSafe( screenData, x - 1, y, c );
		qbData.commands.setPixelSafe( screenData, x, y + 1, c );
		qbData.commands.setPixelSafe( screenData, x, y - 1, c );
		qbData.commands.setImageDirty( screenData );
		return;
	}

	// Double size to get the size of the outer box
	size = screenData.pen.size * 2;

	// Half is size of radius
	half = screenData.pen.size;

	// Calculate the center of circle
	offset = half - 1;

	// Loop through the square boundary outside of the circle
	for( y2 = 0; y2 < size; y2++ ) {
		for( x2 = 0; x2 < size; x2++ ) {

			// Compute the coordinates
			x3 = x2 - offset;
			y3 = y2 - offset;

			// Compute the radius of point - round to make pixel perfect
			r = Math.round( Math.sqrt( x3 * x3 + y3 * y3 ) );

			// Only draw the pixel if it is inside the circle
			if( r < half ) {
				qbData.commands.setPixelSafe( screenData, x3 + x, y3 + y, c );
			}
		}
	}

	qbData.commands.setImageDirty( screenData );
}

qbs._.addCommand( "getPixel", getPixel, true, false, [] );
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

qbs._.addCommand( "getPixelSafe", getPixelSafe, true, false, [] );
function getPixelSafe( screenData, x, y ) {

	qbData.commands.getImageData( screenData );

	return getPixel( screenData, x, y );
}

// Finds a color from the palette and returns it's value.
qbs._.addCommand( "findColorValue", findColorValue, true, false, [] );
function findColorValue( screenData, colorInput, commandName ) {
	var colorValue;

	if( qbs.util.isInteger( colorInput ) ) {
		if( colorInput > screenData.pal.length ) {
			console.error(
				commandName + ": parameter color is not a color in the palette."
			);
			return;
		}
		colorValue = screenData.pal[ colorInput ]
	} else {
		colorValue = qbs.util.convertToColor( colorInput );
		if( colorValue === null ) {
			console.error( commandName +
				": parameter color is not a valid color format."
			);
			return;
		}
	}
	return colorValue;
}

// Set the default pen draw function
qbData.defaultPenDraw = setPixelSafe;

// End of File Encapsulation
} )();
