/*
* File: qbs-screen-circle.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

function circle( screenData, args ) {
	var cx, cy, r, x, y, p, c;
	cx = args[ 0 ];
	cy = args[ 1 ];
	r = args[ 2 ];
	qbData.commands.getImageData( screenData );

	// Make sure x and y are integers
	if( isNaN( cx ) || isNaN( cy ) || isNaN( r ) ) {
		console.error( "circle: Argument's cx, cy, r must be numbers." );
		return;
	}

	// Initialize the color for the circle
	c = screenData.pal[ screenData.fColor ];

	x = r;
	y = 0;

	// Set the first pixel at 90 degrees
	qbData.commands.setPixelSafe( screenData, x + cx, y + cy, c );
	
	// Only print inital points if r > 0
	if( r >= 2 ) {
		qbData.commands.setPixelSafe( screenData, -x + cx, y + cy, c );
		qbData.commands.setPixelSafe( screenData, cx, x + cy, c );
		qbData.commands.setPixelSafe( screenData, cx, -x + cy, c );
	} else if( r === 1 ) {
		qbData.commands.setPixelSafe( screenData, -x + cx, y + cy, c );
		qbData.commands.setPixelSafe( screenData, cx, x + cy, c );
		qbData.commands.setPixelSafe( screenData, cx, -x + cy, c );
		screenData.dirty = true;
		return;
	}
	
	// Initialize p
	p = 1 - r;
	while( x > y ) {
		y += 1;
		
		if( p <= 0 ) {
			// Mid-point is inside or on the perimeter
			p = p + 2 * y + 1;
		} else {
			// Mid point is outside the perimeter
			x -= 1;
			p = p + 2 * y - 2 * x + 1;
		}
		
		// All the perimeter points have already been printed
		if( x < y ) {
			break;
		}
		
		// Set pixels around point and reflection in other octants
		qbData.commands.setPixelSafe( screenData, x + cx, y + cy, c );
		qbData.commands.setPixelSafe( screenData, -x + cx, y + cy, c );
		qbData.commands.setPixelSafe( screenData, x + cx, -y + cy, c );
		qbData.commands.setPixelSafe( screenData, -x + cx, -y + cy, c );
		
		// Set pixels on the perimeter points if not on x = y
		if( x != y ) {
			qbData.commands.setPixelSafe( screenData, y + cx, x + cy, c );
			qbData.commands.setPixelSafe( screenData, -y + cx, x + cy, c );
			qbData.commands.setPixelSafe( screenData, y + cx, -x + cy, c );
			qbData.commands.setPixelSafe( screenData, -y + cx, -x + cy, c );
		}
	}

	screenData.dirty = true;
}

// Add command
qbs._.addCommand( "circle", circle, false, true, "anti", "circle" );

// End of File Encapsulation
} )();
	