/*
* File: qbs-screen-mouse.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "startMouse", startMouse, false, true );
function startMouse( screenData ) {
	screenData.canvas.addEventListener( "mousemove", mouseMove );
	screenData.canvas.addEventListener( "mousedown", mouseDown );
	screenData.canvas.addEventListener( "mouseup", mouseUp );
	screenData.canvas.addEventListener( "contextmenu", onContextMenu );
}

qbs._.addCommand( "stopMouse", stopMouse, false, true );
function stopMouse( screenData ) {
	screenData.canvas.removeEventListener( "mousemove", mouseMove );
	screenData.canvas.removeEventListener( "mousedown", mouseDown );
	screenData.canvas.removeEventListener( "mouseup", mouseUp );
	screenData.canvas.removeEventListener( "contextmenu", onContextMenu );
}

function mouseMove( e ) {
	var screenData;

	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	qbData.commands.triggerEventListeners( "move", inmouse( screenData ), screenData.onMouseEventListeners );
}

function mouseDown( e ) {
	var screenData;

	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	qbData.commands.triggerEventListeners( "down", inmouse( screenData ), screenData.onMouseEventListeners );
}

function mouseUp( e ) {
	var screenData;

	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	qbData.commands.triggerEventListeners( "up", inmouse( screenData ), screenData.onMouseEventListeners );

}

function onContextMenu( e ) {
	var screenData;

	screenData = qbData.screens[ e.target.dataset.screenId ];

	if( ! screenData.isContextMenuEnabled ) {
		e.preventDefault();
		return false;
	}
}

function updateMouse( screenData, e ) {
	var rect;

	rect = screenData.clientRect;
	screenData.mouse = {
		"x": Math.floor( ( e.clientX - rect.left ) / rect.width * screenData.width ),
		"y": Math.floor( ( e.clientY - rect.top ) / rect.height * screenData.height ),
		"buttons": e.buttons
	};
}

qbs._.addCommand( "inmouse", inmouse, false, true );
function inmouse( screenData ) {
	var mouse;

	mouse = {};
	mouse.x = screenData.mouse.x;
	mouse.y = screenData.mouse.y;
	mouse.buttons = screenData.mouse.buttons;

	return mouse;
}

// Adds an event trigger for a mouse event
qbs._.addCommand( "onmouse", onmouse, false, true );
function onmouse( screenData, args ) {
	var mode, fn, once, hitBox;

	mode = args[ 0 ];
	fn = args[ 1 ];
	once = args[ 2 ];
	hitBox = args[ 3 ];

	qbData.commands.onevent( mode, fn, once, hitBox, "down", "up", "move", "onmouse", offmouse, screenData.onMouseEventListeners );
}

// Removes an event trigger for a mouse event
qbs._.addCommand( "offmouse", offmouse, false, true );
function offmouse( screenData, args ) {
	var mode, fn;

	mode = args[ 0 ];
	fn = args[ 1 ];

	qbData.commands.offevent( mode, fn, "down", "up", "move", "offmouse", screenData.onMouseEventListeners );
}

qbs._.addCommand( "enableContextMenu", enableContextMenu, false, true );
function enableContextMenu( screenData, args ) {
	var isEnabled;

	isEnabled = args[ 0 ];

	qbData.isContextMenuEnabled = qbs.util.sanitizeBool( isEnabled );
}

// Setup events

// End of File Encapsulation
} )();
 