/*
* File: qbs-screenCommands.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_qbData;

m_qbData = qbs._.data;

// Remove the screen from the page and memory
qbs._.addCommand( "removeScreen", removeScreen, false, true, [] );
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
	delete m_qbData.screens[ screenId ];

}

// Set the background color of the canvas
qbs._.addCommand( "setBgColor", setBgColor, false, true, [ "color" ] );
qbs._.addSetting( "bgColor", setBgColor, true, [ "color" ] );
function setBgColor( screenData, args ) {
	var color, bc;

	color = args[ 0 ];

	if( qbs.util.isInteger( color ) ) {
		bc = screenData.pal[ color ];
	} else {
		bc = qbs.util.convertToColor( color );
	}
	if( bc && typeof bc.s === "string" ) {
		screenData.canvas.style.backgroundColor = bc.s;
	} else {
		console.error( "bgColor: invalid color value for parameter c." );
		return;
	}
}

// Set the background color of the container
qbs._.addCommand( "setContainerBgColor", setContainerBgColor, false, true,
	[ "color" ]
);
qbs._.addSetting( "containerBgColor", setContainerBgColor, true,
	[ "color" ]
);
function setContainerBgColor( screenData, args ) {
	var color, bc;

	color = args[ 0 ];

	if( screenData.container ) {
		if( qbs.util.isInteger( color ) ) {
			bc = screenData.pal[ color ];
		} else {
			bc = qbs.util.convertToColor( color );
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

qbs._.addCommand( "width", width, false, true, [] );
function width( screenData ) {
	return screenData.width;
}

qbs._.addCommand( "height", height, false, true, [] );
function height( screenData ) {
	return screenData.height;
}

qbs._.addCommand( "canvas", canvas, false, true, [] );
function canvas( screenData ) {
	return screenData.canvas;
}

// Finds a color from the palette and returns it's index.
qbs._.addCommand( "findColor", findColor, false, true,
	[ "color", "tolerance", "isAddToPalette" ] );
function findColor( screenData, args ) {
	var color, tolerance, isAddToPalette, i, pal, dr, dg, db, da, difference;

	color = args[ 0 ];
	tolerance = args[ 1 ];
	isAddToPalette = !!( args[ 2 ] );

	if(tolerance === undefined) {
		tolerance = 0;
	}

	pal = screenData.pal;

	if( screenData.cache[ "findColor" ][ color.s ] ) {
		return screenData.cache[ "findColor" ][ color.s ];
	}

	for( i = 0; i < pal.length; i++ ) {
		if(tolerance === 0 && pal[ i ].s === color.s) {
			screenData.cache[ "findColor" ][ color.s ] = i;
			return i;
		} else {
			dr = pal[ i ].r - color.r;
			dg = pal[ i ].g - color.g;
			db = pal[ i ].b - color.b;
			da = pal[ i ].a - color.a;

			difference = dr * dr + dg * dg + db * db + da * da;
			if(difference <= tolerance) {
				screenData.cache[ "findColor" ][ color.s ] = i;
				return i;
			}
		}
	}
	if( isAddToPalette ) {
		pal.push( color );
		screenData.cache[ "findColor" ][ color.s ] = pal.length - 1;
		return pal.length - 1;
	}
	return false;
}

qbs._.addCommand( "setPixelMode", setPixelMode, false, true, [ "isEnabled" ] );
qbs._.addSetting( "pixelMode", setPixelMode, true, [ "isEnabled" ] );
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

qbs._.addCommand( "triggerEventListeners", triggerEventListeners, true, true,
	[] );
function triggerEventListeners( mode, data, listenerArr, clickStatus ) {
	var temp, i, j, pos, newData, isHit;

	if( listenerArr[ mode ] ) {

		// Make a temp copy so we don't get infinite loop if new event listener
		// added here
		temp = listenerArr[ mode ].slice();

		// Loop through all the event listeners
		for( i = 0; i < temp.length; i++ ) {

			// If click up but no click down then skip this
			if( clickStatus === "up" ) {
				if( ! temp[ i ].clickDown ) {
					continue;
				}
			}

			// If there is a hitbox then need to check if we are in range
			if( temp[ i ].hitBox ) {

				isHit = false;

				// If it's an array loop - touches
				if( qbs.util.isArray ( data ) ) {
					newData = [];
					for( j = 0; j < data.length; j++ ) {
						pos = data[ j ];
						if( qbs.util.inRange( pos, temp[ i ].hitBox ) ) {
							newData.push( pos );
						}
					}
					if( newData.length > 0 ) {
						isHit = true;
					}
				} else {
					newData = data;

					// If it's not an array
					if( qbs.util.inRange( data, temp[ i ].hitBox ) ) {
						isHit = true;
					}
				}

				if( isHit ) {

					// If click don't trigger event listener on down
					if( clickStatus === "down" ) {
						temp[ i ].clickDown = true;
					} else {
						temp[ i ].clickDown = false;
						temp[ i ].fn( newData );
					}
				}

			} else {
				// if no hit box then just trigger the event
				temp[ i ].fn( data );
			}
		}
	}
}

qbs._.addCommand( "onevent", onevent, true, true, [] );
function onevent( mode, fn, once, hitBox, modes, name, listenerArr, extraId,
	extraData
) {

	var i, modeFound;

	// Make sure mode is valid
	modeFound = false;

	for( i = 0; i < modes.length; i++ ) {
		if( mode === modes[ i ] ) {
			modeFound = true;
			break;
		}
	}
	if( ! modeFound ) {
		console.error(
			name + ": mode needs to be on of the following " +
			modes.join( ", " ) + "."
		);
		return false;
	}

	// Make sure once is a boolean
	once = !!( once );

	// Make sure function is valid
	if( ! qbs.util.isFunction( fn ) ) {
		console.error( name + ": fn is not a valid function." );
		return false;
	}

	// Validate hitbox
	if( hitBox ) {
		if(
			! qbs.util.isInteger( hitBox.x ) ||
			! qbs.util.isInteger( hitBox.y ) ||
			! qbs.util.isInteger( hitBox.width ) ||
			! qbs.util.isInteger( hitBox.height )
		) {
			console.error(
				name + ": hitbox must have properties x, y, width, and " +
				"height whose values are integers."
			);
			return false;
		}
	}

	// Prevent event from being triggered in case event is called in an event
	setTimeout( function () {
		var tempFn, newMode;

		// Add extraId to mode
		if( typeof extraId === "string" ) {
			newMode = mode + extraId;
		} else {
			newMode = mode;
		}

		// If it's a one time function
		if( once ) {
			tempFn = fn;
			fn = function ( data ) {
				offevent( mode, fn, modes, name, listenerArr, extraId );
				tempFn( data );
			};
		}

		if( ! listenerArr[ newMode ] ) {
			listenerArr[ newMode ] = [];
		}
		listenerArr[ newMode ].push( {
			"fn": fn,
			"hitBox": hitBox,
			"extraData": extraData,
			"clickDown": false
		} );

	}, 1 );

	return true;
}

qbs._.addCommand( "offevent", offevent, true, true, [] );
function offevent( mode, fn, modes, name, listenerArr, extraId ) {

	var isClear, i, modeFound;

	// Make sure mode is valid
	modeFound = false;
	for( i = 0; i < modes.length; i++ ) {
		if( mode === modes[ i ] ) {
			modeFound = true;
			break;
		}
	}
	if( ! modeFound ) {
		console.error( name + ": mode needs to be on of the following " +
			modes.join( ", " ) + ".");
		return false;
	}

	// Add extraId to mode
	if( typeof extraId === "string" ) {
		mode += extraId;
	}

	// Validate fn
	if( fn == null ) {
		isClear = true;
	} else {
		isClear = false;
		if( ! qbs.util.isFunction( fn ) ) {
			console.error( name + ": fn is not a valid function." );
			return false;
		}
	}

	if( listenerArr[ mode ] ) {
		if( isClear ) {
			delete listenerArr[ mode ];
		} else {
			for( i = listenerArr[ mode ].length - 1; i >= 0; i-- ) {
				if( listenerArr[ mode ][ i ].fn === fn ) {
					listenerArr[ mode ].splice( i, 1 );
				}
				if( listenerArr[ mode ].length === 0 ) {
					delete listenerArr[ mode ];
				}
			}
		}
		return true;
	}
}

qbs._.addCommand( "setAutoRender", setAutoRender, false, true,
	[ "isAutoRender" ] );
function setAutoRender( screenData, args ) {
	var isAutoRender;

	isAutoRender = args[ 0 ];
	screenData.isAutoRender = !!( isAutoRender );

	if( screenData.isAutoRender ) {
		screenData.screenObj.render();
	}
}

// End of File Encapsulation
} )();
