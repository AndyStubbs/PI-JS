/*
* File: qbs-screen-images.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_qbData, m_qbWait, m_qbResume;

m_qbData = qbs._.data;
m_qbWait = qbs._.wait;
m_qbResume = qbs._.resume;

qbs._.addCommand( "loadImage", loadImage, false, false, [ "src", "name" ] );
function loadImage( args ) {
	var src, name, image;

	src = args[ 0 ];
	name = args[ 1 ];

	if( typeof src === "string" ) {

		// Create a new image
		image = new Image();

		// Set the source
		image.src = src;

	} else {
		image = src;
	}

	if( typeof name !== "string" ) {
		name = "" + m_qbData.imageCount;
		m_qbData.imageCount += 1;
	}

	if( ! image.complete ) {
		m_qbWait();
		image.onload = function () {
			m_qbData.images[ name ] = image;
			m_qbResume();
		};
	} else {
		m_qbData.images[ name ] = image;
	}

	return name;
}

qbs._.addCommand( "drawImage", drawImage, false, true,
	[ "name", "x", "y", "angle", "anchorX", "anchorY", "img", "alpha" ]
);
function drawImage( screenData, args ) {
	var name, x, y, angle, anchorX, anchorY, img, alpha;

	name = args[ 0 ];
	x = args[ 1 ];
	y = args[ 2 ];
	angle = args[ 3 ];
	anchorX = args[ 4 ];
	anchorY = args[ 5 ];
	alpha = args[ 6 ];

	if( typeof name === "string" ) {
		if( ! m_qbData.images[ name ] ) {
			m_qbData.log( "drawImage: invalid image name" );
			return;
		}
		img = m_qbData.images[ name ];
	} else {
		if( ! name && ! name.canvas && ! name.getContext ) {
			m_qbData.log(
				"drawImage: image source object type. Must be an image already " +
				"loaded by the loadImage command or a screen."
			);
			return;
		}
		if( qbs.util.isFunction( name.canvas ) ) {
			img = name.canvas();
		} else {
			img = name;
		}
	}

	drawItem( screenData, img, x, y, angle, anchorX, anchorY, alpha );
}

function drawItem( screenData, img, x, y, angle, anchorX, anchorY, alpha ) {
	var context, oldAlpha;

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

	if( ! alpha && alpha !== 0 ) {
		alpha = 255;
	}

	anchorX = Math.round( img.width * anchorX );
	anchorY = Math.round( img.height * anchorY );
	context = screenData.context;

	oldAlpha = context.globalAlpha;
	context.globalAlpha = ( alpha / 255 );

	screenData.screenObj.render();

	context.translate( x, y );
	context.rotate( angle );
	context.drawImage( img, -anchorX, -anchorY );
	context.rotate( -angle );
	context.translate( -x, -y );
	context.globalAlpha = oldAlpha;
}

// End of File Encapsulation
} )();
