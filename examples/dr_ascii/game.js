"use strict";

var Game = ( function () {
	var m = {
		"time": 0,
		"game": {
			"level": 0,
			"speed": 0,
			"virusCount": 0,
			"virusAngle": 0
		},
		"player1": {
			"moveX": 0,
			"lastMove": 0,
			"rotate": false,
			"lastRotate": 0,
			"fastFall": 0,
			"lastAnimationFrame": 0,
			"lastAnimationFrame2": 0,
			"nextPill": null,
			"finishedThrowing": false,
			"score": 0,
			"activePills": [],
			"left": 10,
			"right": 20,
			"floor": 25,
		},
		"player2": {
			"moveX": 0,
			"lastMove": 0,
			"rotate": false,
			"lastRotate": 0,
			"fastFall": 0,
			"lastAnimationFrame": 0,
			"lastAnimationFrame2": 0,
			"nextPill": null,
			"finishedThrowing": false,
			"score": 0,
			"activePills": [],
			"left": 10,
			"right": 20,
			"floor": 25,
		},
		"keys1": {
			"left": "ArrowLeft",
			"up": "ArrowUp",
			"right": "ArrowRight",
			"down": "ArrowDown"
		},
		"keys2": {
			"left": "a",
			"up": "w",
			"right": "d",
			"down": "s"
		}
	};

	return {
		"start": start
	};

	function start( settings ) {
		$.clearKeys();
		$.clearEvents();

		m.game.level = settings.virusLevel;
		m.game.speed = g.speeds[ settings.speedSelected ];
		m.time = performance.now();
		m.player1.lastAnimationFrame = m.time;
		m.player1.lastAnimationFrame2 = m.time;

		setupGameInput( m.player1, m.keys1 );
		getNextPill( m.player1 );
		setupThrowAnimation( m.player1 );
		run( m.time );
	}

	function setupGameInput( player, keys ) {
		$.onkey( keys.left, "down", function () {
			player.moveX = -1;
		} );
		$.onkey( keys.left, "up", function () {
			player.moveX = 0;
			player.lastMove = 0;
		} );
		$.onkey( keys.right, "down", function () {
			player.moveX = 1;
		} );
		$.onkey( keys.right, "up", function () {
			player.moveX = 0;
			player.lastMove = 0;
		} );
		$.onkey( keys.up, "down", function () {
			player.rotate = true;
		} );
		$.onkey( keys.up, "up", function () {
			player.rotate = false;
			player.lastRotate = 0;
		} );
		$.onkey( keys.down, "down", function () {
			player.fastFall = true;
		} );
		$.onkey( keys.down, "up", function () {
			player.fastFall = false;
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

	function setupThrowAnimation( player ) {
		player.animationFrame = g.animations.length - 1;
		player.lastAnimationFrame = performance.now();
		player.throwingPill = true;
		player.finishedThrowing = true;
	}

	function run( timestamp ) {
		let dt = timestamp - m.time;
		m.time = timestamp;
	
		drawGameScreen( timestamp, dt );
		moveGameObjects( timestamp, m.player1 );
		requestAnimationFrame( run );
	}

	function drawGameScreen( timestamp, dt ) {
		var i, virus, pill, virusTypesDrawn, x, y, a, pillData;
	
		$.cls();
	
		//Draw Bottles
		$.setColor( 7 );
		$.print( g.bottle );
	
		// Draw Scores
		$.setColor( 8 );
		$.rect( 4, 22, 65, 43, 17 );
		$.setColor( 7 );
		$.setPos( 0, 3 );
		$.print( " TOP" );
		$.print( " " + $.util.padL( g.top, 7, "0" ) );
		$.print();
		$.print( " SCORE" );
		$.print( " " + $.util.padL( m.player1.score, 7, "0" ) );
	
		// Draw Dr. Ascii
		$.setColor( 7 );
		$.setPos( 22, 3 );
		$.print( "Dr. Ascii" );
		$.print( g.animations[ m.player1.animationFrame ] );
	
		// Draw Next Pill
		if( m.player1.finishedThrowing ) {
			pillData = g.animationPills[ m.player1.animationFrame ]; 
			$.setColor( m.player1.nextPill.c );
			$.setPos( pillData[ 0 ][ 0 ], pillData[ 0 ][ 1 ] );
			$.print( pillData[ 0 ][ 2 ] );
			$.setColor( m.player1.nextPill.partner.c );
			$.setPos( pillData[ 1 ][ 0 ], pillData[ 1 ][ 1 ] );
			$.print( pillData[ 1 ][ 2 ] );
		}
	
		// Draw Stats
		$.setColor( 8 );
		$.rect( 186, 116, 54, 88, 17 );
	
		// Print Level
		$.setColor( 7 );
		$.setPos( 24, 16 );
		$.print( "LEVEL" );
		$.setPos( 27, 17 );
		$.print( $.util.padL( m.game.level, 2, "0" ) );
	
		// Print Speed
		$.setPos( 24, 19 );
		$.print( "SPEED" );
		$.setPos( 26, 20 );
		$.print( g.speedNames[ m.game.speed ] );
	
		// Print Virus Count
		$.setPos( 24, 22 );
		$.print( "Virus" );
		$.setPos( 27, 23 );
		$.print( $.util.padL( m.game.virusCount, 2, "0" ) );
	
		// Draw Big Viruses
		$.setColor( 8 );
		$.circle( 35, 150, 33, 17 );
		virusTypesDrawn = {};
		a = m.game.virusAngle;
		for( i in m.player1.viruses ) {
			virus = m.player1.viruses[ i ];
			if( ! virusTypesDrawn[ virus.id ] ) {
				g.screens[ 1 ].cls();
				g.screens[ 1 ].setColor( virus.c );
				g.screens[ 1 ].print(  m.player1.viruses[ virus.id ].charAt( virus.frame ) );
				g.screens[ 1 ].render();
				x = Math.cos( a ) * 17 + 37;
				y = Math.sin( a ) * 17 + 152;
				$.drawImage( g.screens[ 1 ], x, y, null, 0.5, 0.5, null, 2, 2 );
				virusTypesDrawn[ virus.id ] = true;
				a += $.util.math.deg120;
			}
		}
		m.game.virusAngle -= 0.0005 * dt;
	
		// Draw Viruses
		for( i in m.player1.viruses ) {
			virus = m.player1.viruses[ i ];
			$.setColor( virus.c );
			$.setPos( virus.x, virus.y );
			$.print( m.player1.viruses[ virus.id ].charAt( virus.frame ) );
			if( m.time > m.player1.lastAnimationFrame2 + 60 ) {
				if( Math.random() * 3 < 1 ) {
					virus.frame = Math.floor( Math.random() * 2 );
				}
			}
		}
	
		if( m.time > m.player1.lastAnimationFrame2 + 60 ) {
			m.player1.lastAnimationFrame2 = m.time;
		}
	
		// Draw Pills
		for( i in m.player1.pills ) {
			pill = m.player1.pills[ i ];
			$.setColor( pill.c );
			$.setPos( pill.x, pill.y );
			$.print( pill.id, true );
		}
	
		// Draw Active Pills
		for( i = 0; i < m.player1.activePills.length; i++ ) {
			pill = m.player1.activePills[ i ];
			$.setColor( pill.c );
			$.setPos( pill.x, pill.y );
			$.print( pill.id, true );
		}	
	}

	function moveGameObjects( timestamp, player ) {
		var i, pill, cacheIndex, pillDropped, speed;
	
		pillDropped = false;
	
		// Move Active Pills
		for( i = player.activePills.length - 1; i >= 0; i-- ) {
			pill = player.activePills[ i ];
	
			if(
				player.fastFall && player.movePill &&
				( pill === player.movePill || pill === player.movePill.partner )
			) {
				speed = g.fastFallSpeed;
			} else {
				speed = g.speeds[ m.game.speed ];
			}
			// Check if ready to drop
			if( m.time > pill.last + speed ) {
				pill.last = m.time;
				pill.y += 1;
				if( pill.baseY ) {
					pill.baseY += 1;
				}
				cacheIndex = pill.x + "_" + pill.y;
				if( 
					player.pills[ cacheIndex ] ||
					player.viruses[ cacheIndex ] ||
					pill.status === "stopped" ||
					pill.y > player.floor
				) {
					pill.status = "stopped";
					pill.y -= 1;
					if( pill.baseY ) {
						pill.baseY -= 1;
					}
					player.pills[ pill.x + "_" + pill.y ] = pill;
					player.activePills.splice( i, 1 );
	
					if( pill === player.movePill || pill.partner === player.movePill ) {
						player.movePill = null;
					}
	
					// If partner is active flag it to be stopped
					if( pill.partner ) {
						if( pill.partner.status === "active" ) {
							pill.partner.status = "stopped";
						}
	
						// If partner has already moved - then move it back up
						if( pill.order === 0 ) {
							pill.partner.y -= 1;
							player.pills[ pill.partner.x + "_" + pill.partner.y ] = pill.partner;
							player.activePills.splice( i, 1 );
						}
	
						// Decouple Pills
						pill.partner.partner = null;
						pill.partner = null;
					}
	
					pillDropped = true;
				}
			}
		}
	
		if( pillDropped ) {
			findMatches();
			freefall();
		}
	
		if( player.activePills.length === 0 && ! player.throwingPill  ) {
			player.score += player.pillScore;
			player.pillScore = 0;
			setupThrowAnimation();
		}
	
		if( timestamp > player.lastAnimationFrame + g.animationDelay ) {
			if( player.throwingPill ) {
				player.animationFrame = 0;
				throwPill();
				getNextPill();
				player.finishedThrowing = false;
			} else {
				player.animationFrame = Math.floor( Math.random() * ( g.animations.length - 1 ) );
				player.finishedThrowing = true;
			}
			player.lastAnimationFrame = timestamp;
		}
	
		handleInput( timestamp );
	}

} )();