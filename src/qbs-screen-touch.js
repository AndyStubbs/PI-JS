/*
* File: qbs-screen-touch.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_qbData;

m_qbData = qbs._.data;

qbs._.addCommand( "startTouch", startTouch, false, true, [] );
function startTouch( screenData ) {
	if( ! screenData.touchStarted ) {
		screenData.canvas.addEventListener( "touchstart", touchStart );
		screenData.canvas.addEventListener( "touchmove", touchMove );
		screenData.canvas.addEventListener( "touchend", touchEnd );
		screenData.canvas.addEventListener( "touchcancel", touchEnd );
		screenData.touchStarted = true;
	}
}

qbs._.addCommand( "stopTouch", stopTouch, false, true, [] );
function stopTouch( screenData ) {
	if( screenData.touchStarted ) {
		screenData.canvas.removeEventListener( "touchstart", touchStart );
		screenData.canvas.removeEventListener( "touchmove", touchMove );
		screenData.canvas.removeEventListener( "touchend", touchEnd );
		screenData.canvas.removeEventListener( "touchcancel", touchEnd );
		screenData.touchStarted = false;
	}
}

function touchStart( e ) {
	var screenData;
	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );

	if( screenData.touchEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "start",
			getTouch( screenData ), screenData.onTouchEventListeners
		);
	}

	if( screenData.pressEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "down",
			getTouchPress( screenData ), screenData.onPressEventListeners
		);
	}
}

function touchMove( e ) {
	var screenData;
	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );

	if( screenData.touchEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "move",
			getTouch( screenData ), screenData.onTouchEventListeners
		);
	}

	if( screenData.pressEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "move",
			getTouchPress( screenData ), screenData.onPressEventListeners
		);
	}
}

function touchEnd( e ) {
	var screenData;
	screenData = m_qbData.screens[ e.target.dataset.screenId ];

	updateTouch( screenData, e );

	if( screenData.touchEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "end", getTouch( screenData ),
			screenData.onTouchEventListeners
		);
	}

	if( screenData.pressEventListenersActive > 0 ) {
		m_qbData.commands.triggerEventListeners( "up",
			getTouchPress( screenData ), screenData.onPressEventListeners
		);
	}
}

function updateTouch( screenData, e ) {
	var rect, j, touch, touchData, newTouches;

	if( screenData.clientRect ) {
		newTouches = {};
		rect = screenData.clientRect;
		for( j = 0; j < e.touches.length; j++ ) {
			touch = e.touches[ j ];
			touchData = {};
			touchData.x = Math.floor(
				( touch.pageX - rect.left ) / rect.width * screenData.width
			);
			touchData.y = Math.floor(
				( touch.pageY - rect.top ) / rect.height * screenData.height
			);
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

function getTouch( screenData ) {
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

function getTouchPress( screenData ) {
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

	touchData = touchArr[ 0 ];
	touchData.buttons = 1;
	touchData.touches = touchArr;

	return touchData;
}

qbs._.addCommand( "intouch", intouch, false, true, [] );
function intouch( screenData ) {

	startTouch( screenData );

	return getTouch( screenData );
}

// Adds an event trigger for a mouse event
qbs._.addCommand( "ontouch", ontouch, false, true,
	[ "mode", "fn", "once", "hitBox" ]
);
function ontouch( screenData, args ) {
	var mode, fn, once, hitBox, isValid;

	mode = args[ 0 ];
	fn = args[ 1 ];
	once = args[ 2 ];
	hitBox = args[ 3 ];

	isValid = m_qbData.commands.onevent(
		mode, fn, once, hitBox, [ "start", "end", "move" ],
		"ontouch", screenData.onTouchEventListeners
	);

	if( isValid ) {
		startTouch( screenData );
		screenData.touchEventListenersActive += 1;
	}
}

// Removes an event trigger for a touch event
qbs._.addCommand( "offtouch", offtouch, false, true, [ "mode", "fn" ] );
function offtouch( screenData, args ) {
	var mode, fn, isValid;

	mode = args[ 0 ];
	fn = args[ 1 ];


	isValid = m_qbData.commands.offevent( mode, fn, [ "start", "end", "move" ],
		"offtouch", screenData.onTouchEventListeners
	);

	if( isValid ) {
		if( fn == null ) {
			screenData.touchEventListenersActive = 0;
		} else {
			screenData.touchEventListenersActive -= 1;
			if( screenData.touchEventListenersActive < 0 ) {
				screenData.touchEventListenersActive = 0;
			}
		}
	}
}

qbs._.addCommand( "setPinchZoom", setPinchZoom, false, false,
	[ "isEnabled" ]
);
qbs._.addSetting( "pinchZoom", setPinchZoom, false, [ "isEnabled" ] );
function setPinchZoom( args ) {
	var isEnabled;

	isEnabled = !!( args[ 0 ] );

	if( isEnabled ) {
		document.body.style.touchAction = "";
	} else {
		document.body.style.touchAction = "none";
	}
}

// End of File Encapsulation
} )();
