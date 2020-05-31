/*
* File: qbs-screen-bezier.js
*/

// Start of File Encapsulation
( function () {

	"use strict";
	var qbData, borderStyles;

	qbData = qbs._.data;

	borderStyles = {
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
	qbs._.addCommand( "printTable", printTable, false, true,
		[ "items", "tableFormat", "borderStyle", "isCentered" ]
	);
	function printTable( screenData, args ) {

		var items, width, tableFormat, borderStyle, isCentered, isFormatted;

		items = args[ 0 ];
		tableFormat = args[ 1 ];
		borderStyle = args[ 2 ];
		isCentered = !!( args[ 3 ] );
		if( ! qbs.util.isArray( items ) ) {
			console.error( "formatTable: items must be an array" );
			return;
		}

		if( ! borderStyle ) {
			borderStyle = borderStyles[ "single" ];
		}

		if( tableFormat == null ) {
			isFormatted = false;
		} else if( qbs.util.isArray( tableFormat ) ) {
			isFormatted = true;
		} else {
			console.error(
				"formatTable: tableFormat must be an array"
			);
			return;
		}

		if( typeof borderStyle === "string" && borderStyles[ borderStyle ] ) {
			borderStyle = borderStyles[ borderStyle ];
		} else if( ! qbs.util.isArray( borderStyle ) ) {
			console.error(
				"formatTable: borderStyle must be an integer or array"
			);
			return;
		}

		if( isFormatted ) {
			return buildFormatedTable(
				screenData, items, borderStyle, tableFormat, isCentered
			);
		} else {
			width = qbData.commands.getCols( screenData );
			return buildStandardTable( screenData, items, width, borderStyle );
		}
	}

	function buildStandardTable( screenData, items, width, borders ) {
		var row, col, msg, msgTop, msgMid, msgBot, cellWidth, rowWidth, rowPad,
			bottomRow;

		msg = "";

		for( row = 0; row < items.length; row += 1 ) {

			// Calculate the cellWidth
			cellWidth = Math.floor( width / items[ row ].length );
			if( cellWidth < 3 ) {
				cellWidth = 3;
			}

			rowWidth = ( cellWidth - 2 ) * items[ row ].length +
				items[ row ].length + 1;
			rowPad = Math.round( ( width - rowWidth ) / 2 );
			msgTop = qbs.util.padL( "", rowPad, " " );
			msgMid = msgTop;
			msgBot = msgTop;

			// Format all the cells
			for( col = 0; col < items[ row ].length; col += 1 ) {

				// Middle cell
				msgMid += String.fromCharCode( borders[ 3 ][ 0 ] ) + 
					qbs.util.pad(
						items[ row ][ col ],
						cellWidth - 2,
						String.fromCharCode( borders[ 3 ][ 1 ] )
					);

				if( col === items[ row ].length - 1 ) {
					msgMid += String.fromCharCode( borders[ 3 ][ 2 ] );
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
					msgTop += qbs.util.pad( "", cellWidth - 2,
						String.fromCharCode( borders[ 0 ][ 1 ] )
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
				msgBot += qbs.util.pad( "", cellWidth - 2, String.fromCharCode(
					borders[ bottomRow ][ 1 ] )
				);

				// Bottom Right corner
				if( col === items[ row ].length - 1 ) {
					msgBot += String.fromCharCode( borders[ bottomRow ][ 3 ] );
				}

			}

			// Move to the next row
			if( row === 0 ) {
				msg += msgTop + "\n";
			}
			msg += msgMid + "\n";
			msg += msgBot + "\n";
		}

		msg = msg.substr( 0, msg.length - 1 );
		qbData.commands.print( screenData, [ msg ] );
	}

	function buildFormatedTable(
		screenData, items, borders, tableFormat, isCentered
	) {
		var row, col, msg, cell, cellDirs, boxes, i, pos, padding, padWidth;

		msg = "";
		boxes = [];
		pos = qbData.commands.getPos( screenData );

		// Set padding for centered table
		if( isCentered ) {
			padWidth = Math.floor( ( qbData.commands.getCols( screenData ) -
				tableFormat[ 0 ].length ) / 2
			);
		} else {
			padWidth = pos.col;
		}

		// Create the padding
		padding = qbs.util.pad( "", padWidth, " " );
		qbData.commands.setPos( screenData, [ 0, pos.row ] );
		for( row = 0; row < tableFormat.length; row += 1 ) {
			msg += padding;
			for( col = 0; col < tableFormat[ row ].length; col += 1 ) {
				cell = tableFormat[ row ].charAt( col );

				// Table Intersection
				if( cell === "*" ) {

					cellDirs = "" +
						lookCell( col, row, "left", tableFormat ) +
						lookCell( col, row, "right", tableFormat ) +
						lookCell( col, row, "up", tableFormat ) +
						lookCell( col, row, "down", tableFormat );

					if( cellDirs === " - |" ) {

						// Top Left Section
						msg += String.fromCharCode( borders[ 0 ][ 0 ] );
						createBox( row, col, boxes );
						
					} else if( cellDirs === "-- |" ) {
						
						// Top Middle Section
						msg += String.fromCharCode( borders[ 0 ][ 2 ] );
						createBox( row, col, boxes );

					} else if( cellDirs === "-  |" ) {

						// Top Right Section
						msg += String.fromCharCode( borders[ 0 ][ 3 ] );

					} else if( cellDirs === " -||" ) {

						// Middle Left Section
						msg += String.fromCharCode( borders[ 1 ][ 0 ] );
						createBox( row, col, boxes );
	
					} else if( cellDirs === "--||" ) {

						// Middle Middle
						msg += String.fromCharCode( borders[ 1 ][ 2 ] );
						createBox( row, col, boxes );

					} else if( cellDirs === "- ||" ) {

						// Middle Right
						msg += String.fromCharCode( borders[ 1 ][ 3 ] );

					} else if( cellDirs === " -| " ) {

						// Bottom Left
						msg += String.fromCharCode( borders[ 2 ][ 0 ] );

					} else if( cellDirs === "--| " ) {

						// Bottom Middle
						msg += String.fromCharCode( borders[ 2 ][ 2 ] );

					} else if( cellDirs === "- | " ) {

						// Bottom Right
						msg += String.fromCharCode( borders[ 2 ][ 3 ] );

					}
				} else if( cell === "-" ) {
					msg += String.fromCharCode( borders[ 0 ][ 1 ] );
				} else if( cell === "|" ) {
					msg += String.fromCharCode( borders[ 3 ][ 0 ] );
				} else {
					msg += " ";
				}
			}
			msg += "\n";
		}

		completeBoxes( boxes, tableFormat );

		pos = qbData.commands.getPos( screenData );
		qbData.commands.print( screenData, [ msg ] );
		qbData.commands.setPos( screenData, [ pos.col, pos.row ] );
		i = 0;
		for( row = 0; row < items.length; row += 1 ) {
			if( qbs.util.isArray( items[ row ] ) ) {
				for( col = 0; col < items[ row ].length; col += 1 ) {
					printItem(
						screenData, boxes[ i ], items[ row ][ col ], padWidth
					);
					i += 1;
				}
			} else {
				printItem( screenData, boxes[ i ], items[ row ], padWidth );
				i += 1;
			}
		}

		qbData.commands.setPos( screenData,
			[ 0, pos.row + tableFormat.length ]
		);
	}

	function printItem( screenData, box, msg, padWidth ) {
		var pos, width, height, isVertical, col, row, index;

		if( ! box ) {
			return;
		}

		// Calculate dimensions
		width = box.right - ( box.left + 1 );
		height = box.bottom - ( box.top + 1 );

		if( box.format.toLowerCase() === "v" ) {
			isVertical = true;
		}

		if( isVertical ) {
			if( msg.length > height ) {
				msg = msg.substr( 0, height );
			}
		} else {
			if( msg.length > width ) {
				msg = msg.substr( 0, width );
			}
		}

		pos = qbData.commands.getPos( screenData );
		
		if( isVertical ) {
			index = 0;
			col = pos.col + box.left + Math.round( width / 2 ) + padWidth;
			row = pos.row + box.top + 1 +
				Math.floor( ( height - msg.length ) / 2 );
			for( ; row <= pos.row + height; row += 1 ) {
				qbData.commands.setPos( screenData, [ col, row ] );
				qbData.commands.print( screenData,
					[ msg.charAt( index ), true ]
				);
				index += 1;
			}
		} else {
			col = pos.col + box.left + 1 + padWidth +
				Math.floor( ( width - msg.length ) / 2 );
			row = pos.row + box.top + Math.round( height / 2 );
			qbData.commands.setPos( screenData, [ col, row ] );
			qbData.commands.print( screenData, [ msg, true ] );
		}
		qbData.commands.setPos( screenData, [ pos.col, pos.row ] );
	}

	function createBox( row, col, boxes ) {
		var boxName;

		boxName = col + "_" + row;
		boxes.push( {
			"left": col,
			"top": row,
			"right": null,
			"bottom": null,
			"format": " "
		} );
	}

	function completeBoxes( boxes, tableFormat ) {
		var i, box, x, y, cell;

		for( i = 0; i < boxes.length; i += 1 ) {
			box = boxes[ i ];

			// Find the formating character
			x = box.left + 1;
			y = box.top + 1;
			if( y < tableFormat.length && x < tableFormat[ y ].length ) {
				box.format = tableFormat[ y ].charAt( x );
			}

			// Find box.right
			x = box.left;
			y = box.top;
			while( x < tableFormat[ y ].length - 1 ) {
				x += 1;
				if( tableFormat[ y ].charAt( x ) === "*" ) {
					cell = lookCell( x, y, "down", tableFormat );
					if( cell === "|" ) {
						box.right = x;
						break;
					}
				}
			}
			if( box.right === null ) {
				box.right = x - 1;
			}

			// Find box.bottom
			while( y < tableFormat.length - 1 ) {
				y += 1;
				if( tableFormat[ y ].charAt( x ) === "*" ) {
					box.bottom = y;
					break;
				}
			}
			if( box.bottom === null ) {
				box.bottom = y - 1;
			}
		}
	}

	function lookCell( x, y, dir, tableFormat ) {
		if( dir === "left" ) {
			x -= 1;
		} else if( dir === "right" ) {
			x += 1;
		} else if( dir === "up" ) {
			y -= 1;
		} else if( dir === "down" ) {
			y += 1;
		}

		if( y >= tableFormat.length || y < 0 || x < 0 ) {
			return " ";
		}

		if( x >= tableFormat[ y ].length ) {
			return " ";
		}

		if(
			tableFormat[ y ].charAt( x ) === "*" &&
			( dir === "left" || dir === "right" )
		) {
			return "-";
		}

		if(
			tableFormat[ y ].charAt( x ) === "*" &&
			( dir === "up" || dir === "down" )
		) {
			return "|";
		}

		return tableFormat[ y ].charAt( x );
	}

// End of File Encapsulation
} )();
