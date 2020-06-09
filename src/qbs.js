/*
* File: qbs.js
*/

window.qbs = ( function () {
	"use strict";

	var qbData, api, waiting, waitCount, readyList, commandList;

	waitCount = 0;
	waiting = false;
	readyList = [];
	commandList = [];

	// Initilize data
	qbData = {
		"nextScreenId": 0,
		"screens": {},
		"activeScreen": null,
		"images": {},
		"imageCount": 0,
		"defaultPrompt": 219,
		"defaultFont": {},
		"nextFontId": 0,
		"fonts": {},
		"defaultPalette": [],
		"commands": {},
		"screenCommands": {},
		"defaultPenDraw": null,
		"pens": {},
		"penList": [],
		"settings": {},
		"settingsList": [],
		"volume": 1
	};

	// QBS api
	api = {
		"_": {
			"addCommand": addCommand,
			"addCommands": addCommands,
			"addSetting": addSetting,
			"processCommands": processCommands,
			"addPen": addPen,
			"data": qbData,
			"resume": resume,
			"wait": wait
		}
	};

	// Add a command to the internal list
	function addCommand( name, fn, isInternal, isScreen, parameters, isSet ) {
		qbData.commands[ name ] = fn;

		if( ! isInternal ) {
			commandList.push( {
				"name": name,
				"fn": fn,
				"isScreen": isScreen,
				"parameters": parameters,
				"isSet": isSet,
				"noParse": isSet
			} );
		}
	}

	function addCommands( name, fnPx, fnAa, parameters ) {
		addCommand( name, function ( screenData, args ) {
			if( screenData.pixelMode ) {
				fnPx( screenData, args );
			} else {
				fnAa( screenData, args );
			}
		}, false, true, parameters );
	}

	function addSetting( name, fn, isScreen, parameters ) {
		qbData.settings[ name ] = {
			"name": name,
			"fn": fn,
			"isScreen": isScreen,
			"parameters": parameters
		};
		qbData.settingsList.push( name );
	}

	function processCommands() {
		var i, cmd;

		// Alphabetize commands
		commandList = commandList.sort( function( a, b ) {
			var nameA = a.name.toUpperCase();
			var nameB = b.name.toUpperCase();
			if( nameA < nameB ) {
				return -1;
			}
			if( nameA > nameB ) {
				return 1;
			}
			return 0;
		} );

		for( i = 0; i < commandList.length; i++ ) {
			cmd = commandList[ i ];
			processCommand( cmd );
		}
	}

	function processCommand( cmd ) {
		if( cmd.isSet ) {
			qbData.screenCommands[ cmd.name ] = cmd;
			api[ cmd.name ] = function () {
				var args;
				args = parseOptions( cmd, [].slice.call( arguments ) );
				return qbData.commands[ cmd.name ]( null, args );
			};
			return;
		}

		if( cmd.isScreen ) {
			qbData.screenCommands[ cmd.name ] = cmd
			api[ cmd.name ] = function () {
				var args, screenData;
				args = parseOptions( cmd, [].slice.call( arguments ) );
				screenData = getScreenData( undefined, cmd.name );
				if( screenData !== false ) {
					return qbData.commands[ cmd.name ]( screenData, args );
				}
			};
		} else {
			api[ cmd.name ] = function () {
				var args;
				args = parseOptions( cmd, [].slice.call( arguments ) );
				return qbData.commands[ cmd.name ]( args );
			};
		}
	}

	// Convert named arguments to array
	addCommand( "parseOptions", parseOptions, true, false );
	function parseOptions( cmd, args ) {
		var i, options, args2, foundParameter;

		if( cmd.noParse ) {
			return args;
		}

		// if the first argument is an object then use named parameters
		if(
			args.length > 0 &&
			typeof args[ 0 ] === "object" &&
			args[ 0 ] !== null &&
			! args[ 0 ].hasOwnProperty( "screen" ) &&
			! qbs.util.isArray( args[ 0 ] ) &&
			! qbs.util.isDomElement( args[ 0 ] ) 
		) {
			options = args[ 0 ];
			args2 = [];
			foundParameter = false;
			for( i = 0; i < cmd.parameters.length; i++ ) {

				// Check if option has parameter
				if( options.hasOwnProperty( cmd.parameters[ i ] ) ) {
					args2.push( options[ cmd.parameters[ i ] ] );
					foundParameter = true;
				} else {
					args2.push( null );
				}
			}
			if( foundParameter ) {
				return args2;
			}
		}
		return args;
	}

	// Add a pen to the internal list
	function addPen( name, fn, cap ) {
		qbData.penList.push( name );
		qbData.pens[ name ] = {
			"cmd": fn,
			"cap": cap
		};
	}

	// Gets the screen data
	addCommand( "getScreenData", getScreenData, true, false, [] );
	function getScreenData( screenId, commandName ) {
		if( qbData.activeScreen === null ) {
			if( commandName === "set" ) {
				return false;
			}
			console.error( commandName + ": No screens available for command." );
			return false;
		}
		if( screenId === undefined || screenId === null ) {
			screenId = qbData.activeScreen.id;
		}
		if( qbs.util.isInteger( screenId ) && ! qbData.screens[ screenId ] ) {
			console.error( commandName + ": Invalid screen id." );
			return false;
		}
		return qbData.screens[ screenId ];
	}

	function resume() {
		waitCount--;
		if( waitCount === 0 ) {
			startReadyList();
		}
	}

	function startReadyList() {
		var i, temp;
		if( document.readyState !== "loading" ) {
			waiting = false;
			temp = readyList.slice();
			readyList = [];
			for( i = 0; i < temp.length; i++ ) {
				temp[ i ]();
			}
		} else {
			setTimeout( startReadyList, 10 );
		}
	}

	function wait() {
		waitCount++;
		waiting = true;
	}

	// This trigger a function once QBS is completely loaded
	addCommand( "ready", ready, false, false, [ "fn" ] );
	function ready( args ) {
		var fn;

		fn = args[ 0 ];

		if( qbs.util.isFunction( fn ) ) {
			if( waiting ) {
				readyList.push( fn );
			} else if ( document.readyState === "loading" ) {
				readyList.push( fn );
				setTimeout( startReadyList, 10 );
			} else {
				fn();
			}
		}
	}

	// Set the active screen on qbs
	addCommand( "setScreen", setScreen, false, false, [ "screen" ] );
	addSetting( "screen", setScreen, false, [ "screen" ] );
	function setScreen( args ) {
		var screenObj, screenId;

		screenObj = args[ 0 ];

		if( qbs.util.isInteger( screenObj ) ) {
			screenId = screenObj;
		} else if( screenObj && qbs.util.isInteger( screenObj.id ) ) {
			screenId = screenObj.id;
		}
		if( ! qbData.screens[ screenId ] ) {
			console.error( "screen: Invalid screen." );
			return;
		}
		qbData.activeScreen = qbData.screens[ screenId ];
	}

	// Remove all screens from the page and memory
	addCommand( "removeAllScreens", removeAllScreens, false, false, [] );
	function removeAllScreens() {
		var i, screenData;
		for( i in qbData.screens ) {
			screenData = qbData.screens[ i ];
			screenData.screenObj.removeScreen();
		}
	}

	addCommand( "getScreen", getScreen, false, false, [ "screenId" ] );
	function getScreen( args ) {
		var screenId, screen;

		screenId = args[ 0 ];
		screen = getScreenData( screenId, "getScreen" );
		return screen.screenObj;
	}

	// Set the default palette
	addCommand( "setDefaultPal", setDefaultPal, false, false, [ "pal" ] );
	addSetting( "defaultPal", setDefaultPal, false, [ "pal" ] );
	function setDefaultPal( args ) {
		var pal, i, c;

		pal = args[ 0 ];
		if( ! qbs.util.isArray( pal ) ) {
			console.error( "setDefaultPal: parameter pal is not an array." );
			return;
		}

		qbData.defaultPalette = [];

		for( i = 0; i < pal.length; i++ ) {
			c = qbs.util.convertToColor( pal[ i ] );
			if( c === null ) {
				console.error( "setDefaultPal: invalid color value inside array pal." );
				qbData.defaultPalette.push( qbs.util.convertToColor( "#000000" ) );
			} else {
				qbData.defaultPalette.push( qbs.util.convertToColor( pal[ i ] ) );
			}
		}

		// Set color 0 to transparent
		qbData.defaultPalette[ 0 ] = qbs.util.convertToColor( [
			qbData.defaultPalette[ 0 ].r,
			qbData.defaultPalette[ 0 ].g,
			qbData.defaultPalette[ 0 ].b,
			0
		] );
	}

	// Get default pal command
	addCommand( "getDefaultPal", getDefaultPal, false, false, [] );
	function getDefaultPal( args ) {
		var i, color, colors;
		colors = [];
		for( i = 0; i < qbData.defaultPalette.length; i++ ) {
			color = {
				"r": qbData.defaultPalette[ i ].r,
				"g": qbData.defaultPalette[ i ].g,
				"b": qbData.defaultPalette[ i ].b,
				"a": qbData.defaultPalette[ i ].a,
				"s": qbData.defaultPalette[ i ].s
			};
			colors.push( qbData.defaultPalette[ i ] );
		}
		return colors;
	}

	// Global settings command
	addCommand( "set", set, false, true, qbData.settingsList, true );
	function set( screenData, args ) {
		var options, optionName, setting, optionValues;

		options = args[ 0 ];

		// Loop through all the options
		for( optionName in options ) {

			// If the option is a valid setting
			if( qbData.settings[ optionName ] ) {

				// Get the setting data
				setting = qbData.settings[ optionName ];

				// Parse the options from the setting
				optionValues = options[ optionName ];
				if( 
					! qbs.util.isArray( optionValues ) && 
					typeof optionValues === "object"
				) {
					optionValues = parseOptions( setting, [ optionValues ] );
				} else {
					optionValues = [ optionValues ];
				}

				// Call the setting function
				if( setting.isScreen ) {
					if( ! screenData ) {
						screenData = getScreenData(
							undefined, "set " + setting.name
						);
					}
					setting.fn( screenData, optionValues );
				} else {
					setting.fn( optionValues );
				}
			}
		}
	}

	return api;

} )();
