var examples = {};
examples['arc'] = function() {
$.screen("300x200", 'canvasContainer');
$.arc(150, 100, 50, 45, 270);
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
});
}
examples['cancelAllInputs'] = function() {
$.screen("300x200", 'canvasContainer');
$.print("\n");
$.input("What is your name?", null);
$.onkey( "Escape", "down", function () {  
	$.print("\nInput Canceled");
	$.cancelAllInputs();
}, true );
}
examples['cancelInput'] = function() {
$.screen("300x200", 'canvasContainer');
$.print("\n");
$.input("What is your name?", null, "name");
$.onkey( "Escape", "down", function () {
	$.print("\nInput Canceled");
	$.cancelInput("name");
}, true);
}
examples['canvas'] = function() {
$.screen("300x200", 'canvasContainer');
$.canvas().className = "purple";
$.print("\n\nThe background is now purple.");
}
examples['circle'] = function() {
$.screen("300x200", 'canvasContainer');
$.circle(150, 100, 50, "red");
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
});
}
examples['cls'] = function() {
$.screen("300x200", 'canvasContainer');
$.line(0, 0, 300, 200);
$.onkey("any", "down", function () {
	$.cls();
});
}
examples['createAudioPool'] = function() {
var bombPool = $.createAudioPool("bomb.wav", 1, 'canvasContainer');
$.ready(function () {
	$.playAudioPool(bombPool);
});
}
examples['deleteAudioPool'] = function() {
var bombPool = $.createAudioPool("bomb.wav", 1, 'canvasContainer');
$.deleteAudioPool(bombPool);
}
examples['draw'] = function() {
$.screen("300x200", 'canvasContainer');
$.pset(150, 100);
$.draw("C9 U2 G2 L C15 NU4 BR3 C9 U2 R ");
$.draw("D2 R U2 D C10 R D L R D R U R U L");
$.draw("BU2 BL2 C6 L U L R3 L UC8 L BD6 ");
$.draw("BL C9 D2 R C8 U2 C9 R D2");
}
examples['drawImage'] = function() {
$.screen("300x200", 'canvasContainer');
var monkey = $.loadImage("monkey.png");
$.ready(function () {
	$.drawImage(monkey, 150, 100, 0, 0.5, 0.5);
});
}
examples['drawSprite'] = function() {
$.screen("300x200", 'canvasContainer');
var monkey = $.loadSpritesheet("monkey.png", 32, 32, 1);
$.ready(function () {
	var frame = 0;
	var interval = setInterval(run, 500);
	function run() {
		frame += 1;
		$.cls();
		$.drawSprite(monkey, frame % 2, 150, 100, 0, 0.5, 0.5);
	}
	run();
	setTimeout(function () {
		clearInterval(interval);
	}, 2000);
});
}
examples['ellipse'] = function() {
$.screen("300x200", 'canvasContainer');
$.ellipse(150, 100, 50, 80, "blue");
}
examples['filterImg'] = function() {
$.screen("300x200", 'canvasContainer');
$.circle(150, 100, 50, "red");
$.filterImg(function (color, x, y) {
	color.r = color.r - Math.round( Math.tan( ( x + y ) / 10 ) * 128 );
	color.g = color.g + Math.round( Math.cos( x / 7 ) * 128 );
	color.b = color.b + Math.round( Math.sin( y / 5 ) * 128 );
	return color;
});
}
examples['findColor'] = function() {
$.screen("300x200", 'canvasContainer');
var color = $.findColor("red");
$.setColor(color);
$.print("The index of red is " + color + ".");

}
examples['get'] = function() {
$.screen("300x200", 'canvasContainer');
$.circle(150, 100, 50, 4);
var colors = $.get(105, 75, 110, 75);
$.print(colors[0].join(","));

}
examples['getCols'] = function() {
// Print a line of *'s on the top of the screen
$.screen("300x200", 'canvasContainer');
var cols = $.getCols();
var msg = "";
for(var i = 0; i < cols; i++) {
	msg += "*";
}
$.print(msg);

}
examples['getDefaultPal'] = function() {
undefined
}
examples['getPal'] = function() {
undefined
}
examples['getPixel'] = function() {
undefined
}
examples['getPos'] = function() {
undefined
}
examples['getPosPx'] = function() {
undefined
}
examples['getRows'] = function() {
undefined
}
examples['getScreen'] = function() {
undefined
}
examples['getTouchPress'] = function() {
undefined
}
examples['height'] = function() {
undefined
}
examples['ingamepads'] = function() {
undefined
}
examples['inkey'] = function() {
undefined
}
examples['inmouse'] = function() {
undefined
}
examples['inpress'] = function() {
undefined
}
examples['input'] = function() {
undefined
}
examples['inputReady'] = function() {
undefined
}
examples['intouch'] = function() {
undefined
}
examples['isDomElement'] = function() {
undefined
}
examples['isFunction'] = function() {
undefined
}
examples['line'] = function() {
undefined
}
examples['loadFont'] = function() {
undefined
}
examples['loadImage'] = function() {
undefined
}
examples['loadSpritesheet'] = function() {
undefined
}
examples['offclick'] = function() {
undefined
}
examples['offgamepad'] = function() {
undefined
}
examples['offkey'] = function() {
undefined
}
examples['offmouse'] = function() {
undefined
}
examples['offpress'] = function() {
undefined
}
examples['offtouch'] = function() {
undefined
}
examples['onclick'] = function() {
undefined
}
examples['ongamepad'] = function() {
undefined
}
examples['onkey'] = function() {
undefined
}
examples['onmouse'] = function() {
undefined
}
examples['onpress'] = function() {
undefined
}
examples['ontouch'] = function() {
undefined
}
examples['paint'] = function() {
undefined
}
examples['play'] = function() {
undefined
}
examples['playAudioPool'] = function() {
undefined
}
examples['point'] = function() {
undefined
}
examples['print'] = function() {
undefined
}
examples['printTable'] = function() {
undefined
}
examples['pset'] = function() {
undefined
}
examples['put'] = function() {
undefined
}
examples['ready'] = function() {
undefined
}
examples['rect'] = function() {
undefined
}
examples['removeAllScreens'] = function() {
undefined
}
examples['removeScreen'] = function() {
undefined
}
examples['render'] = function() {
undefined
}
examples['screen'] = function() {
undefined
}
examples['set'] = function() {
undefined
}
examples['setActionKey'] = function() {
undefined
}
examples['setAutoRender'] = function() {
undefined
}
examples['setBgColor'] = function() {
undefined
}
examples['setColor'] = function() {
undefined
}
examples['setColors'] = function() {
undefined
}
examples['setContainerBgColor'] = function() {
undefined
}
examples['setDefaultFont'] = function() {
undefined
}
examples['setDefaultPal'] = function() {
undefined
}
examples['setEnableContextMenu'] = function() {
undefined
}
examples['setErrorMode'] = function() {
undefined
}
examples['setFont'] = function() {
undefined
}
examples['setFontSize'] = function() {
undefined
}
examples['setInputCursor'] = function() {
undefined
}
examples['setPalColor'] = function() {
undefined
}
examples['setPen'] = function() {
undefined
}
examples['setPinchZoom'] = function() {
undefined
}
examples['setPixelMode'] = function() {
undefined
}
examples['setPos'] = function() {
undefined
}
examples['setPosPx'] = function() {
undefined
}
examples['setScreen'] = function() {
undefined
}
examples['setVolume'] = function() {
undefined
}
examples['setWordBreak'] = function() {
undefined
}
examples['sound'] = function() {
undefined
}
examples['startKeyboard'] = function() {
undefined
}
examples['startMouse'] = function() {
undefined
}
examples['startTouch'] = function() {
undefined
}
examples['stopAudioPool'] = function() {
undefined
}
examples['stopGamepads'] = function() {
undefined
}
examples['stopKeyboard'] = function() {
undefined
}
examples['stopMouse'] = function() {
undefined
}
examples['stopPlay'] = function() {
undefined
}
examples['stopSound'] = function() {
undefined
}
examples['stopTouch'] = function() {
undefined
}
examples['swapColor'] = function() {
undefined
}
examples['util_checkColor'] = function() {
undefined
}
examples['util_clamp'] = function() {
undefined
}
examples['util_colorStringToHex'] = function() {
undefined
}
examples['util_compareColors'] = function() {
undefined
}
examples['util_convertToArray'] = function() {
undefined
}
examples['util_convertToColor'] = function() {
undefined
}
examples['util_copyProperties'] = function() {
undefined
}
examples['util_cToHex'] = function() {
undefined
}
examples['util_degreesToRadian'] = function() {
undefined
}
examples['util_deleteProperties'] = function() {
undefined
}
examples['util_getWindowSize'] = function() {
undefined
}
examples['util_hexToColor'] = function() {
undefined
}
examples['util_inRange'] = function() {
undefined
}
examples['util_inRange2'] = function() {
undefined
}
examples['util_isArray'] = function() {
undefined
}
examples['util_isInteger'] = function() {
undefined
}
examples['util_math'] = function() {
undefined
}
examples['util_pad'] = function() {
undefined
}
examples['util_padL'] = function() {
undefined
}
examples['util_padR'] = function() {
undefined
}
examples['util_queueMicrotask'] = function() {
undefined
}
examples['util_radiansToDegrees'] = function() {
undefined
}
examples['util_rgbToColor'] = function() {
undefined
}
examples['util_rgbToHex'] = function() {
undefined
}
examples['util_rndRange'] = function() {
undefined
}
examples['width'] = function() {
undefined
}
