/*
* File: qbs-screen-touch.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "startTouch", startTouch, false, true );
function startTouch( screenData ) {
	screenData.canvas.addEventListener( "touchstart", touchStart );
	screenData.canvas.addEventListener( "touchmove", touchMove );
	screenData.canvas.addEventListener( "touchend", touchEnd );
	screenData.canvas.addEventListener( "touchcancel", touchEnd );
}

qbs._.addCommand( "stopTouch", stopTouch, false, true );
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

qbs._.addCommand( "intouch", intouch, false, true );
function intouch( screenData ) {
	var touches;

	touches = qbs.util.convertToArray( screenData.touches );

	return touches;
}

// Adds an event trigger for a mouse event
qbs._.addCommand( "ontouch", ontouch, false, true );
function ontouch( mode, fn, once, hitBox ) {
	qbData.commands.onevent( mode, fn, once, hitBox, "start", "end", "move", "ontouch", offtouch, onTouchEventListeners );
}

// Removes an event trigger for a touch event
function offtouch( mode, fn ) {
	offevent( mode, fn, "start", "end", "move", "offtouch", onTouchEventListeners );
}

qbs._.addCommand( "setPinchZoom", setPinchZoom, false, true );
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
