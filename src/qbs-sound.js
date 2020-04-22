/*
* File: qbs-sound.js
*/

// Start of File Encapsulation
( function () {

"use strict";

var audioPools, nextAudioId;

audioPools = {};
nextAudioId = 0;

// Loads a sound
qbs._.addCommand( "loadSound", loadSound, false, false );
function loadSound( args ) {
	var src, poolsize, i, audioItem;

	src = args[ 0 ];
	poolsize = args[ 1 ];

	// Validate parameters
	if( ! src ) {
		console.error( "loadSound: No sound source provided." );
		return;
	}
	if( poolsize === undefined || isNaN( poolsize ) ) {
		poolsize = 1;
	}

	// Create the audio item
	audioItem = {
		"pool": [],
		"index": 0
	};

	// Create the audio pool
	for( i = 0; i < poolsize; i++ ) {
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
qbs._.addCommand( "deleteSound", deleteSound, false, false );
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
qbs._.addCommand( "play", play, false, false );
function play( args ) {
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

// End of File Encapsulation
} )();
