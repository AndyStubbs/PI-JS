/*
* File: qbs-pset.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

// Sets a pixel to the screen
function pset( screenData, x, y ) {
	var c;

	// Make sure x and y are integers
	if( ! Number.isInteger( x ) || ! Number.isInteger( y ) ) {
		console.error( "pset: Argument's x and y must be integers." );
		return;
	}

	// Make sure x and y are on the screen
	if( ! qbs.util.inRange2( x, y, 0, 0, screenData.width, screenData.height ) ) {
		console.error( "pset: Argument's x and y are not on the screen." );
		return;
	}

	// Set the cursor
	screenData.x = x;
	screenData.y = y;

	// Get the fore color
	c = screenData.pal[ screenData.fColor ];

	qbData.commands.getImageData( screenData );
	qbData.commands.setPixel( screenData, x, y, c );
	screenData.dirty = true;
}

// Add internal command
qbs._.addCommand( "pset", pset );

// End of File Encapsulation
} )();
	