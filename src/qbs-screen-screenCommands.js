/*
* File: qbs-screenCommands.js
*/

// Start of File Encapsulation
( function () {

// Set the active screen on qbs
function setActive( screenData ) {
	qbData.activeScreen = qbData.screens[ screenData.id ];
}

// Remove the screen from the page and memory
function removeScreen( screenData ) {
	var i;

	// Remove all commands from screen object
	for( i in screenData.screenObj ) {
		delete screenData.screenObj[ i ];
	}

	// Remove the canvas from the page
	screenData.canvas.parentElement.removeChild( screenData.canvas );

	// Set the canvas to null
	screenData.canvas = null;

	// Delete the screen from the screens container
	delete qbData.screens[ screenId ];

}

// Remove all screens from the page and memory
function removeAllScreens() {
	var i, screenData;
	for( i in qbData.screens ) {
		screenData = qbData.screens[ i ];
		removeScreen( screenData );
	}
}

// Set the background color of the canvas
function bgColor( screenData, c ) {
	var bc;
	if( Number.isInteger( c ) ) {
		bc = qbs.util.convertToColor( c ).s;
	} else {
		bc = c;
	}
	screenData.canvas.style.backgroundColor = bc;
}

// Set the background color of the container
function containerBgColor( screenData, c ) {
	var bc;
	if( screenData.container ) {
		if( Number.isInteger( c ) ) {
			bc = qbs.util.convertToColor( c ).s;
		} else {
			bc = c;
		}
		screenData.container.style.backgroundColor = bc;
	}
}

// Add internal commands
qbs._.addCommand( "setActive", setActive );
qbs._.addCommand( "removeScreen", removeScreen );
qbs._.addCommand( "removeAllScreens", removeAllScreens );
qbs._.addCommand( "bgColor", bgColor );
qbs._.addCommand( "containerBgColor", containerBgColor );

// End of File Encapsulation
} )();
	