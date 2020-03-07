/*
* File: qbs-screen-mouse.js
*/

// Start of File Encapsulation
( function () {

qbs._.addCommand( "startMouse", startMouse, false, true, "both", "startMouse" );
function startMouse( screenData ) {
	screenData.canvas.addEventListener( "mousemove", mouseMove );
	screenData.canvas.addEventListener( "mousedown", mouseDown );
	screenData.canvas.addEventListener( "mouseup", mouseUp );
	screenData.canvas.addEventListener( "contextmenu", onContextMenu );
}

qbs._.addCommand( "stopMouse", stopMouse, false, true, "both", "stopMouse" );
function stopMouse( screenData ) {
	screenData.canvas.removeEventListener( "mousemove", mouseMove );
	screenData.canvas.removeEventListener( "mousedown", mouseDown );
	screenData.canvas.removeEventListener( "mouseup", mouseUp );
	screenData.canvas.removeEventListener( "contextmenu", onContextMenu );
}

function mouseMove( e ) {
	var screenData;

	screenData = e.target.dataset.screenData;

	updateMouse( screenData, e );
	triggerEventListeners( "move", inmouse(), onMouseEventListeners );
}

function mouseDown( e ) {
	var screenData;

	screenData = e.target.dataset.screenData;

	updateMouse( screenData, e );
	triggerEventListeners( "down", inmouse(), onMouseEventListeners );
}

function mouseUp( e ) {
	var screenData;

	screenData = e.target.dataset.screenData;

	updateMouse( screenData, e );
	triggerEventListeners( "up", inmouse(), onMouseEventListeners );

}

function onContextMenu( e ) {
	var screenData;

	screenData = e.target.dataset.screenData;

	if( ! screenData.isContextMenuEnabled ) {
		e.preventDefault();
		return false;
	}
}

function updateMouse( screenData, e ) {
	var rect;
	rect = screenData.clientRect;
	screenData.mouse = {
		"x": Math.floor( ( e.clientX - rect.left ) / rect.width * screen.width ),
		"y": Math.floor( ( e.clientY - rect.top ) / rect.height * screen.height ),
		"buttons": e.buttons
	};
}

qbs._.addCommand( "inmouse", inmouse, true );
function inmouse( screenData ) {
	var mouse;
	mouse = {};
	mouse.x = screenData.mouse.x;
	mouse.y = screenData.mouse.y;
	mouse.buttons = screenData.mouse.buttons;

	return mouse;
}


// Adds an event trigger for a mouse event
qbs._.addCommand( "onmouse", onmouse, true );
function onmouse( mode, fn, once, hitBox ) {
	onevent( mode, fn, once, hitBox, "down", "up", "move", "onmouse", offmouse, onMouseEventListeners );
}

// Removes an event trigger for a mouse event
qbs._.addCommand( "offmouse", offmouse, false );
function offmouse( mode, fn) {
	offevent( mode, fn, "down", "up", "move", "offmouse", onMouseEventListeners );
}

qbs._.addCommand( "enableContextMenu", enableContextMenu, false );
function enableContextMenu( isEnabled ) {
	qbData.isContextMenuEnabled = qbs.util.sanitizeBool( isEnabled );
}

// Setup events

// End of File Encapsulation
} )();
