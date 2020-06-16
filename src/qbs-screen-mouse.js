/*
* File: qbs-screen-mouse.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_qbData;

m_qbData = qbs._.data;

qbs._.addCommand( "startMouse", startMouse, false, true, [] );
function startMouse( screenData ) {
	if( ! screenData.mouseStarted ) {
		screenData.canvas.addEventListener( "mousemove", mouseMove );
		screenData.canvas.addEventListener( "mousedown", mouseDown );
		screenData.canvas.addEventListener( "mouseup", mouseUp );
		screenData.canvas.addEventListener( "contextmenu", onContextMenu );
		screenData.mouseStarted = true;
	}
}

qbs._.addCommand( "stopMouse", stopMouse, false, true, [] );
function stopMouse( screenData ) {
	screenData.canvas.removeEventListener( "mousemove", mouseMove );
	screenData.canvas.removeEventListener( "mousedown", mouseDown );
	screenData.canvas.removeEventListener( "mouseup", mouseUp );
	screenData.canvas.removeEventListener( "contextmenu", onContextMenu );
	screenData.mouseStarted = false;
}

function mouseMove( e ) {
	var screenData;

	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	m_qbData.commands.triggerEventListeners( "move", inmouse( screenData ),
		screenData.onMouseEventListeners );
}

function mouseDown( e ) {
	var screenData;

	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	m_qbData.commands.triggerEventListeners( "down", inmouse( screenData ),
		screenData.onMouseEventListeners );
}

function mouseUp( e ) {
	var screenData;

	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateMouse( screenData, e );
	m_qbData.commands.triggerEventListeners( "up", inmouse( screenData ),
		screenData.onMouseEventListeners );

}

function onContextMenu( e ) {
	var screenData;

	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	if( ! screenData.isContextMenuEnabled ) {
		e.preventDefault();
		return false;
	}
}

function updateMouse( screenData, e ) {
	var rect, x, y, lastX, lastY;

	rect = screenData.clientRect;
	x = Math.floor( ( e.clientX - rect.left ) / rect.width * screenData.width );
	y = Math.floor( ( e.clientY - rect.top ) / rect.height * screenData.height );

	if( screenData.mouse ) {
		if( screenData.mouse.x ) {
			lastX = screenData.mouse.x;
		} else {
			lastX = x;
		}
		if( screenData.mouse.y ) {
			lastY = screenData.mouse.y;
		} else {
			lastY = y;
		}
	}

	screenData.mouse = {
		"x": x,
		"y": y,
		"lastX": lastX,
		"lastY": lastY,
		"buttons": e.buttons
	};
}

qbs._.addCommand( "inmouse", inmouse, false, true, [] );
function inmouse( screenData ) {
	var mouse;

	mouse = {};
	mouse.x = screenData.mouse.x;
	mouse.y = screenData.mouse.y;
	mouse.lastX = screenData.mouse.lastX;
	mouse.lastY = screenData.mouse.lastY;
	mouse.buttons = screenData.mouse.buttons;

	return mouse;
}

// Adds an event trigger for a mouse event
qbs._.addCommand( "onmouse", onmouse, false, true,
	[ "mode", "fn", "once", "hitBox" ]
);
function onmouse( screenData, args ) {
	var mode, fn, once, hitBox;

	mode = args[ 0 ];
	fn = args[ 1 ];
	once = args[ 2 ];
	hitBox = args[ 3 ];

	m_qbData.commands.onevent( mode, fn, once, hitBox, [ "down", "up", "move" ],
		"onmouse", screenData.onMouseEventListeners
	);
}

// Removes an event trigger for a mouse event
qbs._.addCommand( "offmouse", offmouse, false, true, [ "eventName", "fn" ] );
function offmouse( screenData, args ) {
	var eventName, fn;

	eventName = args[ 0 ];
	fn = args[ 1 ];

	m_qbData.commands.offevent( eventName, fn, [ "down", "up", "move" ],
		"offmouse", screenData.onMouseEventListeners
	);
}

qbs._.addCommand( "setEnableContextMenu", setEnableContextMenu, false, true,
	[ "isEnabled" ]
);
qbs._.addSetting( "enableContextMenu", setEnableContextMenu, true,
	[ "isEnabled" ]
);
function setEnableContextMenu( screenData, args ) {
	screenData.isContextMenuEnabled = !!( args[ 0 ] );
	startMouse( screenData );
}

// Setup events

// End of File Encapsulation
} )();
