/*
* File: qbs-keyboard.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData, keys, keyLookup, keyCodes, preventKeys, inputs, inputIndex, t,
	promptInterval, blink, promptBackground, promptBackgroundWidth,
	inputReadyList, onKeyEventListeners, anyKeyEventListeners, keyboard;

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
keyboard = {
	"qwerty": "" + 
		"`1234567890-={Backspace}\n" +
		"{Tab}qwertyuiop[]\\\n" +
		"asdfghjkl;'{Enter}\n" +
		"{Shift}zxcvbnm,./{Shift}\n" +
		"{Space}",
	"gap": 1,
	"symbols": {
		"Backspace": "<-",
		"Tab": "Tab",
		"Enter": "Enter",
		"Shift": "Shift",
		"Space": "     "
	}
};

// Key up event - document event
document.addEventListener( "keyup", keyup );
function keyup( event ) {
	var key;

	// Lookup the key by using key and location
	key = keyLookup[ event.key + "_" + event.location ];

	// Reset the keys - no longer pressed
	keys[ key ] = 0;
	keyCodes[ event.keyCode ] = 0;

	// If a key is registered then prevent the default behavior
	if( preventKeys[ key ] || preventKeys[ event.keyCode ] ) {
		event.preventDefault();
		event.stopPropagation();
	}
}

// Key down - document event
document.addEventListener( "keydown", keydown );
function keydown( event ) {
	var key, keyVal, i, temp;

	// If we are collecting any inputs
	if( inputs.length > 0 ) {
		collectInput( event );
		return;
	}

	// Lookup the key
	key = keyLookup[ event.key + "_" + event.location ];
	keyVal = {
		"key": event.key,
		"location": event.location,
		"code": key,
		"keyCode": event.keyCode
	};
	keys[ key ] = keyVal;
	keyCodes[ event.keyCode ] = keyVal;

	// Prevent default behavior
	if( preventKeys[ key ] || preventKeys[ event.keyCode ] ) {
		event.preventDefault();
		event.stopPropagation();
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
qbs._.addCommand( "inkey", inkey, false, false, [ "key" ] );
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
qbs._.addCommand( "onkey", onkey, false, false, [ "key", "fn", "once" ] );
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
			console.error( "onkey: key needs to be either an interger keyCode or " +
				"a string key name." );
			return;
		}
		if( ! qbs.util.isFunction( fn ) ) {
			console.error( "onkey: fn is not a valid function." );
			return;
		}
		if( typeof key === "string" && key.length === 1 ) {
			key = key.toUpperCase();
			if( key >= "0" && key <= "9" ) {
				key = "Digit" + key;
			} else if( key >= "A" && key <= "Z" ) {
				key = "Key" + key;
			}
		}

		// If it's a one time function
		if( once ) {
			tempFn = fn;
			fn = function () {
				offkey( [ key, fn ] );
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
qbs._.addCommand( "offkey", offkey, false, false, [ "key", "fn" ] );
function offkey( args ) {
	var key, fn, isClear, i;

	key = args[ 0 ];
	fn = args[ 1 ];

	// Validate parameters
	if( ! isNaN( key ) && typeof key !== "string" ) {
		console.error( "offkey: key needs to be either an interger keyCode or a " +
			"string." );
		return;
	}
	if( ! qbs.util.isFunction( fn ) && fn !== undefined ) {
		console.error( "offkey: fn is not a valid function.  Leave this undefined" +
			" or set it to a function." );
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
qbs._.addCommand( "setActionKey", setActionKey, false, false,
	[ "key", "isEnabled" ]
);
qbs._.addSetting( "actionKey", setActionKey, false, [ "key", "isEnabled" ] );
function setActionKey( args ) {
	var key, isEnabled;

	key = args[ 0 ];
	isEnabled = !!( args[ 1 ] );

	if( typeof key !== "string" && qbs.util.isInteger( key ) ) {
		console.error(
			"setActionKey: key must be a string or integer"
		);
		return;
	}

	if( isEnabled ) {
		preventKeys[ key ] = true;
	} else {
		delete preventKeys[ key ];
	}
}

// Shows the prompt for the input command
function showPrompt( screenData, hideCursor ) {
	var msg, pos, dt, posPx, width, height, input;

	// If we are collecting any inputs
	if( inputs.length > 0 && inputIndex < inputs.length ) {
		input = inputs[ inputIndex ];
		msg = input.prompt + input.val;

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
		posPx = qbData.commands.getPosPx( input.screenData );
		width = ( msg.length + 1 ) * screenData.printCursor.font.width;
		height = screenData.printCursor.font.height;

		// If there is no background
		if( ! promptBackground ) {
			promptBackground = qbData.commands.get( input.screenData,
				[ posPx.x, posPx.y, posPx.x + width, posPx.y + height ]
			);
		} else if( promptBackgroundWidth < width ) {
			// We have a background but we need a bigger background
			qbData.commands.put( input.screenData,
				[ promptBackground, posPx.x, posPx.y, true ]
			);
			promptBackground = qbData.commands.get( input.screenData,
				[ posPx.x, posPx.y, posPx.x + width, posPx.y + height ]
			);
		} else {
			// Else redraw the background
			qbData.commands.put( input.screenData,
				[ promptBackground, posPx.x, posPx.y, true ]
			);
		}

		// Store the background width for later use
		promptBackgroundWidth = width;

		// Print the prompt
		pos = qbData.commands.getPos( input.screenData );
		qbData.commands.print( input.screenData, [ msg, true ] );
		qbData.commands.setPos( input.screenData, [ pos.col, pos.row ] );
		qbData.commands.render( input.screenData );

		// if( input.showKeyboard ) {
		// 	showKeyboard( input );
		// }
	} else {
		// There are no inputs then stop the interval and clear prompt data
		clearInterval( promptInterval );
		promptBackground = null;
		promptBackgroundWidth = 0;
	}
}

// function showKeyboard( input ) {
// 	var pos, i, end, word;

// 	pos = qbData.commands.getPos( input.screenData );
// 	qbData.commands.print( input.screenData, [ "" ] );
// 	i = 0;
// 	while( i < keyboard.qwerty.length ) {
// 		word = keyboard.qwerty[ i ];
// 		if( keyboard.qwerty[ i ] === "{" ) {
// 			end = keyboard.qwerty.indexOf( "}", i + 1 );
// 			if( end !== -1 ) {
// 				word = keyboard.qwerty.substring( i, end );
// 				if( ! keyboard.symbols[ word ] ) {
// 					word = keyboard.qwerty[ i ];
// 				}
// 			}
// 		}
// 		word = qbs.util.pad( word, keyboard.gap, " " );
// 		i += 1;
// 	}
// 	qbData.commands.setPos( input.screenData, [ pos.col, pos.row ] );
// }

// Prompts the user to enter input through the keyboard.
qbs._.addCommand( "input", input, false, true, [
	"prompt", "name", "isNumber", "min", "max", "isInteger", "ready",
	"showKeyboard"
] );
function input( screenData, args ) {
	var prompt, name, isNumber, min, max, isInteger, ready, showKeyboard,
		readyList;

	prompt = args[ 0 ];
	name = args[ 1 ];
	isNumber = !!( args[ 2 ] );
	min = args[ 3 ];
	max = args[ 4 ];
	isInteger = !!( args[ 5 ] );
	ready = args[ 6 ];
	showKeyboard = !!( args[ 7 ] );

	if( typeof prompt !== "string" ) {
		console.error( "input: prompt is required and must be a string." );
		return;
	}
	if( typeof name !== "string" && name !== undefined ) {
		console.error( "input: name must be a string or left blank." );
	}

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
		"readyList": readyList,
		"screenData": screenData,
		"showKeyboard": showKeyboard
	} );
	t = ( new Date() ).getTime();
	promptInterval = setInterval( function() {
		showPrompt( screenData );
	}, 100 );

	return ready;
}

function collectInput( event ) {
	var input, removeLastChar;

	removeLastChar = false;
	input = inputs[ inputIndex ];
	if( event.keyCode === 13 ) {

		// The enter key was pressed
		showPrompt( input.screenData, true );
		qbData.commands.print( input.screenData, [ "" ] );
		triggerReady( input );
		inputIndex += 1;
		if( inputIndex >= inputs.length ) {
			closeInputs();
		}
	} else if( event.keyCode === 8 ) {
		// The backspace key was pressed
		if( input.val.length > 0 ) {
			removeLastChar = true;
		}
	} else if( event.key && event.key.length === 1 ) {
		// A character key was pressed
		input.val += event.key;

		// Return if character is not a digit
		if( input.isNumber ) {
			if( isNaN( Number( input.val ) ) ) {
				removeLastChar = true;
			} else if( input.max && Number( input.val ) > input.max ) {
				removeLastChar = true;
			} else if( input.min && Number( input.val ) < input.min ) {
				removeLastChar = true;
			} else if( input.isInteger && event.key === "." ) {
				removeLastChar = true;
			}
		}
	}
	// Remove one character from the end of the string
	if( removeLastChar ) {
		input.val = input.val.substring( 0, input.val.length - 1 );
	}
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

// Process the input for numbers and if a number makes sure it meets the
// requirements
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
qbs._.addCommand( "inputReady", inputReady, false, false, [ "fn" ] );
function inputReady( args ) {
	var fn;

	fn = args[ 0 ];

	if( qbs.util.isFunction( fn ) ) {
		inputReadyList.push( fn );
	}
}

// Set the charcode for the input prompt
qbs._.addCommand( "setInputCursor", setInputCursor, false, true,
	[ "cursor" ]
);
qbs._.addSetting( "inputCursor", setInputCursor, true, [ "cursor" ] );
function setInputCursor( screenData, args ) {
	var cursor, font;

	cursor = args[ 0 ];
	font = screenData.printCursor.font;

	if( typeof cursor === "string" ) {
		cursor = cursor.charCodeAt( 0 );
	}

	if( ! qbs.util.isInteger( cursor ) ) {
		console.error( "setInputCursor: cursor must be a string or integer" );
		return;
	}

	if( font.mode === "pixel" && ! font.chars.indexOf( cursor ) ) {
		console.error( 
			"setInputCursor: font does not contain the cursor character"
		);
		return;
	}

	screenData.printCursor.prompt = cursor;
}

// End of File Encapsulation
} )();
