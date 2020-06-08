/*
* File: qbs-screen-images.js
*/

// Start of File Encapsulation
( function () {

	"use strict";
	
	var qbData, tracks, notesData, allNotes;

	qbData = qbs._.data;

	notesData = {
		"A": [ 27.50, 55.00,
			110, 220, 440, 880, 1760, 3520, 7040, 14080
		],
		"A#": [ 29.14, 58.27,
			116.541, 233.082, 466.164, 932.328, 1864.655, 3729.31, 7458.62,
			14917.24
		],
		"B": [ 30.87, 61.74,
			123.471, 246.942, 493.883, 987.767, 1975.533, 3951.066, 7902.132,
			15804.264
		],
		"C": [ 16.35, 32.70, 
			65.41, 130.813, 261.626, 523.251, 1046.502, 2093.005, 4186.009,
			8372.018
		],
		"C#": [ 17.32, 34.65,
			69.296, 138.591, 277.183, 554.365, 1108.731, 2217.461, 4434.922,
			8869.844
		],
		"D": [ 18.35, 36.71,
			73.416, 146.832, 293.665, 587.33, 1174.659, 2349.318, 4698.636,
			9397.272
		],
		"D#": [ 19.45, 38.89, 
			77.782, 155.563, 311.127, 622.254, 1244.508, 2489.016, 4978.032,
			9956.064
		],
		"E": [ 20.60, 41.20,
			82.407, 164.814, 329.628, 659.255, 1318.51, 2637.021, 5274.042,
			10548.084
		],
		"F": [ 21.83, 43.65,
			87.307, 174.614, 349.228, 698.456, 1396.913, 2793.826, 5587.652,
			11175.304
		],
		"F#": [ 23.12, 46.25,
			92.499, 184.997, 369.994, 739.989, 1479.978, 2959.955, 5919.91,
			11839.82
		],
		"G": [ 24.50, 49.00,
			97.999, 195.998, 391.995, 783.991, 1567.982, 3135.964, 6271.928,
			12543.856
		],
		"G#": [ 25.96, 51.91,
			103.826, 207.652, 415.305, 830.609, 1661.219, 3322.438,
			6644.876, 13289.752
		]
	};
	allNotes = [
		0, 16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50,
		29.14, 30.87, 32.70, 34.65, 36.71, 38.89, 41.20, 43.65, 46.25, 49.00,
		51.91, 55.00, 58.27, 61.74,
		65.406, 69.296, 73.416, 77.782, 82.407, 87.307, 92.499, 97.999,
		103.826, 110, 116.541, 123.471, 130.813, 138.591, 146.832, 155.563,
		164.814, 174.614, 184.997, 195.998, 207.652, 220, 233.082, 246.942,
		261.626, 277.183, 293.665, 311.127, 329.628, 349.228, 369.994, 391.995,
		415.305, 440, 466.164, 493.883, 523.251, 554.365, 587.33, 622.254,
		659.255, 698.456, 739.989, 783.991, 830.609, 880, 932.328, 987.767,
		1046.502, 1108.731, 1174.659, 1244.508, 1318.51, 1396.913, 1479.978,
		1567.982, 1661.219, 1760, 1864.655, 1975.533, 2093.005, 2217.461,
		2349.318, 2489.016, 2637.021, 2793.826, 2959.955, 3135.964, 3322.438,
		3520, 3729.31, 3951.066, 4186.009, 4434.922, 4698.636, 4978.032,
		5274.042, 5587.652, 5919.91, 6271.928, 6644.876, 7040, 7458.62,
		7902.132, 8372.018, 8869.844, 9397.272, 9956.064, 10548.084, 11175.304,
		11839.82, 13289.752, 14080, 14917.24, 15804.264
	];
	tracks = [];

	qbs._.addCommand( "play", play, false, false, [ "playString" ] );
	function play( args ) {
	
		var playString, reg, playStringParts, i, trackId;
	
		playString = args[ 0 ];

		if( typeof playString !== "string" ) {
			console.error( "play: playString needs to be a string." );
			return;
		}

		// Convert the commands to uppercase and remove spaces
		playString = playString.split( /\s+/ ).join( "" ).toUpperCase();

		// Regular expression for the draw commands
		reg = /(?=Q\d|O\d|\<|\>|N\d\d?|L\d\d?|MS|MN|ML|P\d|T\d|[[A|B|C|D|E|F|G][\d]?[\+|\-|\#|\.\.?]?)/;
		playStringParts = playString.split( reg );
		console.log( playStringParts );

		tracks.push( {
			"audioContext": new AudioContext(),
			"notes": [],
			"noteId": 0,
			"decay": 0.5,
			"extra": 1,
			"space": "normal",
			"interval": 0,
			"tempo": 60 / 120,
			"noteLength": 0.25,
			"pace": 0.875,
			"octave": 4,
			"octaveExtra": 0,
			"timeout": null
		} );
		trackId = tracks.length - 1;
		for( i = 0; i < playStringParts.length; i++ ) {
			tracks[ trackId ].notes.push(
				playStringParts[ i ].split( /(\d+)/ )
			);
		}
		playTrack( trackId );
	}

	qbs._.addCommand( "playStop", playStop, false, false, [ "" ] );
	function playStop( args ) {
		var i;
		for( i = 0; i < tracks.length; i++ ) {
			clearTimeout( tracks[ i ].timeout );
		}
		tracks = [];
	}

	function playTrack( trackId ) {
		var track, cmd, note, frequency, val, wait;

		frequency = 0;
		track = tracks[ trackId ];
		if( track.noteId >= track.notes.length ) {
			return;
		}
		cmd = track.notes[ track.noteId ];
		wait = false;
		track.extra = 0;
		switch( cmd[ 0 ].charAt( 0 ) ) {
			case "Q":
				val = getInt( cmd[ 1 ], 0 );
				track.octaveExtra = val;
				break;
			case "A": 
			case "B":
			case "C":
			case "D":
			case "E":
			case "F":
			case "G":
				note = cmd[ 0 ];
				note = note.replace( /\+/g, "#" );
				note = note.replace( /\-/g, "" );

				// Check for extra note length
				if( cmd.indexOf( ".." ) > 0 ) {
					track.extra = 1.75 * track.noteLength;
				} else if( cmd.indexOf( "." ) > 0 ) {
					track.extra = 1.5 * track.noteLength;
				}

				// Remove dot's from note
				note = note.replace( /\./g, "" );

				// Get the note frequency
				if( notesData[ note ] ) {
					frequency = notesData[ note ][ track.octave + track.octaveExtra ];
				}

				// Check if note length included
				if( cmd.length > 1 && cmd[ 1 ].indexOf( "." ) === -1 ) {
					val = getInt( cmd[ 1 ], 1 );
					track.extra = getNoteLength( val );
				}

				wait = true;
				break;
			case "N":
				val = getInt( cmd[ 1 ], 0 );
				if( val >= 0 && val < allNotes.length ) {
					frequency = allNotes[ val ];
				}
				wait = true;
				break;
			case "O":
				val = getInt( cmd[ 1 ], 4 );
				if( val >= 0 && val + track.octaveExtra < notesData[ "A" ].length ) {
					track.octave = val;
				}
				break;
			case ">":
				track.octave += 1;
				if( track.octave + track.octaveExtra >= notesData[ "A" ].length ) {
					track.octave = notesData[ "A" ].length - 1;
				}
				break;
			case "<":
				track.octave -= 1;
				if( track.octave < 0 ) {
					track.octave = 0;
				}
				break;
			case "L":
				val = getInt( cmd[ 1 ], 1 );
				track.noteLength = getNoteLength( val );
				break;
			case "T":
				val = getInt( cmd[ 1 ], 120 );
				if( val >= 32 && val < 256 ) {
					track.tempo = 60 / val;
				}
				break;
			case "M":
				if( cmd[ 0 ].length > 1 ) {

					if( cmd[ 0 ].charAt( 1 ) === "S" ) {

						// Staccato
						track.pace = 0.75;

					} else if( cmd[ 0 ].charAt( 1 ) === "N" ) {

						// Normal
						track.pace = 0.875;

					} else if( cmd[ 0 ].charAt( 1 ) === "L" ) {

						// Legato
						track.pace = 1;

					}
				}
				break;
			case "P":
				wait = true;
				val = getInt( cmd[ 1 ], 1 );
				track.extra = getNoteLength( val );
				break;
		}

		// Calculate when to play the next note
		if( track.extra > 0 ) {
			track.interval = track.tempo * track.extra * track.pace * 4;
		} else {
			track.interval = track.tempo * track.noteLength * track.pace * 4;
		}

		// If it's a note then play it
		if( frequency > 0 ) {
			playNote( track, frequency );
		}

		// Move to the next instruction
		track.noteId += 1;

		// Check if we are done playing track
		if( track.noteId < track.notes.length ) {
			if( wait ) {
				track.timeout = setTimeout( function () {
					playTrack( trackId );
				}, ( track.interval ) * 1000 );
			} else {
				playTrack( trackId );
			}
		}
	}

	function getNoteLength( val ) {
		if( val >= 1 && val < 65 ) {
			return 1 / val;
		}
		return 0.875;
	}

	function playNote( track, frequency ) {
		var context, oscillator, envelope, duration, decayRate;

		context = track.audioContext;
		oscillator = context.createOscillator();
		envelope = context.createGain();
		duration = track.interval;
		decayRate = track.interval / 4;
		
		oscillator.frequency.value = frequency;
		oscillator.type = 'triangle';
		envelope.gain.value = 1;
		
		oscillator.connect( envelope);
		envelope.connect( context.destination );
		envelope.gain.setValueCurveAtTime(
			[ 1, 0.8 ],
			context.currentTime,
			duration
		);
		envelope.gain.setValueCurveAtTime(
			[ 0.8, 0.1, 0 ],
			context.currentTime + duration,
			decayRate
		);
		oscillator.start( context.currentTime );
		oscillator.stop( context.currentTime + duration + decayRate );
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
	