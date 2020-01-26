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

function setPixel( screenData, x, y, c ) {
	var data, i;

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

}

function setPixelSafe( screenData, x, y, c ) {
	var data, i;

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	if( i < data.length && i >= 0 ) {
		data[ i ] = c.r;
		data[ i + 1 ] = c.g;
		data[ i + 2 ] = c.b;
		data[ i + 3 ] = c.a;
	}

}

qbs._.addCommand( "getImageData", getImageData );
qbs._.addCommand( "setPixel", setPixel );
qbs._.addCommand( "setPixelSafe", setPixelSafe );

// End of File Encapsulation
} )();
