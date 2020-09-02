var commands = [{
		"name": "arc",
		"description": "Draws an arc on the screen.",
		"isScreen": true,
		"parameters": [ "x", "y", "radius", "angle1", "angle2" ],
		"pdata": [
			"The x coordinate of the center point of the arc's circle.",
			"The y coordinate of the center point of the arc's circle.",
			"The radius of the arc's circle.",
			"The starting angle.",
			"The ending angle."
		],
		"seeAlso": [ "bezier", "circle", "draw", "ellipse", "line", "paint", "pset", ],
		"example": `$.screen("300x200");\n$.arc(150, 100, 50, 45, 270);\n`
	}, {
		"name": "bezier",
		"description": "Draws a bezier curve on the screen.",
		"isScreen": true,
		"parameters": [ "xStart", "yStart", "x1", "y1", "x2", "y2", "xEnd", "yEnd" ],
		"pdata": [
			"The x coordinate of the starting point of the line.",
			"The y coordinate of the starting point of the line.",
			"The x coordinate of the first control point.",
			"The y coordinate of the first control point.",
			"The x coordinate of the second control point.",
			"The y coordinate of the second control point.",
			"The x coordinate of the ending point of the line.",
			"The y coordinate of the ending point of the line."
		],
		"seeAlso": [ "arc", "circle", "draw", "ellipse", "line", "paint", "pset", ],
		"example": `$.screen("300x200");
$.bezier({
	"xStart": 15,
	"yStart": 10,
	"x1": 45,
	"y1": 135,
	"x2": 195,
	"y2": 75,
	"xEnd": 280,
	"yEnd": 185
});`
	}, {
		"name": "cancelInput",
		"description": "Cancels an input command.",
		"isScreen": true,
		"parameters": [ "name" ],
		"pdata": [ "The name provided to the input command." ],
		"seeAlso": [ "input" ],
		"example": `$.screen("300x200");
$.print("\\n");
$.input("What is your name?", null, "name");
$.onkey( "Escape", "down", function () {
	$.print("\\nInput Canceled");
	$.cancelInput("name");
});
`
	}, {
		"name": "canvas",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "circle",
		"isScreen": true,
		"parameters": ["x", "y", "radius", "fillColor"]
	}, {
		"name": "cls",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "createAudioPool",
		"isScreen": false,
		"parameters": ["src", "poolSize"]
	}, {
		"name": "createTrack",
		"isScreen": false,
		"parameters": ["playString"]
	}, {
		"name": "deleteAudioPool",
		"isScreen": false,
		"parameters": ["audioId"]
	}, {
		"name": "draw",
		"isScreen": true,
		"parameters": ["drawString"]
	}, {
		"name": "drawImage",
		"isScreen": true,
		"parameters": ["name", "x", "y", "angle", "anchorX", "anchorY", "alpha"]
	}, {
		"name": "drawSprite",
		"isScreen": true,
		"parameters": ["name", "frame", "x", "y", "angle", "anchorX", "anchorY", "img", "alpha"]
	}, {
		"name": "ellipse",
		"isScreen": true,
		"parameters": ["x", "y", "radiusX", "radiusY", "fillColor"]
	}, {
		"name": "filterImg",
		"isScreen": true,
		"parameters": ["filter"]
	}, {
		"name": "findColor",
		"isScreen": true,
		"parameters": ["color", "tolerance", "isAddToPalette"]
	}, {
		"name": "get",
		"isScreen": true,
		"parameters": ["x1", "y1", "x2", "y2", "tolerance"]
	}, {
		"name": "getCols",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "getDefaultPal",
		"isScreen": false,
		"parameters": []
	}, {
		"name": "getPal",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "getPixel",
		"isScreen": true,
		"parameters": ["x", "y"]
	}, {
		"name": "getPos",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "getPosPx",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "getRows",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "getScreen",
		"isScreen": false,
		"parameters": ["screenId"]
	}, {
		"name": "getTouchPress",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "height",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "ingamepads",
		"isScreen": false,
		"parameters": ["gamePad"]
	}, {
		"name": "inkey",
		"isScreen": false,
		"parameters": ["key"]
	}, {
		"name": "inmouse",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "inpress",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "input",
		"isScreen": true,
		"parameters": ["prompt", "callback", "name", "isNumber", "isInteger", "allowNegative", "onscreenKeyboard"]
	}, {
		"name": "inputReady",
		"isScreen": false,
		"parameters": ["fn"]
	}, {
		"name": "intouch",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "isDomElement",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "isFunction",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "line",
		"isScreen": true,
		"parameters": ["x1", "y1", "x2", "y2"]
	}, {
		"name": "loadFont",
		"isScreen": false,
		"parameters": ["fontSrc", "width", "height", "charSet", "isBitmap", "isEncoded"]
	}, {
		"name": "loadImage",
		"isScreen": false,
		"parameters": ["src", "name"]
	}, {
		"name": "loadSpritesheet",
		"isScreen": false,
		"parameters": ["src", "width", "height", "margin", "name"]
	}, {
		"name": "offclick",
		"isScreen": true,
		"parameters": ["fn", "once", "hitBox"]
	}, {
		"name": "offgamepad",
		"isScreen": false,
		"parameters": ["gamepadIndex", "mode", "item", "fn"]
	}, {
		"name": "offkey",
		"isScreen": false,
		"parameters": ["key", "mode", "fn"]
	}, {
		"name": "offmouse",
		"isScreen": true,
		"parameters": ["eventName", "fn"]
	}, {
		"name": "offpress",
		"isScreen": true,
		"parameters": ["mode", "fn", "once", "hitBox"]
	}, {
		"name": "offtouch",
		"isScreen": true,
		"parameters": ["mode", "fn"]
	}, {
		"name": "onclick",
		"isScreen": true,
		"parameters": ["fn", "once", "hitBox", "customData"]
	}, {
		"name": "ongamepad",
		"isScreen": false,
		"parameters": ["gamepadIndex", "mode", "item", "fn", "once", "customData"]
	}, {
		"name": "onkey",
		"isScreen": false,
		"parameters": ["key", "mode", "fn", "once"]
	}, {
		"name": "onmouse",
		"isScreen": true,
		"parameters": ["mode", "fn", "once", "hitBox", "customData"]
	}, {
		"name": "onpress",
		"isScreen": true,
		"parameters": ["mode", "fn", "once", "hitBox", "customData"]
	}, {
		"name": "ontouch",
		"isScreen": true,
		"parameters": ["mode", "fn", "once", "hitBox", "customData"]
	}, {
		"name": "paint",
		"isScreen": true,
		"parameters": ["x", "y", "fillColor", "tolerance"]
	}, {
		"name": "play",
		"isScreen": false,
		"parameters": ["playString"]
	}, {
		"name": "playAudioPool",
		"isScreen": false,
		"parameters": ["audioId", "volume", "startTime", "duration"]
	}, {
		"name": "point",
		"isScreen": true,
		"parameters": ["x", "y"]
	}, {
		"name": "print",
		"isScreen": true,
		"parameters": ["msg", "inLine", "isCentered"]
	}, {
		"name": "printTable",
		"isScreen": true,
		"parameters": ["items", "tableFormat", "borderStyle", "isCentered"]
	}, {
		"name": "pset",
		"isScreen": true,
		"parameters": ["x", "y"]
	}, {
		"name": "put",
		"isScreen": true,
		"parameters": ["data", "x", "y", "includeZero"]
	}, {
		"name": "ready",
		"isScreen": false,
		"parameters": ["fn"]
	}, {
		"name": "rect",
		"isScreen": true,
		"parameters": ["x", "y", "width", "height", "fillColor"]
	}, {
		"name": "removeAllScreens",
		"isScreen": false,
		"parameters": []
	}, {
		"name": "removeScreen",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "render",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "screen",
		"isScreen": false,
		"parameters": ["aspect", "container", "isOffscreen", "noStyles", "isMultiple", "resizeCallback"]
	}, {
		"name": "set",
		"isScreen": true,
		"parameters": ["screen", "defaultPal", "errorMode", "actionKey", "inputCursor", "defaultFont", "font", "fontSize", "enableContextMenu", "pinchZoom", "bgColor", "containerBgColor", "pixelMode", "palColor", "color", "colors", "pen", "wordBreak", "pos", "posPx", "volume"],
		"isSet": true,
		"noParse": true
	}, {
		"name": "setActionKey",
		"isScreen": false,
		"parameters": ["key", "isEnabled"]
	}, {
		"name": "setAutoRender",
		"isScreen": true,
		"parameters": ["isAutoRender"]
	}, {
		"name": "setBgColor",
		"isScreen": true,
		"parameters": ["color"]
	}, {
		"name": "setColor",
		"isScreen": true,
		"parameters": ["color", "isAddToPalette"]
	}, {
		"name": "setColors",
		"isScreen": true,
		"parameters": ["colors"]
	}, {
		"name": "setContainerBgColor",
		"isScreen": true,
		"parameters": ["color"]
	}, {
		"name": "setDefaultFont",
		"isScreen": false,
		"parameters": ["fontId"]
	}, {
		"name": "setDefaultPal",
		"isScreen": false,
		"parameters": ["pal"]
	}, {
		"name": "setEnableContextMenu",
		"isScreen": true,
		"parameters": ["isEnabled"]
	}, {
		"name": "setErrorMode",
		"isScreen": false,
		"parameters": ["mode"]
	}, {
		"name": "setFont",
		"isScreen": true,
		"parameters": ["fontId"]
	}, {
		"name": "setFontSize",
		"isScreen": true,
		"parameters": ["width", "height"]
	}, {
		"name": "setInputCursor",
		"isScreen": true,
		"parameters": ["cursor"]
	}, {
		"name": "setPalColor",
		"isScreen": true,
		"parameters": ["index", "color"]
	}, {
		"name": "setPen",
		"isScreen": true,
		"parameters": ["pen", "size", "noise"]
	}, {
		"name": "setPinchZoom",
		"isScreen": false,
		"parameters": ["isEnabled"]
	}, {
		"name": "setPixelMode",
		"isScreen": true,
		"parameters": ["isEnabled"]
	}, {
		"name": "setPos",
		"isScreen": true,
		"parameters": ["col", "row"]
	}, {
		"name": "setPosPx",
		"isScreen": true,
		"parameters": ["x", "y"]
	}, {
		"name": "setScreen",
		"isScreen": false,
		"parameters": ["screen"]
	}, {
		"name": "setVolume",
		"isScreen": false,
		"parameters": ["volume"]
	}, {
		"name": "setWordBreak",
		"isScreen": true,
		"parameters": ["isEnabled"]
	}, {
		"name": "sound",
		"isScreen": false,
		"parameters": ["frequency", "duration", "volume", "oType", "delay", "attack", "decay"]
	}, {
		"name": "startKeyboard",
		"isScreen": false,
		"parameters": []
	}, {
		"name": "startMouse",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "startTouch",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "stopAudioPool",
		"isScreen": false,
		"parameters": ["audioId"]
	}, {
		"name": "stopGamepads",
		"isScreen": false,
		"parameters": []
	}, {
		"name": "stopKeyboard",
		"isScreen": false,
		"parameters": []
	}, {
		"name": "stopMouse",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "stopPlay",
		"isScreen": false,
		"parameters": ["trackId"]
	}, {
		"name": "stopSound",
		"isScreen": false,
		"parameters": ["soundId"]
	}, {
		"name": "stopTouch",
		"isScreen": true,
		"parameters": []
	}, {
		"name": "swapColor",
		"isScreen": true,
		"parameters": ["oldColor", "newColor"]
	},{
		"name": "util.checkColor",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	},  {
		"name": "util.clamp",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.colorStringToHex",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.compareColors",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.convertToArray",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.convertToColor",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.copyProperties",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.cToHex",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.degreesToRadian",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.deleteProperties",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.getWindowSize",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.hexToColor",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.inRange",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.inRange2",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.isArray",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.isInteger",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.math",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.pad",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.padL",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.padR",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.queueMicrotask",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.radiansToDegrees",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.rgbToColor",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.rgbToHex",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "util.rndRange",
		"isScreen": false,
		"isUtil": true,
		"parameters": []
	}, {
		"name": "width",
		"isScreen": true,
		"parameters": []
	}
]
