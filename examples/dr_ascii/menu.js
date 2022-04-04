"use strict";

var Menu = ( function () {

	var m = {
		"interval": 0,
		"cnt": 0,
		"cnt2": 0,
		"maxVirusLevel": 20,
		"speeds": [ 750, 450, 200 ],
		"speedNames": [ "LOW", "MED", "HIGH" ],
		"rects": [
            // 25, 30, 190, 40
            { "x": 25, "y": 30, "width": 190, "height": 40 },
            // 25, 82, 190, 40 
            { "x": 25, "y": 82, "width": 190, "height": 40 },
            // 25, 135, 190, 32
            { "x": 25, "y": 135, "width": 190, "height": 32 },
            // 45, 102, 30, 12
            { "x": 45, "y": 102, "width": 30, "height": 12 },
            // 100, 102, 30, 12
            { "x": 100, "y": 102, "width": 30, "height": 12 },
            // 156, 102, 37, 12
            { "x": 156, "y": 102, "width": 37, "height": 12 }
        ],
		"settings": {
			"players": 0,
			"selected": 0,
			"virusLevel": 0,
			"speedSelected": 0
		}
	};

	$.ready( initGame );

	function initGame() {
		var i;

		g.screens.push( $.screen( "256x224" ) );
		g.screens.push( $.screen( "10x10", null, true ) );

		// Viruses
		for( i = 0; i < g.screens.length; i++ ) {
			$.setScreen( g.screens[ i ] );
			$.setFont( 2 );
			$.setChar( "~", "00c33c4299663c42" );   // A0
			$.setChar( "!", "81423c425ae73c24" );   // A1
			$.setChar( "#", "005a3c5aff663c42" );   // B0
			$.setChar( "$", "00187e5a7ee73c24" );   // B1
			$.setChar( "%", "c3ff425a7ec35a66" );   // C0
			$.setChar( "^", "00ffc35aff427ee7" );   // C1
		}

		$.setScreen( g.screens[ 0 ] );

		// Pills
		$.setChar( "(", "3f7fffffffff7f3f" );   // Left
		$.setChar( ")", "fcfefffffffffefc" );   // Right
		$.setChar( "{", "3c7effffffffffff" );   // Top
		$.setChar( "}", "ffffffffffff7e3c" );   // Bottom
		$.setChar( "&", "3c7effffffff7e3c" );   // Circle

		showPlayerSelect();
	}

	function showPlayerSelect() {
		$.onkey( "1", "up", stopAnimationIntro );
		$.onkey( "2", "up", stopAnimationIntro );
		animatePlayerSelect();
		m.interval = setInterval( animatePlayerSelect, 60 );
	}
	
	function animatePlayerSelect() {
		var cols, rows, x, y, centerX, centerY, step, steps;

		// Calculate positions
		cols = $.getCols();
		rows = $.getRows();
		centerX = Math.round( cols / 2 );
		centerY = Math.round( rows / 2 ) - 1;

		// Draw player select
		$.cls();
		$.setColor( 15 );
		$.setPos( 0, centerY - 1 );
		$.print( "Dr. Ascii", true, true );
		$.print( "\n" );
		$.print( "1 or 2 players?", true, true );
		if( m.cnt2 < 5 ) {
			$.print( "_", true );
		}

		// Draw borders
		$.setColor( 4 );
		x = centerX - 15;
		y = centerY - 5;
		step = 0;
		steps = 74;
		while( step < steps ) {
			if( step < 27 ) {
				x += 1;
			} else if( step < 37 ) {
				y += 1;
			} else if( step < 64 ) {
				x -= 1;
			} else {
				y -= 1;
			}
			$.setPos( x, y );
			if( step % 3 === m.cnt ) {
				$.print( "*", true );
			}
			step += 1;
		}
		m.cnt = ( m.cnt + 1 ) % 3;
		m.cnt2 = ( m.cnt2 + 1 ) % 10;
	}

	function stopAnimationIntro( key ) {
		$.clearKeys();
		clearInterval( m.interval );
		m.settings.players = parseInt( key.key );

		$.onkey( "ArrowUp", "down", function () {
			m.settings.selected -= 1;
			if( m.settings.selected < 0 ) {
				m.settings.selected = 2;
			}
			setupGame();
		} );
		$.onkey( "ArrowDown", "down", function () {
			m.settings.selected += 1;
			if( m.settings.selected > 2 ) {
				m.settings.selected = 0;
			}
			setupGame();
		} );
		$.onkey( "ArrowLeft", "down", function () {
			if( m.settings.selected === 0 ) {
				m.settings.virusLevel -= 1;
				if( m.settings.virusLevel < 0 ) {
					m.settings.virusLevel = 0;
				}
			} else if( m.settings.selected === 1 ) {
				m.settings.speedSelected -= 1;
				if( m.settings.speedSelected < 0 ) {
					m.settings.speedSelected = 0;
				}
			}
			setupGame();
		} );
		$.onkey( "ArrowRight", "down", function () {
			if( m.settings.selected === 0 ) {
				m.settings.virusLevel += 1;
				if( m.settings.virusLevel >= m.maxVirusLevel ) {
					m.settings.virusLevel = m.maxVirusLevel;
				}
			} else if( m.settings.selected === 1 ) {
				m.settings.speedSelected += 1;
				if( m.settings.speedSelected >= m.speeds.length - 1 ) {
					m.settings.speedSelected = m.speeds.length - 1;
				}
			}
			setupGame();
		} );
		setupGame();
	}

	function setupGame() {
		var i;
	
		$.cls();
		$.setColor( 7 );
		$.print();
		$.print( m.settings.players + " Player Game", false, true );
		$.print( "\n\n" );
		$.print( "\tVirus Level\n" );
	
		// Virus Level Settings
		$.setColor( 15 );
		if( m.settings.selected === 0 ) {
			$.rect( m.rects[ 0 ] );
		}
		$.setColor( 8 );
		$.rect( 30, 53, m.maxVirusLevel * 9, 12, 8 );
		$.setColor( 7 );
		$.rect( 30, 53, m.settings.virusLevel * 9, 12, 7 );
		$.setColor( 15 );
		$.setPos( 14, 7 );
		$.print( $.util.padL( m.settings.virusLevel, 2, "0" ) );
		
		// Speed Settings
		$.setColor( 15 );
		if( m.settings.selected === 1 ) {
			$.rect( m.rects[ 1 ] );
		}
		$.setColor( 7 );
		$.setPos( 0, 11 );
		$.print( "\tSpeed\n" );
		$.setColor( 8 );
		$.rect( m.rects[ 3 ] );
		$.rect( m.rects[ 4 ] );
		$.rect( m.rects[ 5 ] );
		$.setColor( 15 );
		$.print( "\t  ", true );
		for( i = 0; i < m.speedNames.length; i++ ) {
			$.print( m.speedNames[ i ] + "\t", true );
		}
		$.rect( m.rects[ 3 + m.settings.speedSelected ] );
	
		// Begin Game
		$.setColor( 15 );
		if( m.settings.selected === 2 ) {
			$.rect( m.rects[ 2 ] );
		}
		$.setPosPx( 0, 148 );
		$.print( "Begin Game", false, true );
	
		// Settings Help
		$.setColor( 7 );
		$.setPos( 0, 23 );
		$.print( "Use arrow keys/enter or mouse to select settings." );
	}

} )();
