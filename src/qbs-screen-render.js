/*
* File: qbs-render.js
*/

// Start of File Encapsulation
( function () {

function render( screenData ) {
	if( screenData.imageData && screenData.dirty ) {
		screenData.context.putImageData( screenData.imageData, 0, 0 );
	}
	screenData.dirty = false;
}

// Add internal command
qbs._.addCommand( "render", render, false, true, "both", "render" );

// End of File Encapsulation
} )();
