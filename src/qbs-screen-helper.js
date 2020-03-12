/*
* File: qbs-screen-helper.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

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
	data = screenData.imageData.data

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

	qbData.commands.getImageData( screenData );

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index
	i = ( ( screenData.width * y ) + x ) * 4;

	data[ i ] = c.r;
	data[ i + 1 ] = c.g;
	data[ i + 2 ] = c.b;
	data[ i + 3 ] = c.a;

	screenData.dirty = true;
}

qbs._.addCommand( "getPixel", getPixel, true, false );
function getPixel( screenData, x, y ) {
	var data, i;

	// Get the image data
	data = screenData.imageData.data;

	// Calculate the index of the color
	i = ( ( screenData.width * y ) + x ) * 4;

	return {
		r: data[i],
		g: data[i + 1],
		b: data[i + 2],
		a: data[i + 3]
	};
}

qbs._.addCommand( "getPixelSafe", getPixelSafe, true, false );
function getPixelSafe( screenData, x, y ) {

	qbData.commands.getImageData( screenData );

	return getPixel( screenData, x, y );
}

// End of File Encapsulation
} )();
