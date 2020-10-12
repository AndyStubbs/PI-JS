
function printIndex() {
	var i, strContents, strLetter, isDivOpen, strIndex, name;
	strIndex = "";
	strContents = "<div>";
	strLetter = "";
	isDivOpen = false;
	for( i = 0; i < commands.length; i++ ) {
		name = commands[ i ].name;
		if( name.charAt( 0 ).toUpperCase() !== strLetter ) {
			strLetter = name.charAt( 0 ).toUpperCase();
			strIndex += "* <a href='#letter_" + strLetter + "'>" + strLetter + "</a> ";
			if( isDivOpen ) {
				strContents += "</div>";
			}
			strContents += printBorderLine( strLetter ) + "<div class='contents-letter'>";
			isDivOpen = true;
		}
		strContents += "<span class='wide-span'><a href='#command_" + name + "'>" + name + "</a></span>";
	}
	if( isDivOpen ) {
		strContents += "</div>";
	}
	strContents += "</div>";
	document.getElementById( "index-list" ).innerHTML = strIndex;
	document.getElementById( "contents" ).innerHTML = strContents;
}

function printCommands() {
	var msg, i, j, msgParam, name;
	msg = "";
	for( i = 0; i < commands.length; i++ ) {
		name = commands[ i ].name;
		msg += "<section id='command_" + name + "'>";
		msg += printBorderLine( name );
		msg += "<div class='tabbed'>" + commands[ i ].description + "</div>";
		msg += "<div>&nbsp;</div>";
		msg += "<div class='sectionTitle'>Syntax:</div>";
		msg += "<div class='tabbed'>" + name + "(";
		msgParam = "";
		for( j = 0; j < commands[ i ].parameters.length; j++ ) {
			msgParam += commands[ i ].parameters[ j ] + ", ";
		}
		if( msgParam.length > 0 ) {
			msgParam = msgParam.substr( 0, msgParam.length - 2 );
			msgParam;
		}
		msg += msgParam + ");</div>";
		msg += "<div>&nbsp;</div>";
		msg += "<div class='sectionTitle'>Parameters:</div>";
		for( j = 0; j < commands[ i ].parameters.length; j++ ) {
			if( commands[ i ].pdata ) {
				msg += "<div class='parameter'>" + commands[ i ].parameters[ j ] + " - " +
					commands[ i ].pdata[ j ] + "</div>";
			}
		}
		msg += "<div>&nbsp;</div>";
		msg += "<div class='sectionTitle'>See Also:</div>";
		msg += "<div class='tabbed'>";
		if( commands[ i ].seeAlso ) {
			for( j = 0; j < commands[ i ].seeAlso.length; j++ ) {
				msg += "* <a href='#command_" + commands[ i ].seeAlso[ j ] + "'>" +
					commands[ i ].seeAlso[ j ] + "</a> ";
			}
		}
		msg += "</div>";
		msg += "<div>&nbsp;</div>";
		msg += "<div class='sectionTitle'>Example:</div>";
		msg += "<div class='example'><pre><code class='lang-javascript'>" + commands[ i ].example + "</pre></code></div>";
		msg += "<div class='tabbed'>";
		msg += "<input type='button' value='Run' onclick='RunExample(" + i + ")' />";
		msg += "<input type='button' value='Copy' onclick='CopyExample(" + i +")' />";
		msg += "</div>";
		msg += "</section>";
	}
	document.getElementById( "allCommands" ).innerHTML = msg;
}

function printBorderItem( label ) {
	var msg1, msg2, msg3, i;
	msg1 = "&#x2554;";
	msg2 = "&#x2551; " + label + " &#x2551;";
	msg3 = "&#x255A;";
	for( i = 0; i < label.length + 2; i++ ) {
		msg1 += "&#x2550;";
		msg3 += "&#x2550;";
	}
	msg1 += "&#x2557;";
	msg3 += "&#x255D;";

	return "<div class='border'>" + msg1 + "\n" + msg2 + "\n" + msg3 + "</div>";
}

function printBorderLine( label ) {
	var width, count, msg, msg1, msg2, msg3, i;
	width = $.util.getWindowSize().width - 248;
	count = Math.floor( width / 16 ) - 5 - label.length * 2;
	msg = "<div class='border' id='letter_" + label + "'>";
	msg1 = "&#x2554;";
	msg3 = "&#x255A;";
	for( i = 0; i < label.length + 2; i++ ) {
		msg1 += "&#x2550;";
		msg3 += "&#x2550;";
	}
	msg1 += "&#x2557;";
	msg2 = "&#x2551; " + label + " &#x2560;";
	msg3 += "&#x255D;";
	for( i = 0; i < count; i++ ) {
		msg1 += " ";
		msg2 += "&#x2550;";
		msg3 += " ";
	}
	msg1 += "&#x2554;";
	msg3 += "&#x255A;";
	for( i = 0; i < label.length + 2; i++ ) {
		msg1 += "&#x2550;";
		msg3 += "&#x2550;";
	}
	msg1 += "&#x2557;";
	msg2 += "&#x2563; " + label + " &#x2551;";
	msg3 += "&#x255D;";
	msg += "\n" + msg1 + "\n" + msg2 + "\n" + msg3 + "\n</div>";
	return msg;
}

function RunExample( index ) {
	// var code, start, end;
	// code = commands[ index ].example;
	// start = code.indexOf( ".screen(" );
	// end = code.indexOf( ")", start );
	// code = code.substring( 0, end ) + ", 'canvasContainer'" + code.substring( end );
	var name = commands[ index ].name.replace( ".", "_" );
	document.getElementById( "exampleBox" ).style.display = "block";
	document.getElementById( "clearFocus" ).focus();
	examples[ name ]();
	//eval( code );
}

function CopyExample( index ) {
	navigator.clipboard.writeText( commands[ index ].example );
}

function CloseExample() {
	$.removeAllScreens();
	$.clearKeys();
	document.getElementById( "exampleBox" ).style.display = "none";
}

printIndex();
printCommands();
setTimeout( function () {
	document.querySelectorAll('pre code').forEach((block) => {
		hljs.highlightBlock(block);
	});
} );