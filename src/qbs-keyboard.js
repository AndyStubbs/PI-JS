/*
* File: qbs-keyboard.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData, keys, keyLookup, keyCodes, preventKeys, inputs, inputIndex, t, promptInterval, blink,
promptBackground, promptBackgroundWidth, inputReadyList, onKeyEventListeners, anyKeyEventListeners;

qbData = qbs._.data;

keyLookup = {
	"Alt_1": "AltLeft",
	"Alt_2": "AltRight",
	"ArrowDown_0": "ArrowDown",
	"ArrowLeft_0": "ArrowLeft",
	"ArrowRight_0": "ArrowRight",
	"ArrowUp_0": "ArrowUp",
	"\\_0": "Backslash",
	"|_0": "Backslash",
	"~_0": "Backquote",
	"`_0": "Backquote",
	"Backspace_0": "Backspace",
	"[_0": "BracketLeft",
	"{_0": "BracketLeft",
	"]_0": "BracketRight",
	"}_0": "BracketRight",
	"CapsLock_0": "CapsLock",
	"ContextMenu_0": "ContextMenu",
	"Control_1": "ControlLeft",
	"Control_2": "ControlRight",
	",_0": "Comma",
	"<_0": "Comma",
	"Delete_0": "Delete",
	")_0": "Digit0",
	"0_0": "Digit0",
	"1_0": "Digit1",
	"!_0": "Digit1",
	"2_0": "Digit2",
	"@_0": "Digit2",
	"3_0": "Digit3",
	"#_0": "Digit3",
	"4_0": "Digit4",
	"$_0": "Digit4",
	"5_0": "Digit5",
	"%_0": "Digit5",
	"6_0": "Digit6",
	"^_0": "Digit6",
	"7_0": "Digit7",
	"&_0": "Digit7",
	"8_0": "Digit8",
	"*_0": "Digit8",
	"9_0": "Digit9",
	"(_0": "Digit9",
	"End_0": "End",
	"Enter_0": "Enter",
	"+_0": "Equal",
	"=_0": "Equal",
	"Escape_0": "Escape",
	"F1_0": "F1",
	"F2_0": "F2",
	"F3_0": "F3",
	"F4_0": "F4",
	"F5_0": "F5",
	"F6_0": "F6",
	"F7_0": "F7",
	"F8_0": "F8",
	"F9_0": "F9",
	"F10_0": "F10",
	"F11_0": "F11",
	"F12_0": "F12",
	"Home_0": "Home",
	"Insert_0": "Insert",
	"a_0": "KeyA",
	"A_0": "KeyA",
	"b_0": "KeyB",
	"B_0": "KeyB",
	"c_0": "KeyC",
	"C_0": "KeyC",
	"d_0": "KeyD",
	"D_0": "KeyD",
	"e_0": "KeyE",
	"E_0": "KeyE",
	"f_0": "KeyF",
	"F_0": "KeyF",
	"g_0": "KeyG",
	"G_0": "KeyG",
	"h_0": "KeyH",
	"H_0": "KeyH",
	"i_0": "KeyI",
	"I_0": "KeyI",
	"j_0": "KeyJ",
	"J_0": "KeyJ",
	"k_0": "KeyK",
	"K_0": "KeyK",
	"l_0": "KeyL",
	"L_0": "KeyL",
	"m_0": "KeyM",
	"M_0": "KeyM",
	"n_0": "KeyN",
	"N_0": "KeyN",
	"o_0": "KeyO",
	"O_0": "KeyO",
	"p_0": "KeyP",
	"P_0": "KeyP",
	"q_0": "KeyQ",
	"Q_0": "KeyQ",
	"r_0": "KeyR",
	"R_0": "KeyR",
	"S_0": "KeyS",
	"s_0": "KeyS",
	"t_0": "KeyT",
	"T_0": "KeyT",
	"u_0": "KeyU",
	"U_0": "KeyU",
	"v_0": "KeyV",
	"V_0": "KeyV",
	"w_0": "KeyW",
	"W_0": "KeyW",
	"x_0": "KeyX",
	"X_0": "KeyX",
	"y_0": "KeyY",
	"Y_0": "KeyY",
	"z_0": "KeyZ",
	"Z_0": "KeyZ",
	"Meta_1": "MetaLeft",
	"Meta_2": "MetaRight",
	"__0": "Minus",
	"-_0": "Minus",
	"NumLock_0": "NumLock",
	"0_3": "Numpad0",
	"Insert_3": "Numpad0",
	"1_3": "Numpad1",
	"End_3": "Numpad1",
	"2_3": "Numpad2",
	"ArrowDown_3": "Numpad2",
	"3_3": "Numpad3",
	"PageDown_3": "Numpad3",
	"4_3": "Numpad4",
	"ArrowLeft_3": "Numpad4",
	"5_3": "Numpad5",
	"Clear_3": "Numpad5",
	"6_3": "Numpad6",
	"ArrowRight_3": "Numpad6",
	"7_3": "Numpad7",
	"Home_3": "Numpad7",
	"8_3": "Numpad8",
	"ArrowUp_3": "Numpad8",
	"9_3": "Numpad9",
	"PageUp_3": "Numpad9",
	"+_3": "NumpadAdd",
	"._3": "NumpadDecimal",
	"Delete_3": "NumpadDecimal",
	"/_3": "NumpadDivide",
	"Enter_3": "NumpadEnter",
	"*_3": "NumpadMultiply",
	"-_3": "NumpadSubtract",
	"PageDown_0": "PageDown",
	"PageUp_0": "PageUp",
	"Cancel_0": "Pause",
	"Pause_0": "Pause",
	"._0": "Period",
	">_0": "Period",
	"PrintScreen_0": "PrintScreen",
	"'_0": "Quote",
	"\"_0": "Quote",
	"ScrollLock_0": "ScrollLock",
	";_0": "Semicolon",
	":_0": "Semicolon",
	"Shift_1": "ShiftLeft",
	"Shift_2": "ShiftRight",
	"/_0": "Slash",
	"?_0": "Slash",
	" _0": "Space",
	"Tab_0": "Tab"
};
keys = {};
keyCodes = {};
preventKeys = {};
inputs = [];
inputIndex = 0;
inputReadyList = [];
onKeyEventListeners = {};
anyKeyEventListeners = [];

// Key up event - document event
document.addEventListener( "keyup", keyup );
function keyup( e ) {
	var key;

	// Lookup the key by using key and location
	key = keyLookup[ e.key + "_" + e.location ];

	// Reset the keys - no longer pressed
	keys[ key ] = 0;
	keyCodes[ e.keyCode ] = 0;

	// If a key is registered then prevent the default behavior
	if( preventKeys[ key ] || preventKeys[ e.keyCode ] ) {
		e.preventDefault();
		e.stopPropagation();
	}
}

// Key down - document event
document.addEventListener( "keydown", keydown );
function keydown( e ) {
	var key, keyVal, input, removeLastChar, i, temp;

	// If we are collecting any inputs
	if( inputs.length > 0 ) {
		removeLastChar = false;
		input = inputs[ inputIndex ];
		if( e.keyCode === 13 ) {
			
			// The enter key was pressed
			showPrompt( true );
			$.print( "" );
			triggerReady( input );
			inputIndex += 1;
			if( inputIndex >= inputs.length ) {
				closeInputs();
			}
		} else if( e.keyCode === 8 ) {
			// The backspace key was pressed
			if( input.val.length > 0 ) {
				removeLastChar = true;
			}
		} else if( e.key && e.key.length === 1 ) {
			// A character key was pressed
			input.val += e.key;

			// Return if character is not a digit
			if( input.isNumber ) {
				if( isNaN( Number( input.val ) ) ) {
					removeLastChar = true;
				} else if( input.max && Number( input.val ) > input.max ) {
					removeLastChar = true;
				} else if( input.min && Number( input.val ) < input.min ) {
					removeLastChar = true;
				} else if( input.isInteger && e.key === "." ) {
					removeLastChar = true;
				}
			}
		}
		// Remove one character from the end of the string
		if( removeLastChar ) {
			input.val = input.val.substring( 0, input.val.length - 1 );
		}
		return;
	}

	// Lookup the key
	key = keyLookup[ e.key + "_" + e.location ];
	keyVal = {
		"key": e.key,
		"location": e.location,
		"code": key,
		"keyCode": e.keyCode
	};
	keys[ key ] = keyVal;
	keyCodes[ e.keyCode ] = keyVal;

	// Prevent default behavior
	if( preventKeys[ key ] || preventKeys[ e.keyCode ] ) {
		e.preventDefault();
		e.stopPropagation();
	}

	// trigger on key events
	if( onKeyEventListeners[ key ] ) {
		temp = onKeyEventListeners[ key ].slice();
		for( i = 0; i < temp.length; i++ ) {
			temp[ i ]( keyVal );
		}
	}

	// trigger any key events
	if( anyKeyEventListeners.length > 0 ) {
		temp = anyKeyEventListeners.slice();
		for( i = 0; i < temp.length; i++ ) {
			temp[ i ]( keyVal );
		}
	}
}

// Clear all keypresses in case we lose focus
window.addEventListener( "blur", clearKeys );
function clearKeys() {
	var i;
	for( i in keys ) {
		keys[ i ] = 0;
	}
	for( i in keyCodes ) {
		keyCodes[ i ] = 0;
	}
}

// Gets the status of a specific key or all keys currently pressed
qbs._.addCommand( "inkey", inkey, false, false );
function inkey( args ) {
	var key, keysReturn, i, keys2;

	key = args[ 0 ];

	// If the key is a number then lookup using keyCodes instead
	if( ! isNaN( key ) ) {
		keys2 = keyCodes;
	} else {
		keys2 = keys;
	}

	// If the key is provided then return the key status
	if( key !== undefined ) {
		return keys2[ key ];
	}

	// If no key is provided then return all keys pressed status
	keysReturn = {};
	for( i in keys ) {
		if( keys[ i ] ) {
			keysReturn[ i ] = keys[ i ];
		}
	}
	return keysReturn;
}

// Adds an event trigger for a keypress
qbs._.addCommand( "onkey", onkey, false, false );
function onkey( args ) {
	var key, fn, once;

	key = args[ 0 ];
	fn = args[ 1 ];
	once = args[ 2 ];

	// Prevent key from being triggered in case onkey is called in a keydown event
	setTimeout( function () {
		var tempFn;

		// Validate parameters
		if( ! isNaN( key ) && typeof key !== "string" ) {
			console.error( "onkey: key needs to be either an interger keyCode or a string key name." );
			return;
		}
		if( ! qbs.util.isFunction( fn ) ) {
			console.error( "onkey: fn is not a valid function." );
			return;
		}

		// If it's a one time function
		if( once ) {
			tempFn = fn;
			fn = function () {
				offkey( key, fn );
				tempFn();
			};
		}

		// Check for the infamous "any" key
		if( typeof key === "string" && key.toLowerCase() === "any" ) {
			anyKeyEventListeners.push( fn );
		} else {
			if( ! onKeyEventListeners[ key ] ) {
				onKeyEventListeners[ key ] = [];
			}
			onKeyEventListeners[ key ].push( fn );
		}
	}, 1 );
}

// Removes an event trigger for a keypress
qbs._.addCommand( "offkey", offkey, false, false );
function offkey( args ) {
	var key, fn, isClear, i;

	key = args[ 0 ];
	fn = args[ 1 ];

	// Validate parameters
	if( ! isNaN( key ) && typeof key !== "string" ) {
		console.error( "offkey: key needs to be either an interger keyCode or a string." );
		return;
	}
	if( ! qbs.util.isFunction( fn ) && fn !== undefined ) {
		console.error( "offkey: fn is not a valid function.  Leave this undefined or set it to a function." );
		return;
	}

	isClear = false;
	if( ! qbs.util.isFunction( fn ) ) {
		isClear = true;
	}

	if( typeof key === "string" && key.toLowerCase() === "any" ) {
		if( isClear ) {
			anyKeyEventListeners = [];
		} else {
			for( i = anyKeyEventListeners.length - 1; i >= 0; i-- ) {
				if( anyKeyEventListeners[ i ] === fn ) {
					anyKeyEventListeners.splice( i, 1 );
				}
			}
		}
	} else {
		if( onKeyEventListeners[ key ] ) {
			if( isClear ) {
				onKeyEventListeners[ key ] = [];
			} else {
				for( i = onKeyEventListeners[ key ].length - 1; i >= 0; i-- ) {
					if( onKeyEventListeners[ key ][ i ] === fn ) {
						onKeyEventListeners[ key ].splice( i, 1 );
					}
				}
			}
		}
	}
}

// Disables the default behavior for a key
// TODO: rename this command
qbs._.addCommand( "disableDefaultKey", disableDefaultKey, false, false );
function disableDefaultKey( args ) {
	var key;

	key = args[ 0 ];

	if( typeof key !== "string" && isNaN( key ) ) {
		console.error( "disableDefaultKey: invalid key parameter." );
		return;
	}
	preventKeys[ key ] = true;
}

// Enables the default behavior for a key
// TODO: rename this command
qbs._.addCommand( "enableDefaultKey", enableDefaultKey, false, false );
function enableDefaultKey( key ) {
	if( typeof key !== "string" && isNaN( key ) ) {
		console.error( "disableDefaultKey: invalid key parameter." );
		return;
	}
	delete preventKeys[ key ];
}

// Shows the prompt for the input command
function showPrompt( hideCursor ) {
	var msg, pos, dt, posPx, width, height, input, screenData;

	// If we are collecting any inputs
	if( inputs.length > 0 && inputIndex < inputs.length ) {
		input = inputs[ inputIndex ];
		msg = input.prompt + input.val;
		screenData = qbData.commands.getScreenData( null, "input" );
		if( ! screenData ) {
			return null;
		}

		// Blink cursor every half second
		dt = ( new Date() ).getTime() - t;
		if( dt > 500 ) {
			blink = ! blink;
			t = ( new Date() ).getTime();
		}

		if( blink && ! hideCursor ) {
			msg += String.fromCharCode( screenData.printCursor.prompt );
		}

		// Get the background pixels
		posPx = $.posPx();
		width = ( msg.length + 1 ) * screenData.printCursor.charWidth;
		height = screenData.printCursor.charHeight;

		// If there is no background
		if( ! promptBackground ) {
			promptBackground = $.get( posPx.x, posPx.y, posPx.x + width, posPx.y + height );
		} else if( promptBackgroundWidth < width ) {
			// We have a background but we need a bigger background
			$.put( promptBackground, posPx.x, posPx.y );
			promptBackground = $.get( posPx.x, posPx.y, posPx.x + width, posPx.y + height );
		} else {
			// Else redraw the background
			$.put( promptBackground, posPx.x, posPx.y );
		}

		// Store the background width for later use
		promptBackgroundWidth = width;

		// Print the prompt
		pos = $.pos();
		$.print( msg, true );
		$.locate( pos.col, pos.row );
		$.render();
	} else {
		// There are no inputs then stop the interval and clear prompt data
		clearInterval( promptInterval );
		promptBackground = null;
		promptBackgroundWidth = 0;
	}
}

// Prompts the user to enter input through the keyboard.
qbs._.addCommand( "input", input, false, false );
function input( args ) {
	var prompt, name, isNumber, min, max, isInteger, ready, readyList;
	//prompt, name, isNumber, min, max, isInteger

	prompt = args[ 0 ];
	name = args[ 1 ];
	isNumber = args[ 2 ];
	min = args[ 3 ];
	max = args[ 4 ];
	isInteger = args[ 5 ];
	ready = args[ 6 ];
	readyList = args[ 7 ];

	if( typeof prompt !== "string" ) {
		console.error( "input: prompt is required and must be a string." );
		return;
	}
	if( typeof name !== "string" && name !== undefined ) {
		console.error( "input: name must be a string or left blank." );
	}

	// Convert params to boolean
	isNumber = qbs.util.sanitizeBool( isNumber );
	isInteger = qbs.util.sanitizeBool( isInteger );

	// Create a list of functions to trigger
	readyList = [];

	// This is a register event function
	ready = {
		"ready": function ( fn ) {
			if( qbs.util.isFunction( fn ) ) {
				readyList.push( fn );
			}
		}
	};

	// If no name is provided then lets create one
	if( ! name ) {
		name = "input_" + inputs.length;
	}
	if( isNaN( Number( min ) ) ) {
		min = null;
	} else {
		min = Number( min );
	}
	if( isNaN( Number( max ) ) ) {
		max = null;
	} else {
		max = Number( max );
	}
	inputs.push( {
		"prompt": prompt,
		"name": name,
		"isNumber": isNumber,
		"isInteger": isInteger,
		"min": min,
		"max": max,
		"val": "",
		"readyList": readyList
	} );
	t = ( new Date() ).getTime();
	promptInterval = setInterval( showPrompt, 100 );
	return ready;
}

// Triggers the ready functions once the enter key has been pressed in input
function triggerReady( input ) {
	var i, temp;
	processInput( input );
	temp = input.readyList.slice();
	for( i = 0; i < temp.length; i++ ) {
		temp[ i ]( input.val );
	}
}

// Process the input for numbers and if a number makes sure it meets the requirements
function processInput( input ) {
	if( input.isNumber ) {
		if( input.val === "" ) {
			if( ! isNaN( input.min ) ) {
				input.val = input.min;
			} else {
				input.val = 0;
			}
		} else {
			input.val = Number( input.val );
		}
	}
}

// If the last of the inputs then close out and trigger all ready functions
function closeInputs() {
	var data, i, input, temp;
	data = {};

	// Loop through all inputs and process the values
	for( i = 0; i < inputs.length; i++ ) {
		input = inputs[ i ];
		processInput( input );
		data[ input.name ] = input.val;
	}
	inputs = [];
	inputIndex = 0;

	// Make a copy of the input ready list for triggering ready functions
	temp = inputReadyList.slice();

	// Reset the input ready list in case new inputs are created while triggering ready functions
	inputReadyList = [];
	for( i = 0; i < temp.length; i++ ) {
		temp[ i ]( data );
	}
}

// Register function for when input is ready
qbs._.addCommand( "inputReady", inputReady, false, false );
function inputReady( args ) {
	var fn;

	fn = args[ 0 ];

	if( qbs.util.isFunction( fn ) ) {
		inputReadyList.push( fn );
	}
}

// Set the charcode for the input prompt
qbs._.addCommand( "setInputCursor", setInputCursor, false, false );
function setInputCursor( args ) {
	var c;

	c = args[ 0 ];

	if( ! isNaN( c ) ) {
		qbData.screenData.printCursor.prompt = c;
	} else if( typeof c === "string" ) {
		qbData.screenData.printCursor.prompt = c.charCodeAt( 0 );
	}
}

// End of File Encapsulation
} )();
