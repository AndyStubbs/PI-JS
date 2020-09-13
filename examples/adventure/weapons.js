var g_Weapons = {
	"sword": {
		"color": 7,
		"damage": 2,
		"draw": drawSword,
		"size": 5,
		"angle": $.util.math.deg270,
		"swingAngles": [ $.util.math.deg270, $.util.math.deg225 ],
		"speed": 0.5,
		"swingStatus": -1
	}
};

function getWeapon( weapon ) {
	var newWeapon = {};
	$.util.copyProperties( newWeapon, weapon );
	return newWeapon;
}

function drawSword( item ) {
	$.setColor( item.weapon.color );
	console.log( item );
	var pos = {
		"x": Math.round( g_Camera.pos.x + item.pos.x + Math.cos( item.angle ) * item.size ),
		"y": Math.round( g_Camera.pos.y + item.pos.y + Math.sin( item.angle ) * item.size ),
	};
	var pos2 = {
		"x": Math.round( pos.x + Math.cos( item.weapon.angle ) * item.weapon.size ),
		"y": Math.round( pos.y + Math.sin( item.weapon.angle ) * item.weapon.size )
	}
	console.log( pos );
	console.log( pos2 );
	$.line( pos.x, pos.y, pos2.x, pos2.y );
}
