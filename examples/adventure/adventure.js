var g_Player1, g_Player2, g_Camera, g_Camera1, g_Camera2;

g_Camera = {
	"pos": { "x": 150, "y": 100 },
	"offset": { "x": 0, "y": 0 },
	"dest": { "x": 150, "y": 100 }
};
g_Player1 = {
	"pos": { "x": 0, "y": 0 },
	"size": 4,
	"color": 2,
	"weapon": getWeapon( g_Weapons.sword ),
	"angle": 0
};

$.ready( function () {
	$.screen( {
		"aspect": "300x200",
  	"isMultiple": false
	} );
	beginLevel();
	$.onkey( "space", "down", function () {

	} );
} );

function beginLevel() {
	gameLoop();
}

function gameLoop() {
	draw();
	window.requestAnimationFrame( gameLoop );
}

function draw() {
	$.cls();
	drawMan( g_Player1 );
}

function drawMan( item ) {
	$.setColor( 2 );
	$.circle(
		g_Camera.pos.x + item.pos.x,
		g_Camera.pos.y + item.pos.y,
		item.size
	);
	item.weapon.draw( item );
}
