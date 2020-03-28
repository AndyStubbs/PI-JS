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
		"fCos": [],
		"fSin": [],
		"defaultPrompt": 219,
		"defaultFont": {
			"width": 8,
			"height": 8,
			"x": 0,
			"y": 0,
			"data": null,
			"printFunction": null,
			"calcWidth": null
		},
		"nextFontId": 0,
		"fonts": {},
		"defaultPalette": ["#000000","#0000AA","#00AA00","#00AAAA","#AA0000","#AA00AA","#AA5500","#AAAAAA","#555555",
			"#5555FF","#55FF55","#55FFFF","#FF5555","#FF55FF","#FFFF55","#FFFFFF","#000000","#141414","#202020","#2D2D2D",
			"#393939","#454545","#515151","#616161","#717171","#828282","#929292","#A2A2A2","#B6B6B6","#CACACA","#E3E3E3",
			"#FFFFFF","#0000FF","#4100FF","#7D00FF","#BE00FF","#FF00FF","#FF00BE","#FF007D","#FF0041","#FF0000","#FF4100",
			"#FF7D00","#FFBE00","#FFFF00","#BEFF00","#7DFF00","#41FF00","#00FF00","#00FF41","#00FF7D","#00FFBE","#00FFFF",
			"#00BEFF","#007DFF","#0041FF","#7D7DFF","#9E7DFF","#BE7DFF","#DF7DFF","#FF7DFF","#FF7DDF","#FF7DBE","#FF7D9E",
			"#FF7D7D","#FF9E7D","#FFBE7D","#FFDF7D","#FFFF7D","#DFFF7D","#BEFF7D","#9EFF7D","#7DFF7D","#7DFF9E","#7DFFBE",
			"#7DFFDF","#7DFFFF","#7DDFFF","#7DBEFF","#7D9EFF","#B6B6FF","#C6B6FF","#DBB6FF","#EBB6FF","#FFB6FF","#FFB6EB",
			"#FFB6DB","#FFB6C6","#FFB6B6","#FFC6B6","#FFDBB6","#FFEBB6","#FFFFB6","#EBFFB6","#DBFFB6","#C6FFB6","#B6FFB6",
			"#B6FFC6","#B6FFDB","#B6FFEB","#B6FFFF","#B6EBFF","#B6DBFF","#B6C6FF","#000071","#1C0071","#390071","#550071",
			"#710071","#710055","#710039","#71001C","#710000","#711C00","#713900","#715500","#717100","#557100","#397100",
			"#1C7100","#007100","#00711C","#007139","#007155","#007171","#005571","#003971","#001C71","#393971","#453971",
			"#553971","#613971","#713971","#713961","#713955","#713945","#713939","#714539","#715539","#716139","#717139",
			"#617139","#557139","#457139","#397139","#397145","#397155","#397161","#397171","#396171","#395571","#394571",
			"#515171","#595171","#615171","#695171","#715171","#715169","#715161","#715159","#715151","#715951","#716151",
			"#716951","#717151","#697151","#617151","#597151","#517151","#517159","#517161","#517169","#517171","#516971",
			"#516171","#515971","#000041","#100041","#200041","#310041","#410041","#410031","#410020","#410010","#410000",
			"#411000","#412000","#413100","#414100","#314100","#204100","#104100","#004100","#004110","#004120","#004131",
			"#004141","#003141","#002041","#001041","#202041","#282041","#312041","#392041","#412041","#412039","#412031",
			"#412028","#412020","#412820","#413120","#413920","#414120","#394120","#314120","#284120","#204120","#204128",
			"#204131","#204139","#204141","#203941","#203141","#202841","#2D2D41","#312D41","#352D41","#3D2D41","#412D41",
			"#412D3D","#412D35","#412D31","#412D2D","#41312D","#41352D","#413D2D","#41412D","#3D412D","#35412D","#31412D",
			"#2D412D","#2D4131","#2D4135","#2D413D","#2D4141","#2D3D41","#2D3541","#2D3141","#000000","#000000","#000000",
			"#000000","#000000","#000000","#000000"],
		"commands": {},
		"screenCommands": {}
	};

	// QBS api
	api = {
		"_": {
			"addCommand": addCommand,
			"addCommands": addCommands,
			"processCommands": processCommands,
			"data": qbData,
			"resume": resume,
			"wait": wait
		}
	};

	// Add a command to the internal list
	function addCommand( name, fn, isInternal, isScreen ) {
		qbData.commands[ name ] = fn;
		commandList.push( {
			"name": name,
			"fn": fn,
			"isInternal": isInternal,
			"isScreen": isScreen
		} );
	}

	function addCommands( name, fnPx, fnAa ) {
		addCommand( name, function ( screenData, args ) {
			if( screenData.pixelMode ) {
				fnPx( screenData, args );
			} else {
				fnAa( screenData, args );
			}
		}, false, true );
	}

	function processCommands() {
		var i, cmd;
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
		if( ! cmd.isInternal ) {
			if( cmd.isScreen ) {
				qbData.screenCommands[ cmd.name ] = {
					"fn": cmd.fn
				};
				api[ cmd.name ] = function () {
					var args = [].slice.call( arguments );
					var screenData = getScreenData( undefined, cmd.name );
					if( screenData !== false ) {
						return qbData.commands[ cmd.name ]( screenData, args );
					}
				};
			} else {
				api[ cmd.name ] = function () {
					var args = [].slice.call( arguments );
					return qbData.commands[ cmd.name ]( args );
				};
			}
		}
	}

	// Gets the screen data
	addCommand( "getScreenData", getScreenData, true, false );
	function getScreenData( screenId, commandName ) {
		if( qbData.activeScreen === null ) {
			console.error( commandName + ": No screens available for command." );
			return false;
		}
		if( screenId === undefined || screenId === null ) {
			screenId = qbData.activeScreen.id;
		}
		if( Number.isInteger( screenId ) && ! qbData.screens[ screenId ] ) {
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
	addCommand( "ready", ready, false, false );
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
	addCommand( "setScreen", setScreen, false, false );
	function setScreen( args ) {
		var screenData;

		screenData = args[ 0 ];
		qbData.activeScreen = qbData.screens[ screenData.id ];
	}

	// Remove all screens from the page and memory
	addCommand( "removeAllScreens", removeAllScreens, false, false );
	function removeAllScreens() {
		var i, screenData;
		for( i in qbData.screens ) {
			screenData = qbData.screens[ i ];
			screenData.screenObj.removeScreen();
		}
	}

	addCommand( "getScreen", getScreen, false, false );
	function getScreen( args ) {
		var screenId, screen;

		screenId = args[ 0 ];
		screen = getScreenData( screenId, "getScreen" );
		return screen.screenObj;
	}

	return api;

} )();

