/*
* File: qbs-init.js
*/

// Start of File Encapsulation
(function () {

"use strict";

var i, qbData;

qbData = qbs._.data;

// Set the 0 pixel to transparent
qbData.defaultPalette[ 0 ] = {
	r: 0,
	g: 0,
	b: 0,
	a: 0,
	s: "#00000000",
	s2: "#000000"
};

// Initialize the default palette
for( i = 1; i < qbData.defaultPalette.length; i++ ) {
	qbData.defaultPalette[ i ] = qbs.util.hexToRgb( qbData.defaultPalette[ i ] );
}

// Create the API
qbs._.processCommands();

if(window.$ === undefined) {
	window.$ = window.qbs;
}

// Delete reference to internal functions
delete qbs._;

// End of File Encapsulation
})();

