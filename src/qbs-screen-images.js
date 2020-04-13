/*
* File: qbs-screen-images.js
*/

// Start of File Encapsulation
( function () {

var qbData, qbWait, qbResume;

qbData = qbs._.data;
qbWait = qbs._.wait;
qbResume = qbs._.resume;

qbs._.addCommand( "loadImage", loadImage, false, false );
function loadImage( args ) {
	var src, name, image;
	src = args[ 0 ];
	name = args[ 1 ];

	if( typeof name !== "string" ) {
		name = "" + qbData.imageCount;
		qbData.imageCount += 1;
	}
	image = new Image();
	image.src = src;
	qbWait();
	image.onload = function () {
		qbData.images[ name ] = image;
		qbResume();
	};
	return name;
}

qbs._.addCommand( "drawImage", drawImage, false, true );
function drawImage( screenData, args ) {
	var target, x, y, angle, anchorX, anchorY, img;

	target = args[ 0 ];
	x = args[ 1 ];
	y = args[ 2 ];
	angle = args[ 3 ];
	anchorX = args[ 4 ];
	anchorY = args[ 5 ];

	if( typeof target === "string" ) {
		if( ! qbData.images[ target ] ) {
			console.error( "drawImage: invalid image name" );
			return;
		}
		img = qbData.images[ target ];
	} else {
		if( ! target || ! target.canvas ) {
			console.error( "drawScreen: invalid screenTarget" );
			return;
		}
		img = target.canvas();
	}

	drawItem( screenData, img, x, y, angle, anchorX, anchorY );
}

function drawItem( screenData, img, x, y, angle, anchorX, anchorY ) {
	var context;

	if( ! angle ) {
		angle = 0;
	}

	// Convert the angle from degrees to radian
	angle = qbs.util.degreesToRadian( angle );

	if( ! anchorX ) {
		anchorX = 0;
	}
	if( ! anchorY ) {
		anchorY = 0;
	}
	anchorX = Math.round( img.width * anchorX );
	anchorY = Math.round( img.height * anchorY );
	context = screenData.context;

	if( screenData.dirty ) {
		screenData.screenObj.render();
	}
	context.translate( x, y );
	context.rotate( angle );
	context.drawImage( img, -anchorX, -anchorY );
	context.rotate( -angle );
	context.translate( -x, -y );
}

// End of File Encapsulation
} )();
