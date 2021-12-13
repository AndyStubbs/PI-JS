var examples = {};
examples['arc'] = function() {
$.screen("300x200", 'canvasContainer');
$.arc(150, 100, 50, 45, 270);onExampleClose = function () {};
}
examples['bezier'] = function() {
$.screen("300x200", 'canvasContainer');
$.bezier({
	"xStart": 15,
	"yStart": 10,
	"x1": 45,
	"y1": 135,
	"x2": 195,
	"y2": 75,
	"xEnd": 280,
	"yEnd": 185
});onExampleClose = function () {};
}
examples['cancelInput'] = function() {
$.screen("300x200", 'canvasContainer');
$.print("\n");
$.input("What is your name?", null);
$.onkey( "Escape", "down", function () {  
	$.print("\nInput Canceled");
	$.cancelInput();
}, true );onExampleClose = function () {};
}
examples['canvas'] = function() {
$.screen("300x200", 'canvasContainer');
$.canvas().className = "purple";
$.print("\n\nThe background is now purple.");onExampleClose = function () {};
}
examples['circle'] = function() {
$.screen("300x200", 'canvasContainer');
$.circle(150, 100, 50, "red");onExampleClose = function () {};
}
examples['clearKeys'] = function() {
$.screen("300x200", 'canvasContainer');
$.print("\n");
$.onkey( "any", "down", function (key) {
	$.print(key.key + " pressed.");
});
$.onkey( "Escape", "down", function (key) {
	$.print(key.key + " pressed.");
	$.clearKeys();
});onExampleClose = function () {};
}
examples['cls'] = function() {
$.screen("300x200", 'canvasContainer');
$.line(0, 0, 300, 200);
$.onkey("any", "down", function () {
	$.cls();
});onExampleClose = function () {};
}
examples['createAudioPool'] = function() {
var bombPool = $.createAudioPool( "bomb.wav", 1 , 'canvasContainer');
$.ready( function () {
	$.playAudioPool( bombPool );
} );
onExampleClose = function () {};
}
examples['deleteAudioPool'] = function() {
var bombPool = $.createAudioPool("bomb.wav", 1, 'canvasContainer');
$.deleteAudioPool(bombPool);onExampleClose = function () {};
}
examples['draw'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.pset( 150, 100 );
$.draw( "C2 R15 D15 L30 U15 R15" );						// Draw House
$.draw( "B G4 C1 L6 D6 R6 U6 BG3 P1" ); 				// Draw Window
$.draw( "B E3 B R14 C1 L6 D6 R6 U6 BG3 P1" ); 	// Draw Window
$.draw( "B E3 B R1 P2" );										// Paint House
$.draw( "B E4 B U C6 H15 G15 B R5 P6" );				// Draw Roof
onExampleClose = function () {};
}
examples['drawImage'] = function() {
$.screen( "300x200" , 'canvasContainer');
var monkey = $.loadImage( "monkey.png" );
$.ready( function () {
	$.drawImage( monkey, 150, 100, 0, 0.5, 0.5 );
} );
onExampleClose = function () {};
}
examples['drawSprite'] = function() {
var monkey, frame, interval;
$.screen( "300x200" , 'canvasContainer');
monkey = $.loadSpritesheet( "monkey.png", 32, 32, 1 );
$.ready( function () {
	frame = 0;
	interval = setInterval( run, 500 );
	function run() {
		frame += 1;
		$.cls();
		$.drawSprite( monkey, frame % 2, 150, 100, 0, 0.5, 0.5 );
	}
	run();
} );onExampleClose = function () {clearInterval( interval );
}
}
examples['ellipse'] = function() {
$.screen("300x200", 'canvasContainer');
$.ellipse(150, 100, 50, 80, "blue");onExampleClose = function () {};
}
examples['filterImg'] = function() {
$.screen("300x200", 'canvasContainer');
$.circle(150, 100, 50, "red");
$.filterImg(function (color, x, y) {
	color.r = color.r - Math.round( Math.tan( ( x + y ) / 10 ) * 128 );
	color.g = color.g + Math.round( Math.cos( x / 7 ) * 128 );
	color.b = color.b + Math.round( Math.sin( y / 5 ) * 128 );
	return color;
});onExampleClose = function () {};
}
examples['findColor'] = function() {
$.screen("300x200", 'canvasContainer');
var color = $.findColor("red");
$.setColor(color);
$.print("The index of red is " + color + ".");
onExampleClose = function () {};
}
examples['get'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.circle( 150, 100, 50, 4 );
var colors = $.get( 105, 75, 110, 75 );
$.print( colors[ 0 ].join( "," ) );
onExampleClose = function () {};
}
examples['getCols'] = function() {
// Print a line of *'s on the top of the screen
$.screen( "300x200" , 'canvasContainer');
var cols = $.getCols();
var msg = "";
for( var i = 0; i < cols; i++ ) {
	msg += "*";
}
$.print( msg );
onExampleClose = function () {};
}
examples['getDefaultPal'] = function() {
$.screen("300x200", 'canvasContainer');
var pal = $.getDefaultPal();
$.setColor( 4 );
$.print( pal[ 4 ].s );
onExampleClose = function () {};
}
examples['getPal'] = function() {
$.screen("300x200", 'canvasContainer');
var pal = $.getPal();
$.setColor( 2 );
$.print( pal[ 2 ].s );
onExampleClose = function () {};
}
examples['getPixel'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.setColor( 5 );
$.pset( 55, 55 );
var pixel = $.getPixel( 55, 55 );
$.print( pixel.s );
onExampleClose = function () {};
}
examples['getPos'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.setPos( 5, 5 );
var pos = $.getPos();
$.print( pos.row + ", " + pos.col );
onExampleClose = function () {};
}
examples['getPosPx'] = function() {
$.screen("300x200", 'canvasContainer');
$.setPosPx(15, 15);
var pos = $.getPosPx();
$.print(pos.x + ", " + pos.y);
onExampleClose = function () {};
}
examples['getRows'] = function() {
// Print a line of *'s on the left of the screen
$.screen("300x200", 'canvasContainer');
var rows = $.getRows();
var msg = "";
for(var i = 0; i < rows; i++) {
	msg += "*\n";
}
$.print(msg);
onExampleClose = function () {};
}
examples['getScreen'] = function() {
$.screen( "300x200" , 'canvasContainer');
var $screen = $.getScreen( 0 );
$screen.print( "This is screen 0." );
onExampleClose = function () {};
}
examples['height'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Height: " + $.height() );
onExampleClose = function () {};
}
examples['ingamepads'] = function() {
var x, y, frame;
$.screen( "300x200" , 'canvasContainer');
$.setColor( 15 );
x = 150;
y = 100;
requestAnimationFrame( run );
function run( dt ) {
	var pads, factor;
	factor = dt / 2500;
	pads = $.ingamepads( 0 );
	$.cls();
	if( pads.length > 0 ) {
		x = qbs.util.clamp( x + pads[ 0 ].axes[ 0 ] * factor, 0, 299 );
		y = qbs.util.clamp( y + pads[ 0 ].axes[ 1 ] * factor, 0, 199 );
		$.circle( Math.floor( x ), Math.floor( y ) , 10 );
		$.pset( Math.floor( x ), Math.floor( y ) );
	}
	frame = requestAnimationFrame( run );
}
onExampleClose = function () {cancelAnimationFrame( frame );
}
}
examples['inkey'] = function() {
$.screen( "300x200" , 'canvasContainer');
var frame = requestAnimationFrame( run );
function run() {
	var keys, key;
	keys = $.inkey();
	$.cls();
	$.print( "Press any key" );
	for( key in $.inkey() ) {
		$.print( "--------------------------" );
		$.print( "key:      " + keys[ key ].key );
		$.print( "location: " + keys[ key ].location );
		$.print( "code:     " + keys[ key ].code );
		$.print( "keyCode:  " + keys[ key ].keyCode );
	}
	frame = requestAnimationFrame( run );
}
onExampleClose = function () {cancelAnimationFrame( frame );
}
}
examples['inmouse'] = function() {
$.screen( "4x4" , 'canvasContainer');
var interval = setInterval( function () {
	var mouse = $.inmouse();
	if( mouse.buttons > 0 ) {
		$.setColor( Math.floor( Math.random() * 9 ) + 1 );
		$.pset( mouse.x, mouse.y );
	}
}, 50 );
onExampleClose = function () {clearInterval( interval );
}
}
examples['inpress'] = function() {
$.screen( "4x4" , 'canvasContainer');
$.startTouch();
$.setPinchZoom( false );
var interval = setInterval( function () {
	var press = $.inpress();
	if( press.buttons > 0 ) {
		$.setColor( Math.floor( Math.random() * 9 ) + 1 );
		$.pset( press.x, press.y );
	}
}, 50 );
onExampleClose = function () {clearInterval( interval );
}
}
examples['input'] = function() {
$.screen( "300x200" , 'canvasContainer');
askQuestions();
async function askQuestions() {
	var name = await $.input( "What is your name? " );
	var age = await $.input( "How old are you? ", null, true, true, false, "always" );
	$.print( "Your name is " + name + " you are " + age + " years old." );
}
onExampleClose = function () {};
}
examples['intouch'] = function() {
$.screen( "4x4" , 'canvasContainer');
$.startTouch();
$.setPinchZoom( false );
var interval = setInterval( function () {
	var touches = $.intouch();
	if( touches.length > 0 ) {
		$.setColor( Math.floor( Math.random() * 9 ) + 1 );
		$.pset( touches[ 0 ].x, touches[ 0 ].y );
	}
}, 50 );
onExampleClose = function () {clearInterval( interval );
}
}
examples['line'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.setColor( 4 );
$.line( 15, 15, 285, 185 );
$.setColor( 2 );
$.line( 15, 185, 285, 15 );
onExampleClose = function () {};
}
examples['loadFont'] = function() {
var fontBlock = $.loadFont( "font-block.png", 10, 10, [ 65, 66, 67, 68, 70, 71, 72, 73 ], true );
$.ready( function () {
	$.screen( "300x200" , 'canvasContainer');
	$.setFont( fontBlock );
	$.print( "AABBCC" );
	$.print( "DD  FF" );
	$.print( "GGHHII" );
} );
onExampleClose = function () {};
}
examples['loadImage'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.loadImage( "monkey.png", "monkey" );
$.ready( function () {
	$.drawImage( "monkey", 150, 100, 0, 0.5, 0.5 );
} );
onExampleClose = function () {};
}
examples['loadSpritesheet'] = function() {
var frame, interval;
$.screen( "300x200" , 'canvasContainer');
$.loadSpritesheet( "monkey.png", 32, 32, 1, "monkey" );
$.ready( function () {
	frame = 0;
	interval = setInterval( run, 500 );
	function run() {
		frame += 1;
		$.cls();
		$.drawSprite( "monkey", frame % 2, 150, 100, 0, 0.5, 0.5 );
	}
	run();
} );onExampleClose = function () {clearInterval( interval );
}
}
examples['offclick'] = function() {
$.screen( "300x200" , 'canvasContainer');
var hitBox = {
	"x": 25,
	"y": 25,
	"width": 100,
	"height": 100
};

// Draw a green box
$.setColor( 2 );
$.rect( hitBox );

// Setup the onclick function for the hitBox
$.onclick( clickBox, false, hitBox );

// Click function
function clickBox() {

	// Draw a red box
	$.setColor( 4 );
	$.rect( hitBox );
	$.offclick( clickBox );

	// Wait a second then clear the box
	setTimeout( function () {
		$.setColor( 0 );
		$.rect( hitBox );
	}, 1000 );
}
onExampleClose = function () {};
}
examples['offgamepad'] = function() {
$.screen( "300x300" , 'canvasContainer');
$.print( "Press button 3 to stop" );
$.ongamepad( 0, "pressed", "any", pressButton );
$.ongamepad( 0, "pressed", 3, stop );

// Press button function
function pressButton( btn ) {
	console.log( btn );
	$.print( "Button " + btn.index + " pressed" );
}

// Stop function
function stop() {
	$.offgamepad( 0, "pressed", "any", pressButton );
	$.offgamepad( 0, "pressed", 3, stop );
	$.print( "Stopped" );
}
onExampleClose = function () {};
}
examples['offkey'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Press any key." );
$.print( "Press q to stop" );
$.onkey( "any", "down", keyPress );
$.onkey( "Q", "down", stopPress );

// Key press function
function keyPress( key ) {
	$.print( "You pressed " + key.key + "!" );
}

// Stop key press function
function stopPress() {
	$.print( "You pressed Q! Stopping." );
	$.offkey( "any", "down", keyPress );
	$.offkey( "Q", "down", keyPress );
}
onExampleClose = function () {};
}
examples['offmouse'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Move mouse to paint screen, click to stop." );
$.onmouse( "move", mouseMove );
$.onmouse( "up", mouseStop, true );

// Mouse move function
function mouseMove( data ) {
	$.setPosPx( data.x, data.y );
	var pos = $.getPos();
	$.setPos( pos.col, pos.row );
	$.setColor( 8 );
	$.print( "+", true );
}

// Mouse stop function
function mouseStop() {
	$.setColor( 14 );
	var pos = $.getPos();
	$.setPos( pos.col - 4, pos.row );
	$.print( "Stopped!", true );
	$.offmouse( "move", mouseMove );
}
onExampleClose = function () {};
}
examples['offpress'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Move mouse or touch to paint screen, click/touch up to stop." );
$.onpress( "move", pressMove );
$.onpress( "up", pressStop, true );

// Press move function
function pressMove( data ) {
	$.setPosPx( data.x, data.y );
	var pos = $.getPos();
	$.setPos( pos.col, pos.row );
	$.setColor( 8 );
	$.print( "+", true );
}

// Press stop function
function pressStop() {
	$.setColor( 14 );
	var pos = $.getPos();
	$.setPos( pos.col - 4, pos.row );
	$.print( "Stopped!", true );
	$.offpress( "move", pressMove );
}
onExampleClose = function () {};
}
examples['offtouch'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Touch and drag to paint screen, touch up to stop." );
$.ontouch( "move", touchMove );
$.ontouch( "end", touchStop, true );

// Touch move function
function touchMove( touches ) {
	$.setPosPx( touches[ 0 ].x, touches[ 0 ].y );
	var pos = $.getPos();
	$.setPos( pos.col, pos.row );
	$.setColor( 8 );
	$.print( "+", true );
}

// Touch stop function
function touchStop() {
	$.setColor( 14 );
	var pos = $.getPos();
	$.setPos( pos.col - 4, pos.row );
	$.print( "Stopped!", true );
	$.offtouch( "move", touchMove );
}
onExampleClose = function () {};
}
examples['onclick'] = function() {
$.screen( "300x200" , 'canvasContainer');
var hitBox = {
	"x": 25,
	"y": 25,
	"width": 100,
	"height": 100
};

// Draw a green box
$.setColor( 2 );
$.rect( hitBox );

// Setup the onclick function for the hitBox
$.onclick( clickBox, true, hitBox );

// Click function
function clickBox() {

	// Draw a red box
	$.setColor( 4 );
	$.rect( hitBox );

	// Wait a second then clear the box
	setTimeout( function () {
		$.setColor( 0 );
		$.rect( hitBox );
	}, 1000 );
}
onExampleClose = function () {};
}
examples['ongamepad'] = function() {
$.screen( "300x300" , 'canvasContainer');
$.print( "Press button 3 to stop" );
$.ongamepad( 0, "pressed", "any", pressButton );
$.ongamepad( 0, "pressed", 3, stop );

// Press button function
function pressButton( btn ) {
	$.print( "Button " + btn.index + " pressed" );
}

// Stop function
function stop() {
	$.offgamepad( 0, "pressed", "any", pressButton );
	$.offgamepad( 0, "pressed", 3, stop );
	$.print( "Stopped" );
}
onExampleClose = function () {};
}
examples['onkey'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Press any key." );
$.print( "Press q to stop" );
$.onkey( "any", "down", keyPress );
$.onkey( "Q", "down", stopPress, true );

// Key press function
function keyPress( key ) {
	$.print( "You pressed " + key.key + "!" );
}

// Stop key press function
function stopPress() {
	$.print( "You pressed Q! Stopping." );
	$.offkey( "any", "down", keyPress );
}
onExampleClose = function () {};
}
examples['onmouse'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Move mouse to paint screen, click to stop." );
$.onmouse( "move", mouseMove );
$.onmouse( "up", mouseStop, true );

// Mouse move function
function mouseMove( data ) {
	$.setPosPx( data.x, data.y );
	var pos = $.getPos();
	$.setPos( pos.col, pos.row );
	$.setColor( 8 );
	$.print( "+", true );
}

// Mouse stop function
function mouseStop() {
	$.setColor( 14 );
	var pos = $.getPos();
	$.setPos( pos.col - 4, pos.row );
	$.print( "Stopped!", true );
	$.offmouse( "move", mouseMove );
}
onExampleClose = function () {};
}
examples['onpress'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Move mouse or touch to paint screen, click/touch up to stop." );
$.onpress( "move", pressMove );
$.onpress( "up", pressStop, true );

// Press move function
function pressMove( data ) {
	$.setPosPx( data.x, data.y );
	var pos = $.getPos();
	$.setPos( pos.col, pos.row );
	$.setColor( 8 );
	$.print( "+", true );
}

// Press stop function
function pressStop() {
	$.setColor( 14 );
	var pos = $.getPos();
	$.setPos( pos.col - 4, pos.row );
	$.print( "Stopped!", true );
	$.offpress( "move", pressMove );
}
onExampleClose = function () {};
}
examples['ontouch'] = function() {
$.screen( "4x4" , 'canvasContainer');
$.setPinchZoom( false );
$.ontouch( "start", function ( touches ) {
	var touch = touches[ 0 ];
	$.setColor( Math.floor( Math.random() * 9 ) + 1 );
	$.pset( touch.x, touch.y );
} );
onExampleClose = function () {};
}
examples['paint'] = function() {
var color = [ 255, 255, 255 ];
var color2 = [ 25, 85, 125 ];
$.screen( "256x256" , 'canvasContainer');
$.setColor( 15 );
$.setPen( "pixel", 1, 100 );
for( i = 0; i < 128; i++ ) {
	color[ 0 ] -= 2;
	color[ 1 ] -= 2;
	color[ 2 ] -= 2;
	$.setColor( color );
	$.rect( i, i, 255 - i * 2 + 1, 255 - i * 2 + 1 );
}
$.setPen( "pixel", 1 );
$.print( "Click screen to paint" );
$.onclick( function ( mouse ) {
	$.paint( mouse.x, mouse.y, color2, 0.75 );
} );
onExampleClose = function () {};
}
examples['play'] = function() {
$.play( `
	triangle
	ma5	mt90 md10
	mo1 t140 o2 p4 g2 e4. f8 g4 o3 c2 o2 b8 o3 c8 d4 c4 o2 b4 a8 g2.
	o2 b8 o3 c8 d4 c4 o2 b4 a8 a8 g8 o3 c4 o2 e8 e4 g8 a8 g4 f4 e4 f4 g2.
	g2 e4. f8 g4 o3 c2 o2 b8 o3 c8 d4 c4 o2 b4 a8 g2.
	square
	v30
	o2 b8 o3 c8 d4 c4 o2 b4 a8 a8 g8 o3 c4 o2 e8 e4 g8 a8 g4 f4 e4 d4 c2.
	c4 a4 a4 o3 c4 c4 o2 b4 a4 g4 e4 f4 a4 g4 f4 e2.
	ma10 mt80 md10
	mo-1
	sawtooth
	v35
	e8 e8 d4 d4 g4 g4 b4 b4 o3 d4 d8 o2 b8 o3 d4 c4 o2 b4 a4 g4 p4
	g2 g2 e4. f8 g4 o3 c2 o2 b8 o3 c8 d4 c4 o2 b4 a8 g8 g2.
	o2 b8 o3 c8 d4 c4 o2 b4 a8 a8 g8 o3 c4 o2 e8 e4 g8 a8 g4 f4 e4 d4 c2. p4
	[
		[   0, 0.4, 0.4,   1,   1,   1, 0.3, 0.7, 0.6, 0.5, 0.9, 0.8 ],
		[   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0 ]
	]
	v80
	ma20 md20
	t180 g8 g8 g4 g4 g4 a8 g8 g4 g4 g4 a4 g4 e4 g4 d1
	t180 g8 g8 g4 g4 g4 a8 g8 g4 g4 g4 g8 g8 g4 a4 b4 o3 c2 c4 p1
` , 'canvasContainer');
onExampleClose = function () {$.stopPlay();
}
}
examples['playAudioPool'] = function() {
var bombPool = $.createAudioPool( "bomb.wav", 1 , 'canvasContainer');
$.ready( function () {
	$.playAudioPool( bombPool );
} );
onExampleClose = function () {};
}
examples['point'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.setColor( 5 );
$.pset( 55, 55 );
var pixel = $.point( 55, 55 );
$.print( pixel );
onExampleClose = function () {};
}
examples['print'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Welcome to QBS", false, true );
$.print();
$.print( "This is a line of text." );
$.print( "This is inline text", true );
$.print( ". Some more inline text.", true );
$.print();
$.print( "The End" );
onExampleClose = function () {};
}
examples['printTable'] = function() {
var data = [
	[ "One", "2", "3", "FourSandwhiches", "EggMcMuffins", "6a" ],
	[ "Hotdogs", "Five", "Six", "7", "8", "9" ],
	[ "Seven", "Eight", "Nine", "a", "b", "c" ]
];
var format = [
	"*-----------*---*---*---*----*",
	"|           |   |   |V  |V   |",
	"*----*------*---*---*   |    |",
	"|    |      |       |   |    |",
	"|    *------*       |   |    |",
	"*----*      |       |   |    |",
	"|    |      |       |   |    |",
	"*----*------*-------*---*----*"
];
$.screen( "300x210" , 'canvasContainer');
$.setColor( 2 );
$.setFont( 1 );
$.print( "12345678901234567890123456789012345678901234567890" );
$.setPos( 18, 2 );
$.printTable( data, format, null, false );
$.printTable( data, format, null, true );
$.printTable( data, null, null );
onExampleClose = function () {};
}
examples['pset'] = function() {
$.screen("300x200", 'canvasContainer');
$.setColor(2);
$.pset(148, 101);
$.pset(149, 100);
$.pset(150, 101);
$.pset(151, 100);
$.pset(152, 101);onExampleClose = function () {};
}
examples['setPinchZoom'] = function() {
$.screen( "4x4" , 'canvasContainer');
$.setPinchZoom( false );
$.ontouch( "start", function ( touches ) {
	var touch = touches[ 0 ];
	$.setColor( Math.floor( Math.random() * 9 ) + 1 );
	$.pset( touch.x, touch.y );
} );
onExampleClose = function () {};
}
examples['startTouch'] = function() {
$.screen( "4x4" , 'canvasContainer');
$.startTouch();
$.setPinchZoom( false );
$.ontouch( "start", function ( touches ) {
	var touch = touches[ 0 ];
	$.setColor( Math.floor( Math.random() * 9 ) + 1 );
	$.pset( touch.x, touch.y );
} );
onExampleClose = function () {};
}
examples['stopTouch'] = function() {
$.screen( "100x100" , 'canvasContainer');
$.startTouch();
$.setPinchZoom( false );
var count = 5;
$.print( count + " touches left" );
$.ontouch( "start", function ( touches ) {
	$.setColor( Math.floor( Math.random() * 9 ) + 1 );
	$.print( --count + " touches left" );
	var touch = touches[ 0 ];
	$.pset( touch.x, touch.y );
	if( count === 0 ) {
		$.stopTouch();
	}
} );
onExampleClose = function () {};
}
examples['width'] = function() {
$.screen( "300x200" , 'canvasContainer');
$.print( "Width: " + $.width() );
onExampleClose = function () {};
}
