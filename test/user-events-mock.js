/*
* File: user-events-mock.js
*/

var m_commandScripts = [];
var m_scriptIndex = 0;
var m_commandScriptsTimeout;
var g_page;
var g_resolve;

const test = function ( commandString, page ) {
	var regString, reg, commands, conflicts;

	m_commandScripts = [];
	m_scriptIndex = 0;
	g_page = page;

	// Remove spaces and convert to upper case
	commandString = commandString.split( /\s+/ ).join( "" );

	// Remove potential conflicts
	conflicts = removeQuotes( commandString );
	commandString = conflicts.str.toUpperCase();

	// Regex String
	regString = "(?=" +
		"MD|" +
		"MV\\d+\\,\\d+|" +
		"MV\\d+\\,\\d+,\\d+|" +
		"MU|" +
		"TS|" +
		"TV\d+\\,\\d+|" +
		"TE|" +
		"KD\\d+|" +
		"KU\\d+|" +
		"KP\\d+|" +
		"KT\\d+|" +
		"DL\\d+|" +
		"SL\\d+" +
	")";

	reg = new RegExp( regString );

	// Split the commands
	commands = commandString.split( reg );

	processCommands( commands, conflicts.data );

	//console.log( commands );

	m_commandScripts.push( {
		"commands": commands,
		"delay": 100,
		"index": 0,
		"target": "",
		"mouse": {
			"clientX": 0,
			"clientY": 0,
			"buttons": 0
		}
	} );

	if( m_commandScriptsTimeout ) {
		clearTimeout( m_commandScriptsTimeout );
	}
	m_commandScriptsTimeout = setTimeout( runCommandScripts, 100 );

	return new Promise( function( resolve, reject ) {
		g_resolve = resolve;
	} );
};

function processCommands( commands, conflictData ) {
	var i, cmd, data, conflictItems;

	conflictItems = [ "KD", "KU", "KP", "KT", "SL" ];
	for( i = 0; i < commands.length; i++ ) {
		cmd = commands[ i ].substring( 0, 2 );
		data = commands[ i ].substr( 2 ).split( "," );

		if( data.length !== undefined && data.length === 1 ) {
			data = data[ 0 ];
		}

		// Grab the data from the conflictData
		if( conflictItems.indexOf( cmd ) > -1 ) {
			data = conflictData[ parseInt( data ) ];
		}

		// Update the command item
		commands[ i ] = {
			"cmd": cmd,
			"data": data
		};
	}
}

function removeQuotes( commandString ) {
	var quotes, start, end;

	// TODO - allow for escaped quotes
	// TODO - Error handling for uneven quotes

	quotes = [];
	start = commandString.indexOf( "\"" );
	while( start !== -1 ) {
		end = commandString.indexOf( "\"", start + 1 );

		// Sanity check
		if( start >= end || end === -1 ) {
			console.error( "Something wrong here!" );
			return;
		}

		// Add to the quotes array
		quotes.push( commandString.substring( start + 1, end ) );

		// Remove the quoted item from the string
		commandString = commandString.substring( 0, start ) +
			( quotes.length - 1 ) + commandString.substring( end + 1 );

		// Find the next quote
		start = commandString.indexOf( "\"" );
	}

	return {
		"data": quotes,
		"str": commandString
	};
}

// Run the command scripts
function runCommandScripts() {
	var commandScript;
	//console.log( "Running Script" );
	//console.log( m_scriptIndex );

	if( m_scriptIndex < m_commandScripts.length ) {
		commandScript = m_commandScripts[ m_scriptIndex ];

		// If a delay of 0, loop without setting a timeout
		do {
			runCommand( commandScript );
		} while(
			commandScript.delay === 0 &&
			commandScript.index < commandScript.commands.length
		);

		//console.log( commandScript.index, commandScript.commands.length );

		// If the script is not completed set a timeout
		if( commandScript.index < commandScript.commands.length ) {

			//console.log( "Running next script" );
			setTimeout( runCommandScripts, commandScript.delay );

		} else {
			//console.log( "Script completed" );
			g_resolve( "Completed" );
		}
	} else {
		//console.log( "Events Completed" );
		g_resolve( "Completed" );
	}
}

async function runCommand( commandScript ) {
	var command;

	//console.log( "Running Command" );
	//console.log( commandScript.index );

	// Stop if completed script
	if( commandScript.index >= commandScript.commands.length ) {
		commandScript.delay = 0;
		return;
	}

	command = commandScript.commands[ commandScript.index ];
	//console.log( command.cmd );

	switch( command.cmd ) {
		case "DL":
			commandScript.delay = parseInt( command.data );
			break;
		case "SL":
			commandScript.target = command.data;
			break;
		case "MV":
			if( command.data.length === 3 ) {
				addSteps( commandScript, command );
			} else {
				commandScript.mouse.clientX = parseInt( command.data[ 0 ] );
				commandScript.mouse.clientY = parseInt( command.data[ 1 ] );
				await g_page.mouse.move(
					commandScript.mouse.clientX,
					commandScript.mouse.clientY
				);
			}
			break;
		case "MD":
			commandScript.mouse.buttons = 1;
			await g_page.mouse.down();
			break;
		case "MU":
			commandScript.mouse.buttons = 0;
			await g_page.mouse.up();
			break;
		case "KT":
			//console.log( "Typing: " + command.data );
			await g_page.keyboard.type( command.data );
			break;
		case "KD":
			await g_page.keyboard.down( command.data );
			break;
		case "KU":
			await g_page.keyboard.up( command.data );
			break;
		case "KP":
			//console.log( "KeyPress: " + command.data );
			await g_page.keyboard.press( command.data );
			break;
	}

	commandScript.index += 1;
}

function addSteps( commandScript, command ) {
	var i, steps, x1, y1, x2, y2, dx, dy;

	x2 = command.data[ 0 ];
	y2 = command.data[ 1 ];
	steps = command.data[ 2 ];
	x1 = commandScript.mouse.clientX;
	y1 = commandScript.mouse.clientY;
	dx = ( x2 - x1 ) / steps;
	dy = ( y2 - y1 ) / steps;

	for( i = 0; i < steps - 1; i++ ) {
		x1 += dx;
		y1 += dy;
		commandScript.commands.splice( commandScript.index + i, 0, {
			"cmd": command.cmd,
			"data": [ Math.round( x1 ), Math.round( y1 ) ]
		} );
	}

	commandScript.commands.splice( commandScript.index + i, 0, {
		"cmd": command.cmd,
		"data": [ Math.round( x2 ), Math.round( y2 ) ]
	} );
}

function dispatchMouseEvent( target, name, data ) {
	var event, rect, customData;

	rect = target.getBoundingClientRect();

	customData = {
		"clientX": rect.left + data.clientX,
		"clientY": rect.top + data.clientY,
		"buttons": data.buttons
	};

	//console.log( "Dispatching Event" );
	//console.log( name, customData );

	event = new MouseEvent( name, customData );
	target.dispatchEvent( event );
}

module.exports = test;
