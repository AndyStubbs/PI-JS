/*
* File: qbs-screen-touch.js
*/

// Start of File Encapsulation
( function () {

var qbData;

qbData = qbs._.data;

function intouch() {
	var touchData, i;
	touchData = {};
	touchData.touches = qbs.util.convertToArray( qbData.screenData.touches );
	touchData.screens = {};
	for( i in qbData.screens ) {
		if( qbData.screens[ i ].touches ) {
			touchData.screens[ qbData.screens[ i ].id ] = {
				"touches": qbs.util.convertToArray( qbData.screens[ i ].touches )
			};
		}
	}
	return touchData;
}

function touchStart( e ) {
	updateTouch( e );
	qbData.commands.triggerEventListeners( "start", intouch(), onTouchEventListeners );
}

function touchMove( e ) {
	updateTouch( e );
	qbData.commands.triggerEventListeners( "move", intouch(), onTouchEventListeners );
}

function touchEnd( e ) {
	updateTouch( e );
	qbData.commands.triggerEventListeners( "end", intouch(), onTouchEventListeners );
}

function updateTouch( e ) {
	var i, screen, rect, j, touch, touchData, newTouches;

	for( i in qbData.screens ) {
		screen = qbData.screens[ i ];
		if( qbData.screens[ i ].clientRect ) {
			newTouches = {};
			rect = screen.clientRect;
			for( j = 0; j < e.touches.length; j++ ) {
				touch = e.touches[ j ];
				touchData = {};
				touchData.x = Math.floor( ( touch.pageX - rect.left ) / rect.width * screen.width );
				touchData.y = Math.floor( ( touch.pageY - rect.top ) / rect.height * screen.height );
				touchData.id = touch.identifier;
				if( screen.touches[ touchData.id ] ) {
					touchData.lastX = screen.touches[ touchData.id ].x;
					touchData.lastY = screen.touches[ touchData.id ].y;
				} else {
					touchData.lastX = null;
					touchData.lastY = null;
				}
				newTouches[ touchData.id ] = touchData;
			}
			screen.touches = newTouches;
		}
	}
}

// Adds an event trigger for a mouse event
function ontouch( mode, fn, once, hitBox ) {
	qbData.commands.onevent( mode, fn, once, hitBox, "start", "end", "move", "ontouch", offtouch, onTouchEventListeners );
}

// Removes an event trigger for a touch event
function offtouch( mode, fn ) {
	offevent( mode, fn, "start", "end", "move", "offtouch", onTouchEventListeners );
}

function setPinchZoom( isEnabled ) {
	if( isEnabled ) {
		document.body.style.touchAction = "";
	} else {
		document.body.style.touchAction = "none";
	}
}

window.addEventListener( "touchstart", touchStart );
window.addEventListener( "touchmove", touchMove );
window.addEventListener( "touchend", touchEnd );
window.addEventListener( "touchcancel", touchEnd );

// Add external commands
qbs._.addCommand( "intouch", intouch, true );
qbs._.addCommand( "ontouch", ontouch, true );
qbs._.addCommand( "setPinchZoom", setPinchZoom, false );

// End of File Encapsulation
} )();
