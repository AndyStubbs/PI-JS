/*
* File: qbs-util.js
*/
window.qbs.util = ( function () {
	"use strict";

	function isFunction(functionToCheck) {
		return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
	}

	function isDomElement(el) {
		return el instanceof Element;
	}

	function hexToRgb( hex ) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
		return result ? {
			r: parseInt( result[ 1 ], 16 ),
			g: parseInt( result[ 2 ], 16 ),
			b: parseInt( result[ 3 ], 16 ),
			a: 255,
			s: hex
		} : null;
	}

	function cToHex( c ) {
		var hex = Number( c ).toString( 16 );
		if ( hex.length < 2 ) {
			hex = "0" + hex;
		}
		return hex.toUpperCase();
	}

	function rgbToHex( r, g, b ) {
		return "#" + cToHex( r ) + cToHex( g ) + cToHex( b );
	}

	function rgbToColor(r, g, b) {
		return hexToRgb(rgbToHex(r, g, b));
	}

	function convertToColor(color) {
		var check_hex_color;
		if( color === undefined ) {
			return rgbToColor(0, 0, 0);
		}
		if(Array.isArray(color) && color.length > 2) {
			return rgbToColor(color[0], color[1], color[2]); 
		}
		if(Number.isInteger(color.r) && Number.isInteger(color.g) && Number.isInteger(color.b)) {
			return rgbToColor(color.r, color.g, color.b);
		}
		check_hex_color = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
		if( check_hex_color.test( color ) ) {
			return hexToRgb(color);
		}
		return rgbToColor(0, 0, 0);
	}

	function checkColor(strColor) {
		var s = new Option().style;
		s.color = strColor;
		return s.color !== '';
	}

	function compareColors( color_1, color_2 ) {
		return color_1.r === color_2.r && color_1.g === color_2.g && color_1.b === color_2.b;
	}

	// Copies properties from one object to another
	function copyProperties( dest, src ) {
		var prop;
		for( prop in src ) {
			if( src.hasOwnProperty( prop ) ) {
				dest[ prop ] = src[ prop ];
			}
		}
	}

	function convertToArray( src ) {
		var prop, arr;
		arr = [];
		for( prop in src ) {
			if( src.hasOwnProperty( prop ) ) {
				arr.push( src[ prop ] );
			}
		}
		return arr;
	}

	function deleteProperties( obj1 ) {
		var prop;
		for( prop in obj1 ) {
			if( obj1.hasOwnProperty( prop ) ) {
				delete obj1[ prop ];
			}
		}
	}

	function clamp( num, min, max ) {
		return Math.min( Math.max( num, min ), max );
	}

	function inRange( point, hitBox ) {
		return 	point.x >= hitBox.x && point.x < hitBox.x + hitBox.width && 
				point.y >= hitBox.y && point.y < hitBox.y + hitBox.height;
	}

	function inRange2( x1, y1, x2, y2, width, height ) {
		return 	x1 >= x2 && x1 < x2 + width && 
				y1 >= y2 && y1 < y2 + height;
	}

	function degreesToRadian(deg) {
		return deg * Math.PI / 180;
	}

	function sanitizeBool(b) {
		if(b) {
			return true;
		} else {
			return false;
		}
	}

	function padL(str, len, c) {
		var i, pad;
		if(typeof c !== "string") {
			c = " ";
		}
		pad = "";
		str = str + "";
		for( i = str.length; i < len; i++ ) {
			pad += c;
		}
		return pad + str;
	}

	function padR(str, len, c) {
		var i;
		if(typeof c !== "string") {
			c = " ";
		}
		str = str + "";
		for( i = str.length; i < len; i++ ) {
			str += c;
		}
		return str;
	}

	// Setup commands that will run only in the qbs api
	var api = {
		"isFunction": isFunction,
		"isDomElement": isDomElement,
		"hexToRgb": hexToRgb,
		"cToHex": cToHex,
		"rgbToHex": rgbToHex,
		"rgbToColor": rgbToColor,
		"convertToColor": convertToColor,
		"checkColor": checkColor,
		"compareColors": compareColors,
		"copyProperties": copyProperties,
		"convertToArray": convertToArray,
		"deleteProperties": deleteProperties,
		"clamp": clamp,
		"inRange": inRange,
		"inRange2": inRange2,
		"degreesToRadian": degreesToRadian,
		"sanitizeBool": sanitizeBool,
		"padL": padL,
		"padR": padR,
		"math": {
			"deg30": Math.PI / 6,
			"deg45": Math.PI / 4,
			"deg60": Math.PI / 3,
			"deg90": Math.PI / 2,
			"deg120": ( 2 * Math.PI ) / 3,
			"deg135": ( 3 * Math.PI ) / 4,
			"deg150": ( 5 * Math.PI ) / 6,
			"deg180": Math.PI,
			"deg210": ( 7 * Math.PI ) / 6,
			"deg225": ( 5 * Math.PI ) / 4,
			"deg240": ( 4 * Math.PI ) / 3,
			"deg270": ( 3 * Math.PI ) / 2,
			"deg300": ( 5 * Math.PI ) / 3,
			"deg315": ( 7 * Math.PI ) / 4,
			"deg330": ( 11 * Math.PI ) / 6,
			"deg360": Math.PI * 2
		}
	};

	return api;

} )();

// Polyfills
Number.isInteger = Number.isInteger || function(value) {
return typeof value === 'number' && 
	isFinite(value) && 
	Math.floor(value) === value;
};