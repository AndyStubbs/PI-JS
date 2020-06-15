/*
* File: qbs-sound.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var m_audioPools, m_nextAudioId, m_audioContext, m_qbData;

m_qbData = qbs._.data;
m_audioPools = {};
m_nextAudioId = 0;

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
	m_audioPools[ m_nextAudioId ] = audioItem;

	// Increment the last audio id
	m_nextAudioId += 1;

	// Return the id
	return m_nextAudioId - 1;
}

// Delete's the audio pool
qbs._.addCommand( "deleteSound", deleteSound, false, false, [ "audioId" ] );
function deleteSound( args ) {
	var audioId, i;

	audioId = args[ 0 ];

	// Validate parameters
	if( m_audioPools[ audioId ] ) {

		// Stop all the players
		for( i = 0; i < m_audioPools[audioId].pool.length; i++ ) {
			m_audioPools[ audioId ].pool[ i ].pause();
		}

		// Delete the audio item from the pools
		delete m_audioPools[ audioId ];
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
	if( m_audioPools[ audioId ] ) {

		// Get the audio item
		audioItem = m_audioPools[ audioId ];

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

// Plays a sound by frequency
qbs._.addCommand( "sound", sound, false, false, [
	"frequency", "duration", "volume", "oType", "delay", "attack", "decay"
] );
function sound( args ) {
	var frequency, duration, volume, oType, delay, attack, decay, stopTime,
		types, waveTables, i, j, k;

	frequency = args[ 0 ];
	duration = args[ 1 ];
	volume = args[ 2 ];
	oType = args[ 3 ];
	delay = args[ 4 ];
	attack = args[ 5 ];
	decay = args[ 6 ];

	// Validate frequency
	if( ! qbs.util.isInteger( frequency ) ) {
		console.error( "sound: frequency needs to be an integer." );
		return;
	}

	// Validate duration
	if( duration == null ) {
		duration = 1;
	}

	if( isNaN( duration ) || duration < 0 ) {
		console.error(
			"sound: duration needs to be a number equal to or greater than 0."
		);
		return;
	}

	// Validate volume
	if( volume == null ) {
		volume = 0.75;
	}

	if( isNaN( volume ) || volume < 0 || volume > 1 ) {
		console.error( "sound: volume needs to be a number between 0 and 1." );
		return;
	}

	// Validate attack
	if( attack == null ) {
		attack = 0;
	}

	if( isNaN( attack ) || attack < 0 ) {
		console.error(
			"sound: attack needs to be a number equal to or greater than 0."
		);
		return;
	}

	// Validate delay
	if( delay == null ) {
		delay = 0;
	}

	if( isNaN( delay ) || delay < 0 ) {
		console.error(
			"sound: delay needs to be a number equal to or greater than 0."
		);
		return;
	}

	// Validate decay
	if( decay == null ) {
		decay = 0.1;
	}

	if( isNaN( decay ) ) {
		console.error( "sound: decay needs to be a number." );
		return;
	}

	// Validate oType
	if( oType == null ) {
		oType = "triangle";
	}

	// Check for custom oType
	if( qbs.util.isArray( oType ) ) {
		if(
			oType.length !== 2 || 
			! qbs.util.isArray( oType[ 0 ] ) || 
			! qbs.util.isArray( oType[ 1 ] ) ||
			oType[ 0 ].length === 0 ||
			oType[ 1 ].length === 0 ||
			oType[ 0 ].length != oType[ 1 ].length
		) {
			console.error(
				"sound: oType array must be an array with two non empty " +
				"arrays of equal length."
			);
			return;
		}

		// Look for invalid waveTable values
		for( i = 0; i < oType.length; i++ ) {
			for( j = 0; j < oType[ i ].length; j++ ) {
				for( k = 0; k < oType[ i ][ j ].length; k++ ) {
					if( isNaN( oType[ i ][ j ][ k ] ) ) {
						console.error(
							"sound: oType array must only contain numbers."
						);
						return;
					}
				}
			}
		}

		waveTables = oType;
		oType = "custom";
	} else {

		if( typeof oType !== "string" ) {
			console.error( "sound: oType needs to be a string or an array." );
			return;
		}

		// Non-custom types
		types = [
			"triangle", "sine", "square", "sawtooth"
		];

		if( types.indexOf( oType ) === -1 ) {
			console.error(
				"sound: oType is not a valid type. oType must be " +
				"one of the following: triangle, sine, square, sawtooth."
			);
			return;
		}
	}

	// Create an audio context if none exist
	if( ! m_audioContext ) {
		m_audioContext = new AudioContext();
	}

	// Calculate the volume
	volume = m_qbData.volume * volume;

	// Calculate the stopTime
	stopTime = attack + duration + decay;

	m_qbData.commands.createSound(
		"sound", m_audioContext, frequency, volume, attack, duration,
		decay, stopTime, oType, waveTables, delay
	);
}

// Internal create sound command
qbs._.addCommand( "createSound", createSound, true, false, [] );
function createSound(
	cmdName, audioContext, frequency, volume, attackTime, sustainTime,
	decayTime, stopTime, oType, waveTables, delay
) {
	var oscillator, envelope, wave, real, imag, currentTime;

	oscillator = audioContext.createOscillator();
	envelope = audioContext.createGain();

	oscillator.frequency.value = frequency;
	if( oType === "custom" ) {
		real = waveTables[ 0 ];
			imag = waveTables[ 1 ];
			wave = audioContext.createPeriodicWave( real, imag );
			oscillator.setPeriodicWave( wave );
	} else {
		oscillator.type = oType;
	}

	if( attackTime === 0 ) {
		envelope.gain.value = 1 * volume;
	} else {
		envelope.gain.value = 0;
	}

	oscillator.connect( envelope);
	envelope.connect( audioContext.destination );
	// console.log( context.currentTime );

	try {

		currentTime = audioContext.currentTime + delay;

		// Set the attack
		if( attackTime > 0 ) {
			envelope.gain.setValueCurveAtTime(
				[ 0, 1 * volume ],
				currentTime,
				attackTime
			);

			// Add value to current time to prevent overlap of time curves
			currentTime += 0.000000001;
		}

		// Set the sustain
		if( sustainTime > 0 ) {
			envelope.gain.setValueCurveAtTime(
				[ 1 * volume, 0.8 * volume ],
				currentTime + attackTime,
				sustainTime
			);

			// Add value to current time to prevent overlap of time curves
			currentTime += 0.000000001;
		}

		// Set the decay
		if( decayTime > 0 ) {
			envelope.gain.setValueCurveAtTime(
				[ 0.8 * volume, 0.1 * volume, 0 ],
				currentTime + sustainTime + attackTime,
				decayTime
			);
		}

		oscillator.start( currentTime );
		oscillator.stop( currentTime + stopTime );

	} catch( ex ) {
		console.log( cmdName, ex );
	}
}

// End of File Encapsulation
} )();
