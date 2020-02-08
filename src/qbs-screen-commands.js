/*
* File: qbs-screenCommands.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

// Set the active screen on qbs
qbs._.addCommand( "setActive", setActive, false, true, "both", "setActive" );
function setActive( screenData ) {
	qbData.activeScreen = qbData.screens[ screenData.id ];
}

// Remove the screen from the page and memory
qbs._.addCommand( "removeScreen", removeScreen, false, "both", "removeScreen" );
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
qbs._.addCommand( "removeAllScreens", removeAllScreens, false, true, "both", "removeAllScreens" );
function removeAllScreens() {
	var i, screenData;
	for( i in qbData.screens ) {
		screenData = qbData.screens[ i ];
		removeScreen( screenData );
	}
}

// Set the background color of the canvas
qbs._.addCommand( "bgColor", bgColor, false, true, "both", "bgColor" );
function bgColor( screenData, args ) {
	var c, bc;

	c = args[ 0 ];

	if( Number.isInteger( c ) ) {
		bc = qbs.util.convertToColor( c ).s;
	} else {
		bc = c;
	}
	screenData.canvas.style.backgroundColor = bc;
}

// Set the background color of the container
qbs._.addCommand( "containerBgColor", containerBgColor, false, true, "both", "bgColor" );
function containerBgColor( screenData, args ) {
	var c, bc;

	c = args[ 0 ];

	if( screenData.container ) {
		if( Number.isInteger( c ) ) {
			bc = qbs.util.convertToColor( c ).s;
		} else {
			bc = c;
		}
		screenData.container.style.backgroundColor = bc;
	}
}

qbs._.addCommand( "canvas", canvas, false, true, "both", "canvas" );
function canvas( screenData ) {
	return screenData.canvas;
}

qbs._.addCommand( "findColor", findColor, false, true, "both", "findColor" );
function findColor( screenData, args ) {
	var c, tolerance, i, pal, dr, dg, db, difference;

	c = args[ 0 ];
	tolerance = args[ 1 ];

	if(tolerance === undefined) {
		tolerance = 0;
	}

	pal = screenData.pal;

	if( screenData.cache[ "findColor" ][ c.s ] ) {
		return screenData.cache[ "findColor" ][ c.s ];
	}
	for( i = 1; i < pal.length; i++ ) {
		if(tolerance === 0 && pal[i].s === c.s) {
			screenData.cache[ "findColor" ][ c.s ] = i;
			return i;
		} else {
			dr = pal[i].r - c.r;
			dg = pal[i].g - c.g;
			db = pal[i].b - c.b;

			difference = dr * dr + dg * dg + db * db;
			if(difference <= tolerance) {
				screenData.cache[ "findColor" ][ c.s ] = i;
				return i;
			}
		}
	}
	pal.push( c );
	screenData.cache[ "findColor" ][ c.s ] = pal.length - 1;
	return pal.length - 1;
}

qbs._.addCommand( "setAntiAlias", setAntiAlias, false, true, "both", "setAntiAlias" );
function setAntiAlias( screenData, args ) {
	var isEnabled;

	isEnabled = args[ 0 ];

	if( isEnabled ) {
		screenData.anitAlias = true;
		for( i in screenData.antiAliasCommands ) {
			screenData.commands[ i ] = screenData.antiAliasCommands[ i ];
		}
	} else {
		screenData.anitAlias = false;
		for( i in screenData.aliasCommands ) {
			screenData.commands[ i ] = screenData.aliasCommands[ i ];
		}
	}
}

// End of File Encapsulation
} )();
