/*
* File: qbs-print.js
*/

// Start of File Encapsulation
( function () {

function print( screenData, msg ) {
	console.log( screenData.id + ": " + msg );
}

qbs._.addCommand( "print", print );

// End of File Encapsulation
} )();
