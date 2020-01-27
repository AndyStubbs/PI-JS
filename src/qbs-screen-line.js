/*
* File: qbs-line.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

function qbLine( screenData, x1, y1, x2, y2 ) {
	var c, dx, dy, sx, sy, err, e2;

	// Make sure x and y are integers
	if( ! Number.isInteger( x1 ) || ! Number.isInteger( y1 ) ||
		! Number.isInteger( x2 ) || ! Number.isInteger( y2 ) ) {
		console.error("pset: Argument's x1, y1, x2, and y2 must be integers.");
		return;
	}

	// Initialize the color for the line
	c = screenData.pal[ screenData.fColor ];

	x1 = qbs.util.clamp( x1, 0, screenData.width - 1 );
	x2 = qbs.util.clamp( x2, 0, screenData.width - 1 );
	y1 = qbs.util.clamp( y1, 0, screenData.height - 1 );
	y2 = qbs.util.clamp( y2, 0, screenData.height - 1 );
	dx = Math.abs( x2 - x1 );
	dy = Math.abs( y2 - y1 );

	// Set the x slope
	if( x1 < x2 ) {
		sx = 1;
	} else {
		sx = -1;
	}

	// Set the y slope
	if( y1 < y2 ) {
		sy = 1;
	} else {
		sy = -1;
	}

	// Set the err
	err = dx - dy;

	// Get the image data
	qbData.commands.getImageData( screenData );

	// Set the first pixel
	qbData.commands.setPixel( screenData, x1, y1, c );

	// Loop until the end of the line
	while ( ! ( ( x1 === x2 ) && ( y1 === y2 ) ) ) {
		e2 = err << 1;

		if ( e2 > -dy ) {
			err -= dy;
			x1 += sx;
		}

		if ( e2 < dx ) {
			err += dx;
			y1 += sy;
		}

		// Set the next pixel
		qbData.commands.setPixel( screenData, x1, y1, c );
	}

	screenData.dirty = true;
}

function cLine( screenData, x1, y1, x2, y2 ) {
	if( isNaN( x1 ) || isNaN( y1 ) || isNaN( x2 ) || isNaN( y2 ) ) {
		console.error("line: parameters x1, y1, x2, y2 must be numbers.");
		return;
	}
	if( screenData.dirty ) {
		qbData.commands.render( screenData );
	}
	screenData.context.strokeStyle = screenData.pal[ qbData.screenData.fColor ].s;
	screenData.context.beginPath();
	screenData.context.moveTo( x1, y1 );
	screenData.context.lineTo( x2, y2 );
	screenData.context.stroke();
}

// Add internal command
qbs._.addCommand( "qbLine", qbLine );
qbs._.addCommand( "cLine", cLine );

// End of File Encapsulation
} )();
