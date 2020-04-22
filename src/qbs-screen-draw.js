/*
* File: qbs-screen-images.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var qbData;

qbData = qbs._.data;

qbs._.addCommand( "draw", draw, false, true );
function draw( screenData, inArgs ) {

	var drawCommands, tempColors, i, reg, parts, isReturn, lastCursor,
		isBlind, isArc, args, color, len, angle, color1, radius, angle1,
		angle2;

	drawCommands = inArgs[ 0 ];

	//Conver to uppercase
	drawCommands = drawCommands.toUpperCase();

	//Get colors
	tempColors = drawCommands.match( /(#[A-Z0-9]+)/g );
	if( tempColors ) {
		for( i = 0; i < tempColors.length; i++ ) {
			drawCommands = drawCommands.replace( "C" + tempColors[ i ], "O" + i );
		}
	}

	//Convert TA to T
	drawCommands = drawCommands.replace( /(TA)/gi, "T" );

	//Convert the commands to uppercase and remove spaces
	drawCommands = drawCommands.split( /\s+/ ).join( "" );

	//Regular expression for the draw commands
	reg = /(?=C|C#|R|B|F|G|L|A|T|D|G|H|U|E|N|M|P|S)/;

	//var reg = /(?=C\d+|R\d+|B+|F\d+|G\d+|L\d+|A\d+|TA\d+|D\d+|G\d+|H\d+|U\d+|E\d+|N+|M\d+,\d+|P\d+,\d+)/;

	//Run the regular expression and split into seperate commands
	parts = drawCommands.split( reg );

	//Start drawing
	//qbsg.start_path( true );

	//This triggers a move back after drawing the next command
	isReturn = false;

	//Store the last cursor
	lastCursor = { x: screenData.x, y: screenData.y, angle: 0 };

	//Move without drawing
	isBlind = false;

	isArc = false;

	for( i = 0; i < parts.length; i++ ) {
		args = parts[ i ].split( /(\d+)/ );

		switch( args[ 0 ] ) {

			//C - Change Color
			case "C":
				color = Number( args[ 1 ] );

				screenData.screenObj.color( color );
				isBlind = true;
				break;

			case "O":
				color = tempColors[ args[ 1 ] ];
				screenData.screenObj.color( color );
				isBlind = true;
				break;

			//D - Down
			case "D":
				len = getInt( args[ 1 ], 1 );
				angle = qbs.util.degreesToRadian( 90 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//E - Up and Right
			case "E":
				len = getInt( args[ 1 ], 1 );
				len = Math.sqrt( len * len + len * len );
				angle = qbs.util.degreesToRadian( 315 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//F - Down and Right
			case "F":
				len = getInt(  args[ 1 ], 1 );
				len = Math.sqrt( len * len + len * len );
				angle = qbs.util.degreesToRadian( 45 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//G - Down and Left
			case "G":
				len = getInt( args[ 1 ], 1 );
				len = Math.sqrt( len * len + len * len );
				angle = qbs.util.degreesToRadian( 135 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//H - Up and Left
			case "H":
				len = getInt( args[ 1 ], 1 );
				len = Math.sqrt( len * len + len * len );
				angle = qbs.util.degreesToRadian( 225 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//L - Left
			case "L":
				len = getInt( args[ 1 ], 1 );
				angle = qbs.util.degreesToRadian( 180 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//R - Right
			case "R":
				len = getInt( args[ 1 ], 1 );
				angle = qbs.util.degreesToRadian( 0 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//U - Up
			case "U":
				len = getInt( args[ 1 ], 1 );
				angle = qbs.util.degreesToRadian( 270 ) + screenData.angle;
				screenData.x += Math.round( Math.cos( angle ) * len );
				screenData.y += Math.round( Math.sin( angle ) * len );
				break;

			//P - Paint
			case "P":
			case "S":
				color1 = getInt( args[ 1 ], 0 );

				screenData.screenObj.paint( screenData.x, screenData.y, color1, args[ 0 ] === "S" );
				isBlind = true;
				break;

			//A - Arc Line
			case "A":
				radius = getInt( args[ 1 ], 1 );
				angle1 = getInt( args[ 3 ], 1 );
				angle2 = getInt( args[ 5 ], 1 );
				isArc = true;
				break;

			//TA - T - Turn Angle
			case "T":
				screenData.angle = qbs.util.degreesToRadian( getInt( args[ 1 ], 1 ) );
				isBlind = true;
				break;

			//M - Move
			case "M":
				screenData.x = getInt( args[ 1 ], 1 );
				screenData.y = getInt( args[ 3 ], 1 );
				isBlind = true;
				break;

			default:
				isBlind = true;
		}
		if( ! isBlind ) {
			if( isArc ) {
				screenData.screenObj.arc( screenData.x, screenData.y, radius, angle1, angle2 );
			} else {
				screenData.screenObj.line( lastCursor.x, lastCursor.y, screenData.x, screenData.y );
			}
		}
		isBlind = false;
		isArc = false;
		if( isReturn ) {
			isReturn = false;
			screenData.x = lastCursor.x;
			screenData.y = lastCursor.y;
			screenData.angle = lastCursor.angle;
		}
		if( args[ 0 ] === "N" ) {
			isReturn = true;
		} else {
			lastCursor = { x: screenData.x, y: screenData.y, angle: screenData.angle };
		}

		if( args[ 0 ] === "B" ) {
			isBlind = true;
		}
	}
}

function getInt( val, val_default ) {
	val = parseInt( val );
	if( isNaN( val ) ) {
		val = val_default;
	}
	return val;
}

// End of File Encapsulation
} )();
