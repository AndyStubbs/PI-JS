/*
* File: qbs-screen-bezier.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData;

qbData = qbs._.data;


// Bezier curve
qbs._.addCommands( "bezier", pxBezier, aaBezier, [ "xStart", "yStart",
	"xControlPoint1", "yControlPoint1", "xControlPoint2", "yControlPoint2",
	"xEnd", "yEnd" ] );
function pxBezier( screenData, args ) {
	var xStart, yStart, xControlPoint1, yControlPoint1, xControlPoint2,
		yControlPoint2, xEnd, yEnd, c, points, t, dt, point, lastPoint,
		distance, minDistance;

	xStart = parseInt( args[ 0 ] );
	yStart = parseInt( args[ 1 ] );
	xControlPoint1 = parseInt( args[ 2 ] );
	yControlPoint1 = parseInt( args[ 3 ] );
	xControlPoint2 = parseInt( args[ 4 ] );
	yControlPoint2 = parseInt( args[ 5 ] );
	xEnd = parseInt( args[ 6 ] );
	yEnd = parseInt( args[ 7 ] );

	// Make sure x and y are integers
	if( isNaN( xStart ) || isNaN( yStart ) ||
		isNaN( xControlPoint1 ) || isNaN( yControlPoint1 ) ||
		isNaN( xControlPoint2 ) || isNaN( yControlPoint2 ) ||
		isNaN( xEnd ) || isNaN( yEnd ) ) {
		console.error( "pset: Argument's xStart, yStart, xControlPoint1," +
			"yControlPoint1, xControlPoint2, yControlPoint2, xEnd, and yEnd" +
			" must be numbers." );
		return;
	}

	// Initialize the color for the line
	c = screenData.pal[ screenData.fColor ];

	qbData.commands.getImageData( screenData );
	minDistance = screenData.pen.size;
	points = [
		{ "x": xStart, "y": yStart },
		{ "x": xControlPoint1, "y": yControlPoint1 },
		{ "x": xControlPoint2, "y": yControlPoint2 },
		{ "x": xEnd, "y": yEnd }
	];

	lastPoint = calcStep( 0, points );

	// Set the first pixel
	screenData.pen.draw( screenData, lastPoint.x, lastPoint.y, c );

	t = 0.1;
	dt = 0.1;
	while( t < 1 ) {
		point = calcStep( t, points );
		distance = calcDistance( point, lastPoint );

		// Adjust the step size if it's too big
		if( distance > minDistance && dt > 0.00001 ) {
			t -= dt;
			dt = dt * 0.75;
		} else {
			screenData.pen.draw( screenData, point.x, point.y, c );
			lastPoint = point;
		}
		t += dt;
	}

	// Draw the last step
	point = calcStep( 1, points );
	screenData.pen.draw( screenData, point.x, point.y, c );

	screenData.dirty = true;
}

function calcDistance( p1, p2 ) {
	var dx, dy;
	dx = p1.x - p2.x;
	dy = p1.y - p2.y;
	return dx * dx + dy * dy;
}

function calcStep( t, points ) {
	var a, a2, a3, t2, t3;
	a = ( 1 - t );
	a2 = a * a;
	a3 = a * a * a;
	t2 = t * t;
	t3 = t * t * t;

	return {
		"x": Math.round(
			a3 * points[ 0 ].x +
			3 * a2 * t * points[ 1 ].x +
			3 * a * t2 * points[ 2 ].x +
			t3 * points[ 3 ].x
		),
		"y": Math.round(
			a3 * points[ 0 ].y +
			3 * a2 * t * points[ 1 ].y +
			3 * a * t2 * points[ 2 ].y +
			t3 * points[ 3 ].y
		)
	};
}

function aaBezier( screenData, args ) {
	var x, y, x2, y2, x3, y3, x4, y4;

	x = args[ 0 ] + 0.5;
	y = args[ 1 ] + 0.5;
	x2 = args[ 2 ] + 0.5;
	y2 = args[ 3 ] + 0.5;
	x3 = args[ 4 ] + 0.5;
	y3 = args[ 5 ] + 0.5;
	x4 = args[ 6 ] + 0.5;
	y4 = args[ 7 ] + 0.5;

	if( isNaN( x ) || isNaN( y ) || isNaN( x2 ) || isNaN( y2 ) || isNaN( x3 ) || isNaN( y3 ) || isNaN( x4 ) || isNaN( y4 ) ) {
		console.error("bezier: parameters x, y, x2, y2, x3, y3, x4, and y4 must be numbers.");
		return;
	}

	screenData.screenObj.render();

	screenData.context.strokeStyle = screenData.pal[ screenData.fColor ].s;
	screenData.context.beginPath();
	screenData.context.moveTo( x, y );
	screenData.context.bezierCurveTo( x2, y2, x3, y3, x4, y4 );
	screenData.context.stroke();
}

// End of File Encapsulation
} )();
