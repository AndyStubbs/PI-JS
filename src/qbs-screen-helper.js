/*
* File: qbs-print.js
*/

// Start of File Encapsulation
( function () {

function getImageData( screenData ) {
	if( screenData.dirty === false ) {
		screenData.imageData = screenData.context.getImageData( 0, 0, screenData.width, screenData.height );
	}
}

qbs._.addCommand( "getImageData", getImageData );

// End of File Encapsulation
} )();
