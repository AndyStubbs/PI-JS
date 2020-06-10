/*
* File: qbs-sound.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var audioPools, nextAudioId, audioContext, qbData;

qbData = qbs._.data;
audioPools = {};
nextAudioId = 0;

// Loads a sound
qbs._.addCommand( "loadSound", loadSound, false, false, [ "src", "poolSize" ] );
function loadSound( args ) {
	var src, poolSize, i, audioItem;

	src = args[ 0 ];
	poolSize = args[ 1 ];

	// Validate parameters
	if( ! src ) {
		console.error( "loadSound: No sound source provided." );
		return;
	}
	if( poolSize === undefined || isNaN( poolSize ) ) {
		poolSize = 1;
	}

	// Create the audio item
	audioItem = {
		"pool": [],
		"index": 0
	};

	// Create the audio pool
	for( i = 0; i < poolSize; i++ ) {
		audioItem.pool.push( new Audio( src ) );
	}

	// Add the audio item too the global object
	audioPools[ nextAudioId ] = audioItem;

	// Increment the last audio id
	nextAudioId += 1;

	// Return the id
	return nextAudioId - 1;
}

// Delete's the audio pool
qbs._.addCommand( "deleteSound", deleteSound, false, false, [ "audioId" ] );
function deleteSound( args ) {
	var audioId, i;

	audioId = args[ 0 ];

	// Validate parameters
	if( audioPools[ audioId ] ) {

		// Stop all the players
		for( i = 0; i < audioPools[audioId].pool.length; i++ ) {
			audioPools[ audioId ].pool[ i ].pause();
		}

		// Delete the audio item from the pools
		delete audioPools[ audioId ];
	} else {
		console.error( "deleteSound: " + audioId + " not found." );
	}
}

// Plays a sound from an audio id
qbs._.addCommand( "playSound", playSound, false, false, [ "audioId" ] );
function playSound( args ) {
	var audioId, audioItem;

	audioId = args[ 0 ];

	// Validate parameters
	if( audioPools[ audioId ] ) {

		// Get the audio item
		audioItem = audioPools[ audioId ];

		// Play the sound
		audioItem.pool[ audioItem.index ].play();

		// Increment to next sound in the pool
		audioItem.index += 1;
		if( audioItem.index >= audioItem.pool.length ) {
			audioItem.index = 0;
		}
	} else {
		console.error( "play: " + audioId + " not found." );
	}
}

qbs._.addCommand( "sound", sound, false, false, [
	"frequency", "duration", "decay", "type", "delay"
] );
function sound( args ) {
	var frequency, duration, decay, type, oscillator, envelope, volume, 
	delay, types;

	frequency = args[ 0 ];
	duration = args[ 1 ];
	decay = args[ 2 ];
	type = args[ 3 ];
	delay = args[ 4 ];

	if( ! qbs.util.isInteger( frequency ) ) {
		console.error( "sound: frequency needs to be an integer." );
		return;
	}

	if( isNaN( duration ) ) {
		console.error( "sound: duration needs to be a number." );
		return;
	}

	if( decay == null ) {
		decay = 0.1;
	}

	if( isNaN( decay ) ) {
		console.error( "sound: decay needs to be a number." );
		return;
	}

	if( type == null ) {
		type = "triangle";
	}

	if( typeof type !== "string" ) {
		console.error( "sound: type needs to be a string." );
		return;
	}

	types = [
		"triangle", "sine", "square"
	];

	if( types.indexOf( type ) === -1 ) {
		console.error( "sound: type is not a valid type." );
		return;
	}

	if( delay == null ) {
		delay = 0;
	}

	if( isNaN( delay ) ) {
		console.error( "sound: delay needs to be a number." );
		return;
	}

	if( ! audioContext ) {
		audioContext = new AudioContext();
	}

	volume = qbData.volume;
	oscillator = audioContext.createOscillator();
	envelope = audioContext.createGain();
	oscillator.frequency.value = frequency;
	oscillator.type = type;
	envelope.gain.value = 1 * volume;
	
	oscillator.connect( envelope);
	envelope.connect( audioContext.destination );
	// console.log( audioContext.currentTime );
	try {
		if( decay > 0 ) {
			envelope.gain.setValueCurveAtTime(
				[ 1 * volume, 0.8 * volume ],
				audioContext.currentTime + delay,
				duration
			);
			envelope.gain.setValueCurveAtTime(
				[ 0.8 * volume, 0.1 * volume, 0 ],
				audioContext.currentTime + duration + delay,
				decay
			);
		}
	} catch( ex ) {
		console.log( ex );
	}
	oscillator.start( audioContext.currentTime + delay );
	oscillator.stop( audioContext.currentTime + duration + decay + delay);
}

// End of File Encapsulation
} )();
