/*
* File: qbs-canvas.js
*/

// Start of File Encapsulation
( function () {

function canvas( screenData ) {
	return screenData.canvas;
}

// Add internal command
qbs._.addCommand( "canvas", canvas );

// End of File Encapsulation
} )();
