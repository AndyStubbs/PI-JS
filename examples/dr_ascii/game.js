"use strict";

var Game = ( function () {
	var m = {
		"time": 0,
		
		"player1": {
			"moveX": 0,
			"lastMove": 0,
			"rotate": false,
			"lastRotate": 0,
			"fastFall": 0,
			"lastAnimationFrame": 0,
			"lastAnimationFrame2": 0,
			"nextPill": null
		},
		"player2": {
			"moveX": 0,
			"lastMove": 0,
			"rotate": false,
			"lastRotate": 0,
			"fastFall": 0,
			"lastAnimationFrame": 0,
			"lastAnimationFrame2": 0,
			"nextPill": null
		}
	};

	return {
		"start": start
	};

	function start( settings ) {
		$.clearKeys();
		m.time = performance.now();
		m.player1.lastAnimationFrame = m.time;
		m.player1.lastAnimationFrame2 = m.time;

		setupGameInput();
		getNextPill( m.player1 );
		setupThrowAnimation();
		run( m.time );
	}

	function setupGameInput() {
		$.onkey( "ArrowLeft", "down", function () {
			m.player1.moveX = -1;
		} );
		$.onkey( "ArrowLeft", "up", function () {
			m.player1.moveX = 0;
			m.player1.lastMove = 0;
		} );
		$.onkey( "ArrowRight", "down", function () {
			m.player1.moveX = 1;
		} );
		$.onkey( "ArrowRight", "up", function () {
			m.player1.moveX = 0;
			m.player1.lastMove = 0;
		} );
		$.onkey( "ArrowUp", "down", function () {
			m.player1.rotate = true;
		} );
		$.onkey( "ArrowUp", "up", function () {
			m.player1.rotate = false;
			m.player1.lastRotate = 0;
		} );
		$.onkey( "ArrowDown", "down", function () {
			m.player1.fastFall = true;
		} );
		$.onkey( "ArrowDown", "up", function () {
			m.player1.fastFall = false;
		} );
	}

	function getNextPill( player ) {
		player.nextPill = {
			"x": 15, "y": 7, "c": g.colors[ Math.floor( Math.random() * g.colors.length ) ],
			"baseX": 15, "baseY": 7,
			"id": "(", "last": performance.now(),
			"status": "active", "order": 0, "rotation": 0
		};
		player.nextPill.partner = {
			"x": 16, "y": 7, "c": g.colors[ Math.floor( Math.random() * g.colors.length ) ],
			"id": ")", "last": performance.now(),
			"status": "active", "order": 1
		};
		player.nextPill.partner.partner = player.nextPill;
	}

} )();