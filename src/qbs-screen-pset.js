/*
* File: qbs-pset.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

// Sets a pixel to the screen
function pset( screenData, x, y ) {
	var i, data, c;

	// Clamp x & y
	x = qbs.util.clamp( x, 0, screenData.width - 1 );
	y = qbs.util.clamp( y, 0, screenData.height - 1 );

	// Set the cursor
	screenData.x = x;
	screenData.y = y;

	// Get the fore color
	c = screenData.pal[ screenData.fColor ];

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

// Add internal command
qbs._.addCommand( "pset", pset );

// End of File Encapsulation
} )();
	