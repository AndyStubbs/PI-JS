/*
* File: qbs.js
*/

window.qbs = ( function () {
	"use strict";

	var qbData, api;

	// Initilize data
	qbData = {
		"nextScreenId": 0,
		"screens": {},
		"activeScreen": null,
		"images": {},
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

	api = {
		"_": {
			"addCommand": addCommand,
			"data": qbData
		},
		/*"print": print,
		"pset": pset,
		"canvas": canvas,
		"setActive": setActive,
		"removeScreen": removeScreen,
		"removeAllScreens": removeAllScreens,
		"bgColor": bgColor,
		"containerBgColor": containerBgColor,
		"getScreen": getScreen,
		"line": line,
		"circle": circle,
		"put": put,
		"get": get,
		"findColor": findColor,
		"setAntiAlias": setAntiAlias*/
	};

	return api;

	// Add a command to the internal list
	function addCommand( name, fn, isInternal, isScreen, aliasMode, apiName ) {
		qbData.commands[ name ] = fn;
		if( ! isInternal ) {
			var args = [].slice.call( arguments );
			if( isScreen ) {
				qbData.screenCommands[ name ] = {
					"aliasMode": aliasMode,
					"fn": fn,
					"apiName": apiName
				};
				api[ name ] = function () {
					var screenData = getScreenData( undefined, name );
					if( screenData !== false ) {
						return screenData.screenObj[ name ]( screenData, args );
					}
				};
			} else {
				api[ name ] = function () {
					var screenData = getScreenData( undefined, name );
					if( screenData !== false ) {
						return qbData.commands[ name ]( screenData, args );
					}
				};
			}
		}
	}

	/*
	// Prints text on the page
	function print( msg, screenId ) {
		screenData = getScreenData( screenId, "pset" );
		if( screenData !== false ) {
			return qbData.commands.print( screenData, msg );
		}
	}

	// Sets a pixel on the screen and set the coordinates of the cursor
	function pset( x, y, screenId ) {
		screenData = getScreenData( screenId, "pset" );
		if( screenData !== false ) {
			return qbData.commands.pset( screenData, x, y );
		}
	}

	// Gets the canvas from the screen
	function canvas( screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return qbData.commands.canvas( screenData );
		}
	}

	// Sets the active screen
	function setActive( screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return qbData.commands.setActive( screenData );
		}
	}

	// Removes the screen from the page and memory
	function removeScreen( screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return qbData.commands.removeScreen( screenData );
		}
	}

	// Removes all screens from page and memory
	function removeAllScreens() {
		return qbData.commands.removeAllScreens();
	}

		// Set the background color of the canvas
	function bgColor( color, screenId ) {
		var screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return qbData.commands.bgColor( screenData, color );
		}
	}

	// Set the background color of the container
	function containerBgColor( color, screenId ) {
		var screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return qbData.commands.containerBgColor( screenData, color );
		}
	}

	// Draw's a line on the screen
	function line( x1, y1, x2, y2, screenId ) {
		var screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.line( x1, y1, x2, y2 );
		}
	}

	// Draw's a line on the screen
	function circle( cx, cy, r ) {
		var screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.line( screenData, cx, cy, r );
		}
	}

	// Puts an array of data on the screen
	function put( data, x, y, screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.put( data, x, y );
		}
	}

	// Gets an array of data on the screen
	function get( x1, y1, x2, y2, tolerance, screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.get( screenData, x1, y1, x2, y2, tolerance );
		}
	}

	// Findcolor an array of data on the screen
	function findColor( c, tolerance, screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.findColor( screenData, c, tolerance );
		}
	}

	// Sets anti alias mode
	function setAntiAlias( isEnabled, screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj.setAntiAlias( isEnabled );
		}
	}

	// Returns the screen object based on screen id
	function getScreen( screenId ) {
		screenData = getScreenData( screenId );
		if( screenData !== false ) {
			return screenData.screenObj;
		}
	}

	*/

	// Gets the screen data
	function getScreenData( screenId, commandName ) {
		if( qbData.activeScreen === null ) {
			console.error( commandName + ": No screens available for command." );
			return false;
		}
		if( screenId === undefined ) {
			screenId = qbData.activeScreen.id;
		}
		if( Number.isInteger( screenId ) && ! qbData.screens[ screenId ] ) {
			console.error( commandName + ": Invalid screen id." );
			return false;
		}
		return qbData.screens[ screenId ];
	}

} )();

if( window.$ === undefined ) {
	window.$ = window.qbs;
}
