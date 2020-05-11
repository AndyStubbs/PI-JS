/*
* File: qbs-screen-graphics.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData;

qbData = qbs._.data;

// Circle command
qbs._.addCommands( "circle", pxCircle, aaCircle, [ "x", "y", "radius" ] );
function pxCircle( screenData, args ) {
	var x, y, radius, x2, y2, midPoint, color;
	x = args[ 0 ];
	y = args[ 1 ];
	radius = args[ 2 ];
	qbData.commands.getImageData( screenData );

	// Make sure x and y are integers
	if( isNaN( x ) || isNaN( y ) || isNaN( radius ) ) {
		console.error( "circle: Argument's cx, cy, r must be numbers." );
		return;
	}

	// Initialize the color for the circle
	color = screenData.fColor;

	radius -= 1;
	x2 = radius;
	y2 = 0;

	// Set the first pixel at 90 degrees
	//screenData.pen.draw( screenData, x + cx, y + cy, c );
	
	// Only print inital points if r > 0
	if( radius > 1 ) {
		screenData.pen.draw( screenData, x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, x, x2 + y, color );
		screenData.pen.draw( screenData, x, -x2 + y, color );
	} else if( radius === 1 ) {
		screenData.pen.draw( screenData, x + 1, y, color );
		screenData.pen.draw( screenData, x - 1, y, color );
		screenData.pen.draw( screenData, x, y + 1, color );
		screenData.pen.draw( screenData, x, y - 1, color );
		qbData.commands.setImageDirty( screenData );
		return;
	} else if( radius === 0 ) {
		screenData.pen.draw( screenData, x, y, color );
		qbData.commands.setImageDirty( screenData );
		return;
	}

	// Initialize p
	midPoint = 1 - radius;
	while( x2 > y2 ) {
		y2 += 1;
		
		if( midPoint <= 0 ) {
			// Mid-point is inside or on the perimeter
			midPoint = midPoint + 2 * y2 + 1;
		} else {
			// Mid point is outside the perimeter
			x2 -= 1;
			midPoint = midPoint + 2 * y2 - 2 * x2 + 1;
		}
		
		// All the perimeter points have already been printed
		//if( x < y ) {
		// ???Unreachable code???
		//	break;
		//}
		
		// Set pixels around point and reflection in other octants
		screenData.pen.draw( screenData, x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, x2 + x, -y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, -y2 + y, color );
		
		// Set pixels on the perimeter points if not on x = y
		if( x2 != y2 ) {
			screenData.pen.draw( screenData, y2 + x, x2 + y, color );
			screenData.pen.draw( screenData, -y2 + x, x2 + y, color );
			screenData.pen.draw( screenData, y2 + x, -x2 + y, color );
			screenData.pen.draw( screenData, -y2 + x, -x2 + y, color );
		}
	}

	qbData.commands.setImageDirty( screenData );
}

function aaCircle( screenData, args ) {
	var x, y, r, angle1, angle2;

	x = args[ 0 ] + 0.5;
	y = args[ 1 ] + 0.5;
	r = args[ 2 ] - 0.9;

	if( isNaN( x ) || isNaN( y ) || isNaN( r ) ) {
		console.error("circle: parameters cx, cy, r must be numbers.");
		return;
	}

	screenData.screenObj.render();
	angle1 = qbs.util.degreesToRadian( 0 );
	angle2 = qbs.util.degreesToRadian( 360 );
	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.fColor.s;
	screenData.context.moveTo( x + Math.cos( angle1 ) * r, y + Math.sin( angle1 ) * r );
	screenData.context.arc( x, y, r, angle1, angle2 );
	screenData.context.stroke();
}

// Arc command
qbs._.addCommands( "arc", pxArc, aaArc, [ "x", "y", "radius", "angle1", "angle2" ] );
function pxArc( screenData, args ) {
	var x, y, radius, angle1, angle2, color, x2, y2, midPoint, winding;

	function set( x2, y2 ) {
		var a;
		a = ( qbs.util.radiansToDegrees( Math.atan2( y2 - y, x2 - x ) ) );
		a = ( a + 360 ) % 360;
		if( winding ) {
			if( a >= angle1 || a <= angle2 ) {
				screenData.pen.draw( screenData, x2, y2, color );
			}
		} else if( a >= angle1 && a <= angle2 ) {
			screenData.pen.draw( screenData, x2, y2, color );
		}
	}

	x = args[ 0 ];
	y = args[ 1 ];
	radius = args[ 2 ];
	angle1 = args[ 3 ];
	angle2 = args[ 4 ];
	angle1 = ( angle1 + 360 ) % 360;
	angle2 = ( angle2 + 360 ) % 360;
	winding = false;
	if( angle1 > angle2 ) {
		winding = true;
	//	temp = a1;
	//	a1 = a2;
	//	a2 = temp;
	}
	qbData.commands.getImageData( screenData );

	// Make sure x and y are integers
	if( isNaN( x ) || isNaN( y ) || isNaN( radius ) ) {
		console.error( "circle: Argument's cx, cy, r must be numbers." );
		return;
	}

	// Initialize the color for the circle
	color = screenData.fColor;

	radius -= 1;
	if( radius < 0 ) {
		radius = 0;
	}
	x2 = radius;
	y2 = 0;

	// Set the first pixel at 90 degrees
	//screenData.pen.draw( screenData, x + cx, y + cy, c );
	
	// Only print inital points if r > 0
	if( radius > 1 ) {
		set( x2 + x, y2 + y, color );
		set( -x2 + x, y2 + y, color );
		set( x, x2 + y, color );
		set( x, -x2 + y, color );
	} else if( radius === 1 ) {
		set( x + 1, y, color );
		set( x - 1, y, color );
		set( x, y + 1, color );
		set( x, y - 1, color );
		qbData.commands.setImageDirty( screenData );
		return;
	} else if( radius === 0 ) {
		screenData.pen.draw( screenData, x, y, color );
		qbData.commands.setImageDirty( screenData );
		return;
	}

	// Initialize p
	midPoint = 1 - radius;
	while( x2 > y2 ) {
		y2 += 1;

		if( midPoint <= 0 ) {
			// Mid-point is inside or on the perimeter
			midPoint = midPoint + 2 * y2 + 1;
		} else {
			// Mid point is outside the perimeter
			x2 -= 1;
			midPoint = midPoint + 2 * y2 - 2 * x2 + 1;
		}

		// Set pixels around point and reflection in other octants
		set( x2 + x, y2 + y, color );
		set( -x2 + x, y2 + y, color );
		set( x2 + x, -y2 + y, color );
		set( -x2 + x, -y2 + y, color );
		
		// Set pixels on the perimeter points if not on x = y
		if( x2 != y2 ) {
			set( y2 + x, x2 + y, color );
			set( -y2 + x, x2 + y, color );
			set( y2 + x, -x2 + y, color );
			set( -y2 + x, -x2 + y, color );
		}
	}

	qbData.commands.setImageDirty( screenData );

}

function aaArc( screenData, args ) {
	var x, y, radius, angle1, angle2;

	x = args[ 0 ];
	y = args[ 1 ];
	radius = args[ 2 ];
	angle1 = args[ 3 ];
	angle2 = args[ 4 ];

	if( isNaN( x ) || isNaN( y ) || isNaN( radius ) || isNaN( angle1 ) || isNaN( angle2 ) ) {
		console.error( "arc: parameters cx, cy, r, a1, a2 must be numbers." );
		return;
	}

	x = x + 0.5;
	y = y + 0.5;
	radius = radius - 0.9;
	if( radius < 0 ) {
		radius = 0;
	}

	screenData.screenObj.render();
	angle1 = qbs.util.degreesToRadian( angle1 );
	angle2 = qbs.util.degreesToRadian( angle2 );
	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.fColor.s;
	screenData.context.moveTo( x + Math.cos(angle1) * radius, y + Math.sin(angle1) * radius );
	screenData.context.arc( x, y, radius, angle1, angle2 );
	screenData.context.stroke();
}

// Ellipse command
qbs._.addCommands( "ellipse", pxEllipse, aaEllipse, [ "x", "y", "radiusX", "radiusY" ] );
function pxEllipse( screenData, args ) {
	var x, y, radiusX, radiusY, color, dx, dy, d1, d2, x2, y2;

	x = args[ 0 ];
	y = args[ 1 ];
	radiusX = args[ 2 ];
	radiusY = args[ 3 ];

	if( isNaN( x ) || isNaN( y ) || isNaN( radiusX ) || isNaN( radiusY ) ) {
		console.error("ellipse: parameters cx, cy, rx, ry must be numbers.");
		return;
	}

	qbData.commands.getImageData( screenData );

	// Initialize the color for the circle
	color = screenData.fColor;

	if( radiusX === 0 && radiusY === 0 ) {
		screenData.pen.draw( screenData, x, y, color );
		qbData.commands.setImageDirty( screenData );
		return;
	}

	// Starting points
	x2 = 0;
	y2 = radiusY;
	
	// Decision parameter of region 1
	d1 = ( radiusY * radiusY ) - ( radiusX * radiusX * radiusY ) + ( 0.25 * radiusX * radiusX );
	
	dx = 2 * radiusY * radiusY * x2;
	dy = 2 * radiusX * radiusX * y2;
	
	// For region 1
	while( dx < dy ) {
		
		// 4-way symmetry
		screenData.pen.draw( screenData, x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, x2 + x, -y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, -y2 + y, color );

		// Checking and updating value of
		// decision parameter based on algorithm
		if( d1 < 0 ) {
			x2++;
			dx = dx + ( 2 * radiusY * radiusY );
			d1 = d1 + dx + ( radiusY * radiusY );
		} else {
			x2++;
			y2--;
			dx = dx + ( 2 * radiusY * radiusY );
			dy = dy - ( 2 * radiusX * radiusX );
			d1 = d1 + dx - dy + ( radiusY * radiusY );
		}
	}

	// Decision parameter of region 2
	d2 = ( ( radiusY * radiusY ) * ( ( x2 + 0.5 ) * ( x2 + 0.5 ) ) ) +
		 ( ( radiusX * radiusX ) * ( ( y2 - 1 ) * ( y2 - 1 ) ) ) -
		 ( radiusX * radiusX * radiusY * radiusY );
	
	// Plotting points of region 2
	while( y2 >= 0 ) {

		// 4-way symmetry
		screenData.pen.draw( screenData, x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, y2 + y, color );
		screenData.pen.draw( screenData, x2 + x, -y2 + y, color );
		screenData.pen.draw( screenData, -x2 + x, -y2 + y, color );
		
		// Checking and updating parameter 
		// value based on algorithm 
		if( d2 > 0 ) { 
			y2--; 
			dy = dy - ( 2 * radiusX * radiusX ); 
			d2 = d2 + ( radiusX * radiusX ) - dy; 
		} else { 
			y2--; 
			x2++; 
			dx = dx + ( 2 * radiusY * radiusY ); 
			dy = dy - ( 2 * radiusX * radiusX ); 
			d2 = d2 + dx - dy + ( radiusX * radiusX ); 
		}
	}

	qbData.commands.setImageDirty( screenData );
}

function aaEllipse( screenData, args ) {
	var cx, cy, rx, ry;

	cx = args[ 0 ];
	cy = args[ 1 ];
	rx = args[ 2 ];
	ry = args[ 3 ];

	if( isNaN( cx ) || isNaN( cy ) || isNaN( rx ) || isNaN( ry ) ) {
		console.error( "ellipse: parameters cx, cy, rx, ry must be numbers." );
		return;
	}
	if( screenData.dirty ) {
		screenData.screenObj.render();
	}

	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.fColor.s;
	screenData.context.moveTo( cx + rx, cy );
	screenData.context.ellipse( cx, cy, rx, ry, 0, qbs.util.math.deg360, false );
	screenData.context.stroke();
}

// Put command
qbs._.addCommand( "put", put, false, true, [ "data", "x", "y" ] );
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

	qbData.commands.setImageDirty( screenData );
}

// Get command
qbs._.addCommand( "get", get, false, true, [ "x1", "y1", "x2", "y2", "tolerance" ] );
function get( screenData, args ) {
	var x1, y1, x2, y2, tolerance, t, width, height, imageData, data, x, y, c, r, g, b, i, row, a;

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
			a = imageData.data[ i + 3 ];
			c = screenData.screenObj.findColor( qbs.util.rgbToColor( r, g, b, a ), tolerance );
			data[ row ].push( c );
		}
		row += 1;
	}

	return data;
}

// PSET command
qbs._.addCommand( "pset", pset, false, true, [ "x", "y" ] );
function pset( screenData, args ) {
	var x, y, color;

	x = args[ 0 ];
	y = args[ 1 ];

	// Make sure x and y are integers
	if( ! qbs.util.isInteger( x ) || ! qbs.util.isInteger( y ) ) {
		console.error( "pset: Argument's x and y must be integers." );
		return;
	}

	// Set the cursor
	screenData.x = x;
	screenData.y = y;

	// Make sure x and y are on the screen
	if( ! qbs.util.inRange2( x, y, 0, 0, screenData.width, screenData.height ) ) {
		//console.error( "pset: Argument's x and y are not on the screen." );
		return;
	}

	// Get the fore color
	color = screenData.fColor;

	qbData.commands.getImageData( screenData );
	screenData.pen.draw( screenData, x, y, color );
	qbData.commands.setImageDirty( screenData );
}

// Line command
qbs._.addCommands( "line", pxLine, aaLine, [ "x1", "y1", "x2", "y2" ] );
function pxLine( screenData, args ) {
	var x1, y1, x2, y2, color, dx, dy, sx, sy, err, e2;

	x1 = args[ 0 ];
	y1 = args[ 1 ];
	x2 = args[ 2 ];
	y2 = args[ 3 ];

	// Make sure x and y are integers
	if( ! qbs.util.isInteger( x1 ) || ! qbs.util.isInteger( y1 ) ||
		! qbs.util.isInteger( x2 ) || ! qbs.util.isInteger( y2 ) ) {
		console.error( "line: Argument's x1, y1, x2, and y2 must be integers." );
		return;
	}

	// Initialize the color for the line
	color = screenData.fColor;

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
	screenData.pen.draw( screenData, x1, y1, color );

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
		screenData.pen.draw( screenData, x1, y1, color );
	}

	qbData.commands.setImageDirty( screenData );
}

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

	screenData.screenObj.render();
	screenData.context.strokeStyle = screenData.fColor.s;
	screenData.context.beginPath();
	screenData.context.moveTo( x1, y1 );
	screenData.context.lineTo( x2, y2 );
	screenData.context.stroke();
}

// Rect command
qbs._.addCommands( "rect", pxRect, aaRect, [ "x1", "y1", "width", "height" ] );
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

	screenData.screenObj.render();
	screenData.context.beginPath();
	screenData.context.strokeStyle = screenData.fColor.s;
	screenData.context.rect( x, y, width, height );
	screenData.context.stroke();
}

// Set Pal Color command
qbs._.addCommand( "setPalColor", setPalColor, false, true, [ "index", "color" ] );
function setPalColor( screenData, args ) {
	var index, color, colorValue, i;

	index = args[ 0 ];
	color = args[ 1 ];

	if( ! qbs.util.isInteger( index ) || index < 0 || index > screenData.pal.length ) {
		console.error( "setPalColor: index is not a valid integer value." );
		return;
	}
	colorValue = qbs.util.convertToColor( color );
	if( colorValue === null ) {
		console.error( "setPalColor: parameter color is not a valid color format." );
		return;
	}

	// Check if we are changing the current selected fore color
	if( screenData.fColor.s === screenData.pal[ index ].s ) {
		screenData.fColor = colorValue;
	}

	// Check if we are changing any of the colors
	for( i = 0; i < screenData.colors.length; i++ ) {
		if( screenData.colors[ i ].s === screenData.pal[ index ].s ) {
			screenData.colors[ i ] = colorValue;
		}
	}

	screenData.pal[ index ] = colorValue;
}

// Get pal command
qbs._.addCommand( "getPal", getPal, false, true, [] );
function getPal( screenData, args ) {
	var i, color, colors;
	colors = [];
	for( i = 0; i < screenData.pal.length; i++ ) {
		color = {
			"r": screenData.pal[ i ].r,
			"g": screenData.pal[ i ].g,
			"b": screenData.pal[ i ].b,
			"a": screenData.pal[ i ].a,
			"s": screenData.pal[ i ].s
		};
		colors.push( screenData.pal[ i ] );
	}
	return colors;
}

// Color command
qbs._.addCommand( "color", color, false, true, [ "color", "isAddToPalette" ] );
function color( screenData, args ) {
	var colorInput, colorValue, isAddToPalette, colors;

	colorInput = args[ 0 ];
	isAddToPalette = !!( args[ 1 ] );
	colorValue = qbData.commands.findColorValue( screenData, colorInput, "color" );

	if( colorValue === undefined ) {
		return;
	}
	colors = [ colorValue ];

	if( isAddToPalette ) {
		screenData.fColor = screenData.screenObj.findColor( colorValue, isAddToPalette );
	} else {
		screenData.fColor = colorValue;
	}

	screenData.colors = colors;

	screenData.context.fillStyle = colorValue.s;
	screenData.context.strokeStyle = colorValue.s;
}

// Colors command
qbs._.addCommand( "colors", colors, false, true, [ "colors" ] );
function colors( screenData, args ) {
	var colorInput, colorValue, i, colors;

	colorInput = args[ 0 ];
	colors = [];
	if( qbs.util.isArray( colorInput ) ) {
		if( colorInput.length === 0 ) {
			console.error( "color: color array cannot be empty." );
			return;
		}
		for( i = 0; i < colorInput.length; i++ ) {
			colorValue = qbData.commands.findColorValue( screenData, colorInput[ i ], "color" );
			if( colorValue === undefined ) {
				return;
			}
			colors.push( colorValue );
		}
		colorValue = colors[ 0 ];
	} else {
		console.error( "color: colors must be an array." );
		return;
	}

	screenData.fColor = colorValue;
	screenData.colors = colors;

	screenData.context.fillStyle = colorValue.s;
	screenData.context.strokeStyle = colorValue.s;
}

qbs._.addCommand( "swapColor", swapColor, false, true, [ "oldColor", "newColor" ] );
function swapColor( screenData, args ) {
	var oldColor, newColor, index, x, y, i;

	oldColor = args[ 0 ];
	newColor = args[ 1 ];

	// Validate oldColor
	if( ! qbs.util.isInteger( oldColor ) ) {
		console.error( "swapColor: parameter oldColor must be an integer." );
		return;
	} else if( oldColor < 0 || oldColor > screenData.pal.length ) {
		console.error( "swapColor: parameter oldColor is an invalid integer." );
		return;
	}

	index = oldColor;
	oldColor = screenData.pal[ index ];

	// Validate newColor
	newColor = qbs.util.convertToColor( newColor );
	if( newColor === null ) {
		console.error( "swapColor: parameter newColor is not a valid color format." );
		return;
	}

	qbData.commands.getImageData( screenData );
	data = screenData.imageData.data;

	// Swap's all colors
	for( y = 0; y < screenData.height; y++ ) {
		for( x = 0; x < screenData.width; x++ ) {
			i = ( ( screenData.width * y ) + x ) * 4;
			if( 
				data[ i ] === oldColor.r && 
				data[ i + 1 ] === oldColor.g && 
				data[ i + 2 ] === oldColor.b && 
				data[ i + 3 ] === oldColor.a ) {
					data[ i ] = newColor.r;
					data[ i + 1 ] = newColor.g;
					data[ i + 2 ] = newColor.b;
					data[ i + 3] = newColor.a;
			}
		}
	}

	qbData.commands.setImageDirty( screenData );

	// Update the pal data
	screenData.pal[ index ] = newColor;

}

// Point command
qbs._.addCommand( "point", point, false, true, [ "x", "y" ] );
function point( screenData, args ) {
	var x, y, i, c, data;

	x = args[ 0 ];
	y = args[ 1 ];

	// Make sure x and y are integers
	if( ! qbs.util.isInteger( x ) || ! qbs.util.isInteger( y ) ) {
		console.error("point: Argument's x and y must be integers.");
		return;
	}

	qbData.commands.getImageData( screenData );
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;
	c = qbs.util.convertToColor( {
		r: data[ i ],
		g: data[ i + 1 ],
		b: data[ i + 2 ],
		a: data[ i + 3 ]
	} );
	return screenData.screenObj.findColor( c );
}

// CLS command
qbs._.addCommand( "cls", cls, false, true, [] );
function cls( screenData ) {
	screenData.context.clearRect(0, 0, screenData.width, screenData.height);
	screenData.imageData = null;
	screenData.printCursor.x = 0;
	screenData.printCursor.y = 0;
	screenData.x = 0;
	screenData.y = 0;
	screenData.dirty = false;
}

qbs._.addCommand( "filterImg", filterImg, false, true, [ "filter" ] );
function filterImg( screenData, args ) {
	var filter, data, x, y, i, color;

	filter = args[ 0 ];

	if( ! qbs.util.isFunction( filter ) ) {
		console.error("filter: Argument filter must be a callback function.");
		return;
	}

	qbData.commands.getImageData( screenData );
	data = screenData.imageData.data;

	// Swap's all colors
	for( y = 0; y < screenData.height; y++ ) {
		for( x = 0; x < screenData.width; x++ ) {
			i = ( ( screenData.width * y ) + x ) * 4;
			color = filter( {
				"r": data[ i ],
				"g": data[ i + 1 ],
				"b": data[ i + 2 ],
				"a": data[ i + 3 ]
			}, x, y );
			if( color && 
					qbs.util.isInteger( color.r ) &&
					qbs.util.isInteger( color.g ) &&
					qbs.util.isInteger( color.b ) &&
					qbs.util.isInteger( color.a ) ) {
				color.r = qbs.util.clamp( color.r, 0, 255 );
				color.g = qbs.util.clamp( color.g, 0, 255 );
				color.b = qbs.util.clamp( color.b, 0, 255 );
				color.a = qbs.util.clamp( color.a, 0, 255 );
				data[ i ] = color.r;
				data[ i + 1 ] = color.g;
				data[ i + 2 ] = color.b;
				data[ i + 3 ] = color.a;
			}
		}
	}

	qbData.commands.setImageDirty( screenData );
}

// Render command
qbs._.addCommand( "render", render, false, true, [] );
function render( screenData ) {
	if( screenData.imageData && screenData.dirty ) {
		screenData.context.putImageData( screenData.imageData, 0, 0 );
	}
	screenData.dirty = false;
}

// Set pen command
qbs._.addCommand( "setPen", setPen, false, true, [ "pen", "size", "noise" ] );
function setPen( screenData, args ) {
	var pen, size, noise, i;

	pen = args[ 0 ];
	size = args[ 1 ];
	noise = args[ 2 ];

	if( ! qbData.pens[ pen ] ) {
		console.error( "setPen: Argument pen is not a valid pen. Valid pens: " + qbData.penList.join(", " ) );
		return;
	}
	if( ! qbs.util.isInteger( size ) ) {
		console.error( "setPen: Argument size is not a valid number." );
		return;
	}
	if( noise && ( ! qbs.util.isArray( noise ) && Number.isNaN( noise ) ) ) {
		console.error( "setPen: Argument noise is not an array or number." );
		return;
	}
	if( qbs.util.isArray( noise ) ) {
		noise = noise.slice();
		for( i = 0; i < noise.length; i++ ) {
			if( Number.isNaN( noise[ i ] ) ) {
				console.error( "setPen: Argument noise array contains an invalid value." );
				return;
			}
		}
		// Make sure that noise array contains at least 4 values
		for(; i < 4; i++ ) {
			noise.push( 0 );
		}
	}

	// Set the minimum pen size to 1;
	if( size < 1 ) {
		size = 1;
	}

	// Handle special case of size of one
	if( size === 1 ) {

		// Size is one so only draw one pixel
		screenData.pen.draw = qbData.pens.pixel.cmd;

		// Set the line width for context draw
		screenData.context.lineWidth = 1;
	} else {

		// Set the draw mode for pixel draw
		screenData.pen.draw = qbData.pens[ pen ].cmd;

		// Set the line width for context draw
		screenData.context.lineWidth = size * 2 - 1;
	}

	screenData.pen.noise = noise;
	screenData.pen.size = size;
	screenData.context.lineCap = qbData.pens[ pen ].cap;
}

// End of File Encapsulation
} )();
