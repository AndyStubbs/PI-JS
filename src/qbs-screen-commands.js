/*
* File: qbs-screenCommands.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

// Remove the screen from the page and memory
qbs._.addCommand( "removeScreen", removeScreen, false, true );
function removeScreen( screenData ) {
	var i, screenId;

	screenId = screenData.id;

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

// Set the background color of the canvas
qbs._.addCommand( "bgColor", bgColor, false, true );
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
qbs._.addCommand( "containerBgColor", containerBgColor, false, true );
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

qbs._.addCommand( "canvas", canvas, false, true );
function canvas( screenData ) {
	return screenData.canvas;
}

qbs._.addCommand( "findColor", findColor, false, true );
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

qbs._.addCommand( "setPixelMode", setPixelMode, false, true );
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

qbs._.addCommand( "triggerEventListeners", triggerEventListeners, true, true );
function triggerEventListeners( mode, data, listenerArr ) {
	var temp, pos, i, j, newData;

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

qbs._.addCommand( "onevent", onevent, true, true );
function onevent( mode, fn, once, hitBox, mode1, mode2, mode3, name, offevent, listenerArr ) {

	// Prevent event from being triggered in case event is called in an event
	setTimeout( function () {
		var tempFn;

		// Validate parameters
		if( mode !== mode1 && mode !== mode2 && mode !== mode3 ) {
			console.error( name + ": mode needs to be either up, down, or move.");
			return;
		}
		if( ! qbs.util.isFunction( fn ) ) {
			console.error( name + ": fn is not a valid function." );
			return;
		}

		// If it's a one time function
		if( once ) {
			tempFn = fn;
			fn = function ( data ) {
				offevent( mode, fn );
				tempFn( data );
			};
		}

		if( ( hitBox && isNaN( hitBox.screen ) ) || ( hitBox && ! qbData.screens[ hitBox.screen ] ) ) {
			hitBox.screen = qbData.screenData.id;
		}
		if( ! listenerArr[ mode ] ) {
			listenerArr[ mode ] = [];
		}
		listenerArr[ mode ].push( {
			"fn": fn,
			"hitBox": hitBox
		} );

	}, 1);
}

qbs._.addCommand( "onevent", offevent, true, true );
function offevent( mode, fn, mode1, mode2, mode3, name, listenerArr ) {
	var isClear, i;

	// Validate parameters
	if( mode !== mode1 && mode !== mode2 && mode !== mode3 ) {
		console.error( name + ": mode needs to be either up, down, or move.");
		return;
	}
	if( ! qbs.util.isFunction( fn ) ) {
		console.error( name + ": fn is not a valid function." );
		return;
	}

	isClear = false;
	if( ! qbs.util.isFunction( fn ) ) {
		isClear = true;
	}

	if( listenerArr[ mode ] ) {
		if( isClear ) {
			listenerArr[ mode ] = [];
		} else {
			for( i = listenerArr[ mode ].length - 1; i >= 0; i-- ) {
				if( listenerArr[ mode ][ i ] === fn ) {
					listenerArr[ mode ].splice( i, 1 );
				}
			}
		}
	}
}

// End of File Encapsulation
} )();
