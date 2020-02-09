/*
* File: qbs-screen-graphics-paint.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "paint", paint, false, true, "both", "paint" );
function paint( screenData, args ) {
	var x, y, fc, fills, pixel, bc;

	x = args[ 0 ];
	y = args[ 1 ];
	fc = args[ 2 ];

	fills = [ {
		"x": x,
		"y": y
	} ];

	qbData.commands.getImageData( screenData );

	// If the color is a number then get it from the pal
	if( ! isNaN( fc ) ) {
		fc = screenData.pal[ fc ];
	} else if( ! fc || isNaN( fc.r ) || isNaN( fc.g ) || isNaN( fc.b ) ) {
		fc = screenData.pal[ screenData.fColor ];
	}

	// Get the background color
	bc = qbData.commands.getPixel( screenData, x, y );

	// Loop until no fills left
	while( fills.length > 0 ) {

		pixel = fills.pop();

		// Set the current pixel
		qbData.commands.setPixel( screenData, pixel.x, pixel.y, fc );

		// Add fills to neighbors
		addFill( screenData, pixel.x + 1, pixel.y, fills, fc, bc );
		addFill( screenData, pixel.x - 1, pixel.y, fills, fc, bc );
		addFill( screenData, pixel.x, pixel.y + 1, fills, fc, bc );
		addFill( screenData, pixel.x, pixel.y - 1, fills, fc, bc );
	}

	screenData.dirty = true;
}

function addFill( screenData, x, y, fills, fc, bc ) {
	var fill;
	if( floodCheck( screenData, x, y, fc, bc ) ) {
		qbData.commands.setPixel( screenData, x, y, fc );
		fill = { x: x, y: y };
		fills.push( fill );
	}
}

function floodCheck( screenData, x, y, fc, bc ) {
	var pc;

	if( x < 0 || x >= screenData.width || y < 0 || y >= screenData.height ) {
		return false;
	}
	pc = qbData.commands.getPixel( screenData, x, y );
	return ! qbs.util.compareColors( pc, fc ) && qbs.util.compareColors( pc, bc );
}

// End of File Encapsulation
} )();

