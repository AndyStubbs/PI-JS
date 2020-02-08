/*
* File: qbs-print.js
*/

// Start of File Encapsulation
( function () {

qbs._.addCommand( "getImageData", getImageData, true, false );
function getImageData( screenData ) {
	if( screenData.dirty === false ) {
		screenData.imageData = screenData.context.getImageData( 0, 0, screenData.width, screenData.height );
	}
}

qbs._.addCommand( "setPixel", setPixel, true, false );
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

qbs._.addCommand( "setPixelSafe", setPixelSafe, true, false );
function setPixelSafe( screenData, x, y, c ) {
	var data, i;

	if( x < 0 || x >= screenData.width || y < 0 || y >= screenData.height ) {
		return;
	}

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

}

// End of File Encapsulation
} )();
