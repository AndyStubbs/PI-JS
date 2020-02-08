/*
* File: qbs-screen-graphics.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "pxCircle", pxCircle, false, true, "pixel", "circle" );
function pxCircle( screenData, args ) {
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

qbs._.addCommand( "aaCircle", aaCircle, false, true, "anti-alias", "circle" );
function aaCircle( screenData, args ) {
	var cx, cy, r, a1, a2;

	cx = args[ 0 ];
	cy = args[ 1 ];
	r = args[ 2 ];

	if( isNaN(cx) || isNaN(cy) || isNaN(r) ) {
		console.error("circle: parameters cx, cy, r must be numbers.");
		return;
	}
	if( screenData.dirty ) {
		screenData.screenObj.render();
	}
	a1 = qbs.util.degreesToRadian( 0 );
	a2 = qbs.util.degreesToRadian( 360 );
	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.pal[ screenData.fColor ].s;
	screenData.context.moveTo( cx + Math.cos(a1) * r, cy + Math.sin(a1) * r );
	screenData.context.arc( cx, cy, r, a1, a2 );
	screenData.context.stroke();
}

qbs._.addCommand( "put", put, false, true, "both", "put" );
function put( screenData, args ) {
	var data, x, y, dataX, dataY, startX, startY, width, height, i, c;

	data = args[ 0 ];
	x = args[ 1 ];
	y = args[ 2 ];

	// Exit if no data
	if( ! data || data.length < 1 ) {
		return;
	}

	// Clip x if offscreen
	if( x < 0 ) {
		startX = x * -1;
	} else {
		startX = 0;
	}

	// Clip y if offscreen
	if( y < 0 ) {
		startY = y * -1;
	} else {
		startY = 0;
	}

	// Calc width & height
	width = data[ 0 ].length - startX;
	height = data.length - startY;

	// Clamp width & height
	if( x + startX + width >= screenData.width ) {
		width = screenData.width - x + startX;
	}
	if( y + startY + height >= screenData.height ) {
		height = screenData.height - y + startY;
	}

	//Exit if there is no data that fits the screen
	if( width <= 0 || height <= 0 ) {
		return;
	}

	qbData.commands.getImageData( screenData );

	//Loop through the data
	for( dataY = startY; dataY < startY + height; dataY++ ) {
		for( dataX = startX; dataX < startX + width; dataX++ ) {

			//Get the color
			c = screenData.pal[ data[ dataY ][ dataX ] ];

			//Calculate the index of the image data
			i = ( ( screenData.width * ( y + dataY ) ) + ( x + dataX ) ) * 4;

			//Put the color in the image data
			if( c.a > 0 ) {
				screenData.imageData.data[ i ] = c.r;
				screenData.imageData.data[ i + 1 ] = c.g;
				screenData.imageData.data[ i + 2 ] = c.b;
				screenData.imageData.data[ i + 3 ] = c.a;
			}
		}
	}

	screenData.dirty = true;
}

qbs._.addCommand( "get", get, false, true, "both", "get" );
function get( screenData, args ) {
	var x1, y1, x2, y2, tolerance, t, width, height, imageData, data, x, y, c, r, g, b, i, row;

	x1 = args[ 0 ];
	y1 = args[ 1 ];
	x2 = args[ 2 ];
	y2 = args[ 3 ];
	tolerance = args[ 4 ];

	x1 = qbs.util.clamp( x1, 0, screenData.width - 1 );
	x2 = qbs.util.clamp( x2, 0, screenData.width - 1 );
	y1 = qbs.util.clamp( y1, 0, screenData.height - 1 );
	y2 = qbs.util.clamp( y2, 0, screenData.height - 1 );
	if( x1 > x2 ) {
		t = x1;
		x1 = x2;
		x2 = t;
	}
	if( y1 > y2 ) {
		t = y1;
		y1 = y2;
		y2 = t;
	}
	width = x2 - x1;
	height = y2 - y1;

	if( width <= 0 || height <= 0 ) {
		return [ [] ];
	}

	qbData.commands.getImageData( screenData );

	imageData = screenData.imageData;

	data = [];
	row = 0;
	for( y = y1; y < y2; y++ ) {
		data.push([]);
		for( x = x1; x < x2; x++ ) {
			// Calculate the index of the image data
			i = ( ( screenData.width * y ) + x ) * 4;
			r = imageData.data[ i ];
			g = imageData.data[ i + 1 ];
			b = imageData.data[ i + 2 ];
			c = screenData.screenObj.findColor( qbs.util.rgbToColor( r, g, b ), tolerance );
			data[ row ].push( c );
		}
		row += 1;
	}

	return data;
}

qbs._.addCommand( "pset", pset, false, true, "both", "pset" );
function pset( screenData, args ) {
	var x, y, c;

	x = args[ 0 ];
	y = args[ 1 ];

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

qbs._.addCommand( "pxLine", pxLine, false, true, "pixel", "line" );
function pxLine( screenData, args ) {
	var x1, y1, x2, y2, c, dx, dy, sx, sy, err, e2;

	x1 = args[ 0 ];
	y1 = args[ 1 ];
	x2 = args[ 2 ];
	y2 = args[ 3 ];

	// Make sure x and y are integers
	if( ! Number.isInteger( x1 ) || ! Number.isInteger( y1 ) ||
		! Number.isInteger( x2 ) || ! Number.isInteger( y2 ) ) {
		console.error("pset: Argument's x1, y1, x2, and y2 must be integers.");
		return;
	}

	// Initialize the color for the line
	c = screenData.pal[ screenData.fColor ];

	//x1 = qbs.util.clamp( x1, 0, screenData.width - 1 );
	//x2 = qbs.util.clamp( x2, 0, screenData.width - 1 );
	//y1 = qbs.util.clamp( y1, 0, screenData.height - 1 );
	//y2 = qbs.util.clamp( y2, 0, screenData.height - 1 );
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
	qbData.commands.setPixelSafe( screenData, x1, y1, c );

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
		qbData.commands.setPixelSafe( screenData, x1, y1, c );
	}

	screenData.dirty = true;
}

qbs._.addCommand( "aaLine", aaLine, false, true, "anti-alias", "line" );
function aaLine( screenData, args ) {
	var x1, y1, x2, y2;

	x1 = args[ 0 ];
	y1 = args[ 1 ];
	x2 = args[ 2 ];
	y2 = args[ 3 ];

	if( isNaN( x1 ) || isNaN( y1 ) || isNaN( x2 ) || isNaN( y2 ) ) {
		console.error("line: parameters x1, y1, x2, y2 must be numbers.");
		return;
	}
	if( screenData.dirty ) {
		screenData.screenObj.render();
	}
	screenData.context.strokeStyle = screenData.pal[ screenData.fColor ].s;
	screenData.context.beginPath();
	screenData.context.moveTo( x1, y1 );
	screenData.context.lineTo( x2, y2 );
	screenData.context.stroke();
}

qbs._.addCommand( "pxRect", pxRect, false, true, "pixel", "rect" );
function pxRect( screenData, args ) {
	var x1, y1, width, height, x2, y2;

	x1 = args[ 0 ];
	y1 = args[ 1 ];
	width = args[ 2 ];
	height = args[ 3 ];

	x2 = x1 + width;
	y2 = y1 + height;

	screenData.screenObj.line( x1, y1, x2, y1 );
	screenData.screenObj.line( x2, y1, x2, y2 );
	screenData.screenObj.line( x2, y2, x1, y2 );
	screenData.screenObj.line( x1, y2, x1, y1 );

}

qbs._.addCommand( "aaRect", aaRect, false, true, "anti-alias", "rect" );
function aaRect( screenData, args ) {
	var x, y, width, height;

	x = args[ 0 ];
	y = args[ 1 ];
	width = args[ 2 ];
	height = args[ 3 ];

	if( isNaN(x) || isNaN(y) || isNaN(width) || isNaN(height) ) {
		console.error("rect: parameters x, y, width, height must be numbers.");
		return;
	}
	if( screenData.dirty ) {
		screenData.screenObj.render();
	}
	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.pal[ screenData.fColor ].s;
	screenData.context.rect( x, y, width, height );
	screenData.context.stroke();
}

qbs._.addCommand( "render", render, false, true, "both", "render" );
function render( screenData ) {
	if( screenData.imageData && screenData.dirty ) {
		screenData.context.putImageData( screenData.imageData, 0, 0 );
	}
	screenData.dirty = false;
}

// End of File Encapsulation
} )();
	