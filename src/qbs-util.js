/*
* File: qbs-util.js
*/
window.qbs.util = ( function () {
	"use strict";

	var borderStyles = {
		"single": [
			[ 218, 196, 194, 191 ],
			[ 195, 196, 197, 180 ],
			[ 192, 196, 193, 217 ],
			[ 179, 32, 179 ]
		],
		"double": [
			[ 201, 205, 203, 187 ],
			[ 204, 205, 206, 185 ],
			[ 200, 205, 202, 188 ],
			[ 186, 32, 186 ]
		],
		"singleDouble": [
			[ 213, 205, 209, 184 ],
			[ 198, 205, 216, 181 ],
			[ 212, 205, 207, 190 ],
			[ 179, 32, 179 ]
		],
		"doubleSingle": [
			[ 214, 196, 210, 183 ],
			[ 199, 196, 215, 182 ],
			[ 211, 196, 208, 189 ],
			[ 186, 32, 186 ]
		],
		"thick": [
			[ 219, 223, 219, 219 ],
			[ 219, 223, 219, 219 ],
			[ 223, 223, 223, 223 ],
			[ 219, 32, 219 ]
		]
	};

	function isFunction( functionToCheck ) {
		return functionToCheck &&
			{}.toString.call( functionToCheck ) === '[object Function]';
	}

	function isDomElement( el ) {
		return el instanceof Element;
	}

	function hexToRgb( hex ) {
		var r, g, b, a, s2;
		s2 = hex;
		if( hex.length === 4 ) {
			r = parseInt( hex.slice( 1, 2 ), 16 ) * 16 - 1;
			g = parseInt( hex.slice( 2, 3 ), 16 ) * 16 - 1;
			b = parseInt( hex.slice( 3, 4 ), 16 ) * 16 - 1;
		} else {
			r = parseInt( hex.slice( 1, 3 ), 16 );
			g = parseInt( hex.slice( 3, 5 ), 16 );
			b = parseInt( hex.slice( 5, 7 ), 16 );
		}
		if( hex.length === 9 ) {
			s2 = hex.slice( 0, 7 );
			a = parseInt( hex.slice( 7, 9 ), 16 );
		} else {
			a = 255;
		}

		return {
			"r": r,
			"g": g,
			"b": b,
			"a": a,
			"s": "rgba(" + r + "," + g + "," + b + "," + a + ")",
			"s2": s2
		};
	}

	function cToHex( c ) {
		if( ! qbs.util.isInteger( c ) ) {
			c = 255;
		}
		c = clamp( c, 0, 255 );
		var hex = Number( c ).toString( 16 );
		if ( hex.length < 2 ) {
			hex = "0" + hex;
		}
		return hex.toUpperCase();
	}

	function rgbToHex( r, g, b, a ) {
		return "#" + cToHex( r ) + cToHex( g ) + cToHex( b ) + cToHex( a );
	}

	function rgbToColor( r, g, b, a ) {
		return hexToRgb( rgbToHex( r, g, b, a ) );
	}

	function convertToColor( color ) {
		var check_hex_color;
		if( color === undefined ) {
			return null;
		}
		if( qbs.util.isArray( color ) && color.length > 2 ) {
			return rgbToColor( color[ 0 ], color[ 1 ], color[ 2 ], color[ 3 ] );
		}
		if(
			qbs.util.isInteger( color.r ) &&
			qbs.util.isInteger( color.g ) &&
			qbs.util.isInteger( color.b )
		) {
			return rgbToColor( color.r, color.g, color.b, color.a );
		}
		check_hex_color = /(^#[0-9A-F]{8}$)|(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
		if( check_hex_color.test( color ) ) {
			return hexToRgb( color );
		}
		if( color.indexOf( "rgb" ) === 0 ) {
			color = splitRgb( color );
			if( color.length < 3 ) {
				return null;
			}
			return rgbToColor( color[ 0 ], color[ 1 ], color[ 2 ], color[ 3 ] );
		}
		return null;
	}

	function splitRgb( s ) {
		var parts, i, colors;
		s = s.slice( s.indexOf( "(" ) + 1, s.indexOf( ")" ) );
		parts = s.split( "," );
		colors = [];
		for( i = 0; i < parts.length; i++ ) {
			colors.push( parseInt( parts[ i ] ) );
		}
		return colors;
	}

	function checkColor( strColor ) {
		var s = new Option().style;
		s.color = strColor;
		return s.color !== '';
	}

	function compareColors( color_1, color_2 ) {
		return color_1.r === color_2.r &&
				   color_1.g === color_2.g &&
					 color_1.b === color_2.b &&
					 color_1.a === color_2.a;
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

	function rndRange( min, max ) {
		return Math.random() * ( max - min ) + min;
	}

	function degreesToRadian( deg ) {
		return deg * ( Math.PI / 180 );
	}

	function radiansToDegrees( rad ) {
		return rad * ( 180 / Math.PI );
	}

	function padL( str, len, c ) {
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

	function pad( str, len, c ) {
		if( typeof c !== "string" || c.length === 0 ) {
			c = " ";
		}
		str = str + "";
		while( str.length < len ) {
			str = c + str + c;
		}
		if( str.length > len ) {
			str = str.substr( 0, str.length - 1 );
		}
		return str;
	}

	function formatTable( items, width, borderStyle, padding ) {
		var borders, row, col, msg, msgTop, msgMid, msgBot, cellWidth, rowWidth,
			rowPad, bottomRow;

		if( ! qbs.util.isArray( items ) ) {
			console.error( "formatBorder: items must be an array" );
			return;
		}

		if( ! borderStyle ) {
			borders = borderStyles[ "single" ];
		}

		if( padding === undefined ) {
			padding = 0;
		}

		if( typeof borderStyle === "string" && borderStyles[ borderStyle ] ) {
			borders = borderStyles[ borderStyle ];
		} else if( qbs.util.isArray( borderStyles ) ) {
			borders = borderStyle;
		}

		msg = "";

		for( row = 0; row < items.length; row += 1 ) {

			// Calculate the cellWidth
			cellWidth = Math.floor( width / items[ row ].length );
			if( cellWidth < 3 ) {
				cellWidth = 3;
			}
			if( padding === 0 ) {
				rowWidth = ( cellWidth - 2 ) * items[ row ].length + items[ row ].length + 1;
			} else {
				rowWidth = cellWidth * items[ row ].length;
			}

			rowPad = Math.round( ( width - rowWidth ) / 2 );

			//rowPad = 2;
			msgTop = padL( "", rowPad, " " );
			msgMid = msgTop;
			msgBot = msgTop;

			// Format all the cells
			for( col = 0; col < items[ row ].length; col += 1 ) {

				// Middle cell
				msgMid += String.fromCharCode( borders[ 3 ][ 0 ] ) + 
					pad(
						items[ row ][ col ],
						cellWidth - 2,
						String.fromCharCode( borders[ 3 ][ 1 ] )
					);

				if( col === items[ row ].length - 1 ) {
					msgMid += String.fromCharCode( borders[ 3 ][ 2 ] );
				}

				// Each cell is individually bordered
				if( padding > 0 ) {

					// Top
					msgTop += String.fromCharCode( borders[ 0 ][ 0 ] );
					msgTop += pad( "", cellWidth - 2, String.fromCharCode( 
						borders[ 0 ][ 1 ] )
					);
					msgTop += String.fromCharCode( borders[ 0 ][ 3 ] );

					// Middle
					if( col !== items[ row ].length - 1 ) {
						msgMid += String.fromCharCode( borders[ 3 ][ 2 ] );
					}

					// Bottom
					msgBot += String.fromCharCode( borders[ 2 ][ 0 ] );
					msgBot += pad( "", cellWidth - 2, String.fromCharCode( 
						borders[ 2 ][ 1 ] )
					);
					msgBot += String.fromCharCode( borders[ 2 ][ 3 ] );
					continue;
				}

				// Top Row
				if( row === 0 ) {

					// Top left corner
					if( col === 0 ) {
						msgTop += String.fromCharCode( borders[ 0 ][ 0 ] );
					} else {
						msgTop += String.fromCharCode( borders[ 0 ][ 2 ] );
					}

					// Top center line
					msgTop += pad( "", cellWidth - 2, String.fromCharCode( 
						borders[ 0 ][ 1 ] )
					);

					// Top Right corner
					if( col === items[ row ].length - 1 ) {
						msgTop += String.fromCharCode( borders[ 0 ][ 3 ] );
					}

				}

				// Bottom Row
				if( row === items.length - 1 ) {
					bottomRow = 2;
				} else {
					bottomRow = 1;
				}

				// Bottom Left Corner
				if( col === 0 ) {
					msgBot += String.fromCharCode( borders[ bottomRow ][ 0 ] );
				} else {
					msgBot += String.fromCharCode( borders[ bottomRow ][ 2 ] );
				}

				// Bottom center line
				msgBot += pad( "", cellWidth - 2, String.fromCharCode(
					borders[ bottomRow ][ 1 ] )
				);

				// Bottom Right corner
				if( col === items[ row ].length - 1 ) {
					msgBot += String.fromCharCode( borders[ bottomRow ][ 3 ] );
				}

			}

			// Move to the next row
			if( row === 0 || padding > 0 ) {
				msg += msgTop + "\n";
			}
			msg += msgMid + "\n";
			msg += msgBot + "\n";
		}

		return msg.substr( 0, msg.length - 1 );
	}

	// Setup commands that will run only in the qbs api
	var api = {
		"isFunction": isFunction,
		"isDomElement": isDomElement,
		"isInteger": Number.isInteger,
		"isArray": Array.isArray,
		"queueMicrotask": function( callback ) { window.queueMicrotask( callback ) },
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
		"rndRange": rndRange,
		"degreesToRadian": degreesToRadian,
		"radiansToDegrees": radiansToDegrees,
		"padL": padL,
		"padR": padR,
		"pad": pad,
		"formatTable": formatTable,
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

	// Number.isInteger polyfill
	if( typeof Number.isInteger !== "function" ) {
		api.isInteger = function( value ) {
			return typeof value === 'number' &&
				isFinite( value ) &&
				Math.floor( value ) === value;
		};
	}

	// Array.isArray polyfill
	if ( typeof Array.isArray !== "function" ) {
		api.isArray = function( arg ) {
			return Object.prototype.toString.call( arg ) === '[object Array]';
		};
	}

	// Queue Microtask polyfill
	if ( typeof window.queueMicrotask !== "function" ) {
		api.queueMicrotask = function ( callback ) {
			setTimeout( callback, 0 );
		};
	}
	return api;

} )();
