/*
* File: qbs-gamepad.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var g_qbData, g_Controllers, g_ControllerArr, g_Events, g_GamepadLoopId, g_Modes, g_IsLooping, g_LoopInterval, g_axesSensitivity;

g_qbData = qbs._.data;

// Object to track all controller data
g_Controllers = {};

// An array to return to user of all the controllers
// This is used instead of the object because an array is easier to loop through
g_ControllerArr = [];

// The event listener object
g_Events = {};
g_Modes = [
	"connect",
	"disconnect",
	"axis",
	"pressed",
	"touched",
	"pressReleased",
	"touchReleased"
];
g_IsLooping = false;
g_LoopInterval = 8;
g_axesSensitivity = 0.01;

window.addEventListener( "gamepadconnected", gamepadConnected );
window.addEventListener( "gamepaddisconnected", gamepadDisconnected );

function gamepadConnected( e ) {
	g_Controllers[ e.gamepad.index ] = e.gamepad;
	e.gamepad.controllerIndex = g_ControllerArr.length;
	g_ControllerArr.push( e.gamepad );
}

function gamepadDisconnected( e ) {
	g_ControllerArr.splice( g_Controllers[ e.gamepad.index ].controllerIndex, 1 );
	delete g_Controllers[ e.gamepad.index ];
}

qbs._.addCommand( "stopGamepads", stopGamepads, false, false, [] );
function stopGamepads() {
	g_Events = {};
	g_Controllers = {};
	g_ControllerArr = [];
	cancelAnimationFrame( g_GamepadLoopId );
}

qbs._.addCommand( "ingamepads", ingamepads, false, false, [ "gamePad" ] );
function ingamepads( args ) {
	if( g_Controllers ) {
		updateControllers();
	}
	return g_ControllerArr;
}

qbs._.addCommand( "ongamepad", ongamepad, false, false, [ "gamepadIndex", "mode", "item", "fn", "once" ] );
function ongamepad( args ) {
	var mode, item, fn, gamepadIndex, extraData, once;

	gamepadIndex = args[ 0 ];
	mode = args[ 1 ];
	item = args[ 2 ];
	fn = args[ 3 ];
	once = !!args[ 4 ];

	extraData = getExtraData( "ongamepad", item, gamepadIndex, mode );
	if( ! extraData ) {
		return;
	}
	extraData.mode = mode;

	// Add the event listener
	g_qbData.commands.onevent( mode, fn, once, false, g_Modes, "ongamepad", g_Events, extraData.extraId, extraData );

	// Start the loop if it isn't already started
	if( ! g_IsLooping ) {
		//g_GamepadLoopId = setInterval( gamepadLoop, g_LoopInterval );
		g_GamepadLoopId = requestAnimationFrame( gamepadLoop );
	}

}

qbs._.addCommand( "offgamepad", offgamepad, false, false, [ "gamepadIndex", "mode", "item", "fn" ] );
function offgamepad( args ) {
	var mode, item, gamepadIndex, fn, extraData;

	gamepadIndex = args[ 0 ];
	mode = args[ 1 ];
	item = args[ 2 ];
	fn = args[ 3 ];

	extraData = getExtraData( "offgamepad", item, gamepadIndex, mode );
	if( ! extraData ) {
		return;
	}

	// Remove the event listener
	g_qbData.commands.offevent( mode, fn, g_Modes, "offgamepad", g_Events, extraData.extraId );
}

function getExtraData( name, items, gamepadIndex, mode ) {
	var extraId, i;

	// Validate gamepadIndex
	gamepadIndex = parseInt( gamepadIndex );
	if( isNaN( gamepadIndex ) || gamepadIndex < 0 ) {
		console.error( name + ": gamepadIndex is not a valid index number." );
		return;
	}

	// Validate buttons
	if( mode === "connect" || mode === "disconnect" ) {
		items = null;
	} else if ( mode === "axis" ) { 
		if( ! qbs.util.isInteger( items ) || items < 0 ) {
			console.error( name + ": items is not a valid axis index." );
			return;
		}
		items = [ items ];
	} else {
		if( typeof items === "string" && items.toLowerCase() === "any" ) {
			items = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];
		} else if( ! isNaN( parseInt( items ) ) && items >= 0 ) {
			items = [ items ];
		}
		if( ! qbs.util.isArray( items ) ) {
			console.error( name + ": items is not a valid array." );
			return;
		}
		for( i = 0; i < items.length; i++ ) {
			items[ i ] = parseInt( items[ i ] );
			if( isNaN( items[ i ] ) || items[ i ] < 0 ) {
				console.error( name + ": items contains an invalid button index." );
				return;
			}
			items.sort( function ( a, b ) { return a - b; } );
		}
	}

	extraId = "_" + gamepadIndex + ":" + items.join( "_" );

	return {
		"items": items,
		"gamepadIndex": gamepadIndex,
		"extraId": extraId
	};
}

function gamepadLoop() {
	g_IsLooping = true;

	if( ! g_Controllers ) {
		return;
	}

	updateControllers();
	triggerEvents();

	g_GamepadLoopId = requestAnimationFrame( gamepadLoop );
}

function triggerEvents() {
	var eventName, temp, gamepadIndex, items, mode, event, i;

	// Loop through all the events
	for( eventName in g_Events ) {
		temp = g_Events[ eventName ].slice();
		for( i = 0; i < temp.length; i++ ) {

			event = temp[ i ];
			mode = event.extraData.mode;

			// These events will not get triggered here
			if( mode === "connect" || mode === "disconnect" ) {
				continue;
			}

			gamepadIndex = event.extraData.gamepadIndex;

			// Make sure gamepad exists
			if( gamepadIndex >= g_ControllerArr.length ) {
				continue;
			}

			items = event.extraData.items;

			if( mode === "axis" ) {
				triggerAxes( gamepadIndex, items[ 0 ], eventName );
			} else {
				triggerButtons( gamepadIndex, items, mode, eventName );
			}

		} // end loop through event items
	} // end loop through events
}

function triggerAxes( gamepadIndex, axis, eventName ) {
	var axes;

	// Get reference to the axes in the gamepad
	axes = g_ControllerArr[ gamepadIndex ].axes;

	if( axes.length > axis ) {
		if( axes[ axis ] > g_axesSensitivity || axes[ axis ] < -g_axesSensitivity ) {
			g_qbData.commands.triggerEventListeners( eventName, axes[ axis ], g_Events );
		}
	}

}

function triggerButtons( gamepadIndex, items, mode, eventName ) {
	var buttons, i, button;

	// Get reference to the buttons in the gamepad
	buttons = g_ControllerArr[ gamepadIndex ].buttons;

	// Loop through all the mapped buttons
	for( i = 0; i < items.length; i++ ) {
		button = buttons[ items[ i ] ];

		// If any of the buttons are pressed then we trigger the event listeners then break to the next event
		if( button ) {
			button.index = items[ i ];
			if( button.pressed && mode === "pressed" ) {
				g_qbData.commands.triggerEventListeners( eventName, button, g_Events );
				break;
			} else if( button.touched && mode === "touched" ) {
				g_qbData.commands.triggerEventListeners( eventName, button, g_Events );
				break;
			} else if( button.pressReleased && mode === "pressReleased" ) {
				g_qbData.commands.triggerEventListeners( eventName, button, g_Events );
				break;
			} else if( button.touchReleased && mode === "touchReleased" ) {
				g_qbData.commands.triggerEventListeners( eventName, button, g_Events );
				break;
			}
		}
	}
}

function updateControllers() {
	var i, j, gamepads, controllerIndex, button1, button2;
	
	if( "getGamepads" in navigator ) {
		gamepads = navigator.getGamepads();
	} else if ( "webkitGetGamepads" in navigator ) {
		gamepads = navigator.webkitGetGamepads();
	} else {
		gamepads = [];
	}

	for( i = 0; i < gamepads.length; i++ ) {
		if( gamepads[ i ] && gamepads[ i ].index in g_Controllers ) {

			// Get the index of the controller in the controller array
			controllerIndex = g_Controllers[ gamepads[ i ].index ].controllerIndex;
			gamepads[ i ].controllerIndex = controllerIndex;

			// Update pressReleased and touchReleased for all buttons
			for( j = 0; j < g_Controllers[ gamepads[ i ].index ].buttons.length; j++ ) {
				button1 = g_Controllers[ gamepads[ i ].index ].buttons[ j ];
				button2 = gamepads[ i ].buttons[ j ];
				if( button1.pressed && ! button2.pressed ) {
					button2.pressReleased = true;
				} else {
					button2.pressReleased = false;
				}
				if( button1.touched && ! button2.touched ) {
					button2.touchReleased = true;
				} else {
					button2.touchReleased = false;
				}
			}

			// Update the controller object
			g_Controllers[ gamepads[ i ].index ] = gamepads[ i ];

			// Update the controller array
			g_ControllerArr[ controllerIndex ] = gamepads[ i ];
		}
	}
}

// End of File Encapsulation
} )();
