/*
* File: qbs-screen-put.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

function put( screenData, data, x, y ) {
	var dataX, dataY, startX, startY, width, height, i, c;

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


// Add internal command
qbs._.addCommand( "put", put );

// End of File Encapsulation
} )();
