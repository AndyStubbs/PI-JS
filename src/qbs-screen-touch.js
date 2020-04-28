/*
* File: qbs-screen-touch.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "startTouch", startTouch, false, true, [] );
function startTouch( screenData ) {
	screenData.canvas.addEventListener( "touchstart", touchStart );
	screenData.canvas.addEventListener( "touchmove", touchMove );
	screenData.canvas.addEventListener( "touchend", touchEnd );
	screenData.canvas.addEventListener( "touchcancel", touchEnd );
}

qbs._.addCommand( "stopTouch", stopTouch, false, true, [] );
function stopTouch( screenData ) {
	screenData.canvas.removeEventListener( "touchstart", touchStart );
	screenData.canvas.removeEventListener( "touchmove", touchMove );
	screenData.canvas.removeEventListener( "touchend", touchEnd );
	screenData.canvas.removeEventListener( "touchcancel", touchEnd );
}

function touchStart( e ) {
	var screenData;
	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );
	qbData.commands.triggerEventListeners( "start", intouch( screenData ), screenData.onTouchEventListeners );
}

function touchMove( e ) {
	var screenData;
	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );
	qbData.commands.triggerEventListeners( "move", intouch( screenData ), screenData.onTouchEventListeners );
}

function touchEnd( e ) {
	var screenData;
	screenData = qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );
	qbData.commands.triggerEventListeners( "end", intouch( screenData ), screenData.onTouchEventListeners );
}

function updateTouch( screenData, e ) {
	var rect, j, touch, touchData, newTouches;

	if( screenData.clientRect ) {
		newTouches = {};
		rect = screenData.clientRect;
		for( j = 0; j < e.touches.length; j++ ) {
			touch = e.touches[ j ];
			touchData = {};
			touchData.x = Math.floor( ( touch.pageX - rect.left ) / rect.width * screenData.width );
			touchData.y = Math.floor( ( touch.pageY - rect.top ) / rect.height * screenData.height );
			touchData.id = touch.identifier;
			if( screenData.touches[ touchData.id ] ) {
				touchData.lastX = screenData.touches[ touchData.id ].x;
				touchData.lastY = screenData.touches[ touchData.id ].y;
			} else {
				touchData.lastX = null;
				touchData.lastY = null;
			}
			newTouches[ touchData.id ] = touchData;
		}
		screenData.touches = newTouches;
	}
}

qbs._.addCommand( "intouch", intouch, false, true, [] );
function intouch( screenData ) {
	var touchArr, i, touch, touchData;

	touchArr = [];

	// Make a local copy of touch Object
	for( i in screenData.touches ) {
		touch = screenData.touches[ i ];
		touchData = {
			"x": touch.x,
			"y": touch.y,
			"id": touch.id,
			"lastX": touch.lastX,
			"lastY": touch.lastY
		};
		touchArr.push( touchData );
	}

	return touchArr;
}

// Adds an event trigger for a mouse event
qbs._.addCommand( "ontouch", ontouch, false, true, [ "mode", "fn", "once", "hitBox" ] );
function ontouch( screenData, args ) {
	var mode, fn, once, hitBox;

	mode = args[ 0 ];
	fn = args[ 1 ];
	once = args[ 2 ];
	hitBox = args[ 3 ];

	qbData.commands.onevent( mode, fn, once, hitBox, "start", "end", "move", "ontouch", offtouch, screenData.onTouchEventListeners );
}

// Removes an event trigger for a touch event
function offtouch( screenData, args ) {
	var mode, fn;

	mode = args[ 0 ];
	fn = args[ 1 ];

	qbData.commands.offevent( mode, fn, "start", "end", "move", "offtouch", screenData.onTouchEventListeners );
}

qbs._.addCommand( "setPinchZoom", setPinchZoom, false, true, [ "isEnabled" ] );
function setPinchZoom( screenData, args ) {
	var isEnabled;

	isEnabled = args[ 0 ];

	if( isEnabled ) {
		document.body.style.touchAction = "";
	} else {
		document.body.style.touchAction = "none";
	}
}

// End of File Encapsulation
} )();
