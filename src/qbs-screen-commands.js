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
qbs._.addCommand( "removeScreen", removeScreen, false, true, "both", "removeScreen" );
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
		bc = screenData.pal[ c ];
	} else {
		bc = qbs.util.convertToColor( c );
	}
	if( bc && typeof bc.s === "string" ) {
		screenData.canvas.style.backgroundColor = bc.s;
	} else {
		console.error( "bgColor: invalid color value for parameter c." );
		return;
	}
}

// Set the background color of the container
qbs._.addCommand( "containerBgColor", containerBgColor, false, true, "both", "containerBgColor" );
function containerBgColor( screenData, args ) {
	var c, bc;

	c = args[ 0 ];

	if( screenData.container ) {
		if( Number.isInteger( c ) ) {
			bc = screenData.pal[ c ];
		} else {
			bc = qbs.util.convertToColor( c );
		}
		if( bc && typeof bc.s === "string" ) {
			screenData.container.style.backgroundColor = bc.s;
			return;
		} else {
			console.error( "containerBgColor: invalid color value for parameter c." );
			return;
		}
	}
}

qbs._.addCommand( "canvas", canvas, false, true, "both", "canvas" );
function canvas( screenData ) {
	return screenData.canvas;
}

qbs._.addCommand( "findColor", findColor, false, true, "both", "findColor" );
function findColor( screenData, args ) {
	var c, tolerance, i, pal, dr, dg, db, da, difference;

	c = args[ 0 ];
	tolerance = args[ 1 ];

	if(tolerance === undefined) {
		tolerance = 0;
	}

	pal = screenData.pal;

	if( screenData.cache[ "findColor" ][ c.s ] ) {
		return screenData.cache[ "findColor" ][ c.s ];
	}
	for( i = 0; i < pal.length; i++ ) {
		if(tolerance === 0 && pal[ i ].s === c.s) {
			screenData.cache[ "findColor" ][ c.s ] = i;
			return i;
		} else {
			dr = pal[ i ].r - c.r;
			dg = pal[ i ].g - c.g;
			db = pal[ i ].b - c.b;
			da = pal[ i ].a - c.a;

			difference = dr * dr + dg * dg + db * db + da * da;
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

qbs._.addCommand( "setPixelMode", setPixelMode, false, true, "both", "setPixelMode" );
function setPixelMode( screenData, args ) {
	var isEnabled;

	isEnabled = args[ 0 ];

	if( isEnabled ) {
		screenData.context.imageSmoothingEnabled = true;
		screenData.pixelMode = true;
		for( i in screenData.pixelCommands ) {
			screenData.commands[ i ] = screenData.pixelCommands[ i ];
		}
	} else {
		screenData.context.imageSmoothingEnabled = false;
		screenData.pixelMode = false;
		for( i in screenData.antiAliasCommands ) {
			screenData.commands[ i ] = screenData.antiAliasCommands[ i ];
		}
	}
}

qbs._.addCommand( "triggerEventListerners", triggerEventListeners, true, true, "both", "triggerEventListerners" );
function triggerEventListeners( screenData, args ) {
	var mode, data, listenerArr, temp, pos, i, j, newData;

	mode = args[ 0 ];
	data = args[ 1 ];
	listenerArr = args[ 2 ];

	if( listenerArr[ mode ] ) {
		// Make a temp copy so we don't get infinite loop if new event listener added here
		temp = listenerArr[ mode ].slice();

		// Loop through all the event listeners
		for( i = 0; i < temp.length; i++ ) {

			// If there is a hitbox then need to check if we are in range
			if( temp[ i ].hitBox ) {

				// Get the coordinates of the event
				pos = data.screens[ temp[ i ].hitBox.screen ];
				if( pos.touches ) {
					newData = {
						"touches": []
					};
					for( j in pos.touches ) {
						if( qbs.util.inRange( pos.touches[ j ], temp[ i ].hitBox ) ) {
							newData.touches.push( pos.touches[ j ] );
						}
					}
					if( newData.touches.length > 0 ) {
						temp[ i ].fn( newData );
					}
				} else {
					// Check if the event is in the hitBox
					if( qbs.util.inRange( pos, temp[ i ].hitBox ) ) {
						temp[ i ].fn( data );
					}
				}
			} else {
				// if no hit box then just trigger the event
				temp[ i ].fn( data );
			}
		}
	}
}

// End of File Encapsulation
} )();
