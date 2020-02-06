/*
* File: qbs-screen.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

// QBS Core API
// State Function
// Creates a new screen object
window.qbs.screen = function screen( aspect, container, isOffscreen ) {

	var aspectData, screenObj, screenData, commands, cache;

	cache = {
		"findColor": {}
	};
	commands = {};

	if( typeof aspect === "string" && aspect !== "" ) {
		aspect = aspect.toLowerCase();
		aspectData = parseAspect( aspect );
	}

	if( isOffscreen ) {
		if( ! aspectData ) {
			console.error( "screen: You must supply an aspect ratio with exact dimensions for offscreen screens." );
			return;
		}
		screenData = createOffscreenScreen( aspectData );
	} else {
		screenData = createScreen( aspectData, container );
	}

	// Setup commands
	commands.print = qbData.commands.print;
	commands.pset = qbData.commands.pset;
	commands.render = qbData.commands.render;
	commands.canvas = qbData.commands.canvas;
	commands.setActive = qbData.commands.setActive;
	commands.removeScreen = qbData.commands.removeScreen;
	commands.bgColor = qbData.commands.bgColor;
	commands.containerBgColor = qbData.commands.containerBgColor;
	commands.line = qbData.commands.qbLine;
	commands.put = qbData.commands.put;
	commands.get = qbData.commands.get;
	commands.findColor = findColor;
	commands.setAnitAlias = setAnitAlias;

	screenObj = {
		"print": function( msg ) {
			return commands.print( screenData, msg );
		},
		"pset": function ( x, y ) {
			return commands.pset( screenData, x, y );
		},
		"render": function () {
			return commands.render( screenData );
		},
		"canvas": function () {
			return commands.canvas( screenData );
		},
		"setActive": function () {
			return commands.setActive( screenData );
		},
		"remove": function () {
			return commands.removeScreen( screenData );
		},
		"bgColor": function ( color ) {
			return commands.bgColor( screenData, color );
		},
		"containerBgColor": function ( color ) {
			return commands.containerBgColor( screenData, color );
		},
		"line": function ( x1, y1, x2, y2 ) {
			return commands.line( screenData, x1, y1, x2, y2 );
		},
		"put": function ( data, x, y ) {
			return commands.put( screenData, data, x, y );
		},
		"get": function ( x1, y1, x2, y2, tolerance ) {
			return commands.get( screenData, x1, y1, x2, y2, tolerance );
		},
		"findColor": function ( c, tolerance ) {
			return commands.findColor( screenData, c, tolerance );
		},
		"setAnitAlias": function ( isEnabled ) {
			return commands.setAnitAlias( screenData, isEnabled );
		}
	};

	// Assign a reference to the object
	screenData.screenObj = screenObj;

	return screenObj;

	function setAnitAlias( screenData, isEnabled ) {
		if( isEnabled ) {
			screenData.anitAlias = true;
			commands.line = qbData.commands.cLine;
		} else {
			screenData.anitAlias = false;
			commands.line = qbData.commands.qbLine;
		}
	}

	function findColor( screenData, c, tolerance) {
		var i, pal, dr, dg, db, difference;
		if(tolerance === undefined) {
			tolerance = 0;
		}
	
		pal = screenData.pal;
	
		if( cache[ "findColor" ][ c.s ] ) {
			return cache[ "findColor" ][ c.s ];
		}
		for( i = 1; i < pal.length; i++ ) {
			if(tolerance === 0 && pal[i].s === c.s) {
				cache[ "findColor" ][ c.s ] = i;
				return i;
			} else {
				dr = pal[i].r - c.r;
				dg = pal[i].g - c.g;
				db = pal[i].b - c.b;
	
				difference = dr * dr + dg * dg + db * db;
				if(difference <= tolerance) {
					cache[ "findColor" ][ c.s ] = i;
					return i;
				}
			}
		}
		pal.push( c );
		cache[ "findColor" ][ c.s ] = pal.length - 1;
		return pal.length - 1;
	}
};

// Parses the aspect ratio string
function parseAspect( aspect ) {
	var width, height, parts, splitter;

	// 2 Types of ratio's pct or exact pixels
	if( aspect.indexOf( ":" ) > -1 ) {
		splitter = ":";
	} else if( aspect.indexOf( "x" ) > -1 ) {
		splitter = "x";
	}

	parts = aspect.split( splitter );

	// Get the width and validate it
	width = Number( parts[ 0 ] );
	if( isNaN( width ) || width === 0 ) {
		return;
	}

	// Get the height and validate it
	height = Number( parts[ 1 ] );
	if( isNaN( height ) || height === 0 ) {
		return;
	}

	return {
		"width": width,
		"height": height,
		"splitter": splitter
	};
}

// Create's a new offscreen canvas
function createOffscreenScreen( aspectData ) {
	var canvas, bufferCanvas;

	// Create the canvas
	canvas = document.createElement( "canvas" );
	canvas.width = aspectData.width;
	canvas.height = aspectData.height;
	bufferCanvas = document.createElement( "canvas" );
	bufferCanvas.width = aspectData.width;
	bufferCanvas.height = aspectData.height;

	return createScreenData( canvas, bufferCanvas, null, aspectData, true );
}

// Create a new canvas
function createScreen( aspectData, container ) {
	var canvas, bufferCanvas;

	// Create the canvas
	canvas = document.createElement( "canvas" );
	bufferCanvas = document.createElement( "canvas" );

	// Style the canvas
	canvas.style.backgroundColor = "black";
	canvas.style.position = "absolute";
	canvas.style.imageRendering = "pixelated";

	// If no container applied then use document body.
	if( ! qbs.util.isDomElement( container ) ) {
		document.documentElement.style.height = "100%";
		document.documentElement.style.margin = "0";
		document.body.style.height = "100%";
		document.body.style.margin = "0";
		document.body.style.overflow = "hidden";
		container = document.body;
		canvas.style.left = "0";
		canvas.style.top = "0";
	}

	// Make sure the container is not blank
	if( container.offsetHeight === 0 ) {
		container.style.height = "200px";
	}

	// Append the canvas to the container
	container.appendChild( canvas );

	if( aspectData ) {
		// Set the canvas size
		setCanvasSize( aspectData, canvas, container.offsetWidth, container.offsetHeight );

		// Set the buffer size
		bufferCanvas.width = canvas.width;
		bufferCanvas.height = canvas.height;

	} else {
		canvas.style.width = "100%";
		canvas.style.height = "100%";
		bufferCanvas.width = canvas.offsetWidth;
		bufferCanvas.height = canvas.offsetHeight;
		window.addEventListener( "resize", function () {
			bufferCanvas.width = canvas.offsetWidth;
			bufferCanvas.height = canvas.offsetHeight;
		} );
	}

	return createScreenData( canvas, bufferCanvas, container, aspectData, false );
}

// Create the screen data
function createScreenData( canvas, bufferCanvas, container, aspectData, isOffscreen ) {
	var screenData = {};

	// Set the screen id
	screenData.id = qbData.nextScreenId;
	qbData.nextScreenId += 1;
	qbData.activeScreen = screenData;

	// Set the screenId on the canvas
	canvas.dataset.screenId = screenData.id;

	// Set the screen default data
	screenData.canvas = canvas;
	screenData.width = canvas.width;
	screenData.height = canvas.height;
	screenData.container = container;
	screenData.aspectData = aspectData;
	screenData.isOffscreen = isOffscreen;
	screenData.context = canvas.getContext( "2d" );
	screenData.bufferCanvas = bufferCanvas;
	screenData.bufferContext = screenData.bufferCanvas.getContext( "2d" );
	screenData.dirty = false;
	screenData.fColor = 7;
	screenData.x = 0;
	screenData.y = 0;
	screenData.angle = 0;
	screenData.pal = qbData.defaultPalette.slice();
	screenData.context.fillStyle = screenData.pal[ screenData.fColor ].s;
	screenData.context.strokeStyle = screenData.pal[ screenData.fColor ].s;
	screenData.printCursor = {
		"charWidth": qbData.defaultFont.width,
		"charHeight": qbData.defaultFont.height,
		"x": 0,
		"y": 0,
		"font": qbData.defaultFont.data,
		"rows": Math.floor( canvas.width / qbData.defaultFont.width ),
		"cols": Math.floor( canvas.height / qbData.defaultFont.height ),
		"prompt": qbData.defaultPrompt,
		"breakWord": true,
		"printFunction": qbData.defaultFont.printFunction,
		"calcWidth": qbData.defaultFont.calcWidth
	};
	screenData.clientRect = canvas.getBoundingClientRect();
	screenData.mouse = {
		"x": 0,
		"y": 0,
		"buttons": 0
	};
	screenData.contextMode = false;
	screenData.touches = {};
	screenData.antiAliasMode = false;

	// Disable anti aliasing
	screenData.context.imageSmoothingEnabled = false;

	// Set this to the active screen
	qbData.screens[ screenData.id ] = screenData;

	return screenData;
}

// Sets the canvas size
function setCanvasSize( aspectData, canvas, maxWidth, maxHeight ) {
	var width, height, newWidth, newHeight, offset, splitter, ratio1, ratio2;

	width = aspectData.width;
	height = aspectData.height;
	splitter = aspectData.splitter;

	// Calculate the ratios
	ratio1 = height / width;
	ratio2 = width / height;

	// Calculate the new sizes
	newWidth = maxHeight * ratio2;
	newHeight = maxWidth * ratio1;
	if( newWidth > maxWidth ) {

		// Set the width to full width
		newWidth = maxWidth;

		// Calculate the best fit height
		newHeight = newWidth * ratio1;

		// Calucate the remainder to center the canvas vertically
		offset = ( maxHeight - newHeight ) / 2;

		// Set the margins
		canvas.style.marginLeft = "0";
		canvas.style.marginTop = Math.floor( offset ) + "px";
	} else {

		// Set the height to full height
		newHeight = maxHeight;

		// Calucate the remainder to center the canvas horizontally
		offset = ( maxWidth - newWidth ) / 2;

		// Set the margins
		canvas.style.marginLeft = Math.floor( offset ) + "px";
		canvas.style.marginTop = "0";
	}

	// Set the size
	canvas.style.width = Math.floor( newWidth ) + "px";
	canvas.style.height = Math.floor( newHeight ) + "px";

	// If we are doing pixel exact set the canvas internal sizes
	if(splitter === "x") {
		canvas.width = width;
		canvas.height = height;
	} else {
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
	}
}

// Resizes all screens
function resizeScreens() {
	var i, screenData;

	for( i in qbData.screens ) {
		screenData = qbData.screens[ i ];

		if( ! screenData.isOffscreen ) {
			// Draw the canvas to the buffer
			screenData.bufferContext.clearRect( 0, 0, screenData.width, screenData.height );
			screenData.bufferContext.drawImage( screenData.canvas, 0, 0 );

			// Update the canvas to the new size
			setCanvasSize( screenData.aspectData, screenData.canvas, screenData.container.offsetWidth, screenData.container.offsetHeight );

			// Draw the buffer back onto the canvas
			screenData.context.drawImage( screenData.bufferCanvas, 0, 0, screenData.width, screenData.height );

			// Set the new buffer size
			screenData.bufferCanvas.width = screenData.canvas.width;
			screenData.bufferCanvas.height = screenData.canvas.height;
		}
	}
}

// Any time the screen resizes need to resize canvas too
window.addEventListener( "resize", resizeScreens );

// End of File Encapsulation
} )();
