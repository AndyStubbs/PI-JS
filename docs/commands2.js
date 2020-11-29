var commands = [{"name":"arc","description":"Draws an arc on the screen.","isScreen":true,"parameters":["x","y","radius","angle1","angle2"],"pdata":["The x coordinate of the center point of the arc's circle.","The y coordinate of the center point of the arc's circle.","The radius of the arc's circle.","The starting angle.","The ending angle."],"seeAlso":["bezier","circle","draw","ellipse","line","paint","pset","setColor"],"example":"$.screen(\"300x200\");\n$.arc(150, 100, 50, 45, 270);"},{"name":"bezier","description":"Draws a bezier curve on the screen.","isScreen":true,"parameters":["xStart","yStart","x1","y1","x2","y2","xEnd","yEnd"],"pdata":["The x coordinate of the starting point of the line.","The y coordinate of the starting point of the line.","The x coordinate of the first control point.","The y coordinate of the first control point.","The x coordinate of the second control point.","The y coordinate of the second control point.","The x coordinate of the ending point of the line.","The y coordinate of the ending point of the line."],"seeAlso":["arc","circle","draw","ellipse","line","paint","pset","setColor"],"example":"$.screen(\"300x200\");\n$.bezier({\n\t\"xStart\": 15,\n\t\"yStart\": 10,\n\t\"x1\": 45,\n\t\"y1\": 135,\n\t\"x2\": 195,\n\t\"y2\": 75,\n\t\"xEnd\": 280,\n\t\"yEnd\": 185\n});"},{"name":"cancelInput","description":"Cancels all previous input commands.","isScreen":true,"parameters":["name"],"pdata":["The name provided to the input command."],"seeAlso":["input"],"example":"$.screen(\"300x200\");\n$.print(\"\\n\");\n$.input(\"What is your name?\", null);\n$.onkey( \"Escape\", \"down\", function () {  \n\t$.print(\"\\nInput Canceled\");\n\t$.cancelInput();\n}, true );"},{"name":"canvas","description":"Returns the canvas element used by the screen.","isScreen":true,"parameters":[],"example":"$.screen(\"300x200\");\n$.canvas().className = \"purple\";\n$.print(\"\\n\\nThe background is now purple.\");"},{"name":"circle","description":"Draws a circle on the screen.","isScreen":true,"parameters":["x","y","radius","fillColor"],"pdata":["The x coordinate of the center of the circle.","The y coordinate of the center of the circle.","The radius of the circle.","[OPTIONAL]. The fill color for the circle."],"seeAlso":["arc","bezier","draw","ellipse","line","paint","pset","setColor"],"example":"$.screen(\"300x200\");\n$.circle(150, 100, 50, \"red\");"},{"name":"clearKeys","description":"Clears event handlers for keyboard events.","isScreen":false,"parameters":[],"seeAlso":["onkey"],"example":"$.screen(\"300x200\");\n$.print(\"\\n\");\n$.onkey( \"any\", \"down\", function (key) {\n\t$.print(key.key + \" pressed.\");\n});\n$.onkey( \"Escape\", \"down\", function (key) {\n\t$.print(key.key + \" pressed.\");\n\t$.clearKeys();\n});"},{"name":"cls","description":"Clears the screen.","isScreen":true,"parameters":[],"example":"$.screen(\"300x200\");\n$.line(0, 0, 300, 200);\n$.onkey(\"any\", \"down\", function () {\n\t$.cls();\n});"},{"name":"createAudioPool","description":"\tCreates a group of audio players that can play sounds. Audio pools are useful if you want to\n\tplay a sound multiple times without reloading it each time. The number of audio players you\n\tspecify determines how many sounds you can play simultanously. If you only want to play one\n\tsound at a time set 1 for the poolSize.","isScreen":false,"parameters":["src","poolSize"],"pdata":["The source of the audio file.","The number of audio players."],"seeAlso":["deleteAudioPool","playAudioPool","setVolume","stopAudioPool"],"example":"var bombPool = $.createAudioPool(\"bomb.wav\", 1);\n$.ready(function () {\n\t$.playAudioPool(bombPool);\n});"},{"name":"deleteAudioPool","description":"Deletes an audio pool.","isScreen":false,"parameters":["audioId"],"pdata":["The id of the audio pool."],"seeAlso":["createAudioPool","playAudioPool","setVolume","stopAudioPool"],"example":"var bombPool = $.createAudioPool(\"bomb.wav\", 1);\n$.deleteAudioPool(bombPool);"},{"name":"draw","description":"Draws lines on the screen defined by a string.","isScreen":true,"parameters":["drawString"],"pdata":["Case insensitive string that contains commands for drawing.","<ul style='margin:0'>\n<li><span class='gray'>\"B\"</span> (blind) before a line move designates that the line move will be hidden.</li>\n<li><span class='gray'>\"Cn\"</span> designates the color attribute.</li>\n<li><span class='gray'>\"Mn, n\"</span> can move to another coordinate (x, y) area of the screen.</li>\n<li><span class='gray'>\"N\"</span> Will return to the starting position after the line is drawn.</li>\n<li><span class='gray'>\"Pn\"</span> is used to paint enclosed objects.</li>\n<li><span class='gray'>\"Dn\"</span> draws a line vertically DOWN n pixels.</li>\n<li><span class='gray'>\"En\"</span> draws a diagonal / line going UP and RIGHT n pixels each direction.</li>\n<li><span class='gray'>\"Fn\"</span> draws a diagonal  line going DOWN and RIGHT n pixels each direction.</li>\n<li><span class='gray'>\"Gn\"</span> draws a diagonal / LINE going DOWN and LEFT n pixels each direction.</li>\n<li><span class='gray'>\"Hn\"</span> draws a diagonal  LINE going UP and LEFT n pixels each direction.</li>\n<li><span class='gray'>\"Ln\"</span> draws a line horizontally LEFT n pixels.</li>\n<li><span class='gray'>\"Rn\"</span> draws a line horizontally RIGHT n pixels.</li>\n<li><span class='gray'>\"Un\"</span> draws a line vertically UP n pixels.</li>\n<li><span class='gray'>\"An\"</span> can use values of 1 to 3 to rotate up to 3 90 degree(270) angles.</li>\n<li><span class='gray'>\"TAn\"</span> can use any n angle from -360 to 0 to 360 to rotate a DRAW (Turn Angle).</li>\n</ul>"],"seeAlso":["arc","bezier","circle","ellipse","line","paint","pset","setColor"],"example":"$.screen( \"300x200\" );\n$.pset( 150, 100 );\n$.draw( \"C2 R15 D15 L30 U15 R15\" );\t\t\t\t\t\t// Draw House\n$.draw( \"B G4 C1 L6 D6 R6 U6 BG3 P1\" ); \t\t\t\t// Draw Window\n$.draw( \"B E3 B R14 C1 L6 D6 R6 U6 BG3 P1\" ); \t// Draw Window\n$.draw( \"B E3 B R1 P2\" );\t\t\t\t\t\t\t\t\t\t// Paint House\n$.draw( \"B E4 B U C6 H15 G15 B R5 P6\" );\t\t\t\t// Draw Roof\n"},{"name":"drawImage","description":"Draws an image on to the screen.","isScreen":true,"parameters":["name","x","y","angle","anchorX","anchorY","alpha"],"pdata":["Name or id of the image.","Horizontal coordinate.","Vertical coordinate.","[OPTIONAL]. Rotate the image in degrees.","[OPTIONAL]. Horizontal rotation coordinate.","[OPTIONAL]. Vertical rotation coordinate.","[OPTIONAL]. Transparency amount number 0-100."],"seeAlso":["drawSprite","loadImage","ready"],"example":"$.screen( \"300x200\" );\nvar monkey = $.loadImage( \"monkey.png\" );\n$.ready( function () {\n\t$.drawImage( monkey, 150, 100, 0, 0.5, 0.5 );\n} );\n"},{"name":"drawSprite","isScreen":true,"description":"Draws a sprite from a spritesheet on to the screen.","parameters":["name","frame","x","y","angle","anchorX","anchorY","alpha"],"pdata":["Name or id of the spritesheet.","Frame number of the specific sprite on the spritesheet.","Horizontal coordiante.","Vertical coordinate.","[OPTIONAL]. Rotate the image in degrees.","[OPTIONAL]. Horizontal rotation coordinate.","[OPTIONAL]. Vertical rotation coordinate.","[OPTIONAL]. Transparency amount number 0-100."],"seeAlso":["drawImage","loadSpritesheet","ready"],"example":"var monkey, frame, interval;\n$.screen( \"300x200\" );\nmonkey = $.loadSpritesheet( \"monkey.png\", 32, 32, 1 );\n$.ready( function () {\n\tframe = 0;\n\tinterval = setInterval( run, 500 );\n\tfunction run() {\n\t\tframe += 1;\n\t\t$.cls();\n\t\t$.drawSprite( monkey, frame % 2, 150, 100, 0, 0.5, 0.5 );\n\t}\n\trun();\n} );","onclose":"clearInterval( interval );\n"},{"name":"ellipse","description":"Draws an ellipse on to the screen.","isScreen":true,"parameters":["x","y","radiusX","radiusY","fillColor"],"pdata":["Horizontal coordiante.","Vertical coordinate.","Horizontal radius.","Vertical radius","[OPTIONAL]. Fill color for the ellipse."],"seeAlso":["arc","bezier","circle","draw","line","paint","pset","setColor"],"example":"$.screen(\"300x200\");\n$.ellipse(150, 100, 50, 80, \"blue\");"},{"name":"filterImg","description":"Filters a screens colors.","isScreen":true,"parameters":["filter"],"pdata":["Function to be called on each pixel."],"seeAlso":["setColor"],"example":"$.screen(\"300x200\");\n$.circle(150, 100, 50, \"red\");\n$.filterImg(function (color, x, y) {\n\tcolor.r = color.r - Math.round( Math.tan( ( x + y ) / 10 ) * 128 );\n\tcolor.g = color.g + Math.round( Math.cos( x / 7 ) * 128 );\n\tcolor.b = color.b + Math.round( Math.sin( y / 5 ) * 128 );\n\treturn color;\n});"},{"name":"findColor","isScreen":true,"description":"Given a color value, find the index from the color palette.","parameters":["color","tolerance","isAddToPalette"],"pdata":["The color to be found.","The percentage of how close the color has to be to match. Returns the fist match.","Add the color to the palette if its not found."],"seeAlso":["setColor"],"example":"$.screen(\"300x200\");\nvar color = $.findColor(\"red\");\n$.setColor(color);\n$.print(\"The index of red is \" + color + \".\");\n"},{"name":"get","description":"Gets an area of pixels from the screen and returns an array of color indices.","isScreen":true,"parameters":["x1","y1","x2","y2","tolerance"],"pdata":["First horizontal coordiante.","First vertical coordinate.","Second horizontal coordiante.","Second vertical coordinate.","[OPTIONAL]. If the color is not in the color palette then attempt to find the closest fit color."],"seeAlso":["put","setColor"],"example":"$.screen(\"300x200\");\n$.circle(150, 100, 50, 4);\nvar colors = $.get(105, 75, 110, 75);\n$.print(colors[0].join(\",\"));\n"},{"name":"getCols","description":"Gets the max number of printable characters in a row on the screen.","isScreen":true,"parameters":[],"seeAlso":["getPos","getPosPx","getRows","print","setFont","setFontSize","setPos","setPosPx"],"example":"// Print a line of *'s on the top of the screen\n$.screen(\"300x200\");\nvar cols = $.getCols();\nvar msg = \"\";\nfor(var i = 0; i < cols; i++) {\n\tmsg += \"*\";\n}\n$.print(msg);\n"},{"name":"getDefaultPal","description":"Gets default palette and returns an array with all the color data.","isScreen":false,"parameters":[],"seeAlso":["findColor","getPal","getPixel","setBgColor","setColor","setColors","setPalColor","swapColor"],"example":"$.screen(\"300x200\");\nvar pal = $.getDefaultPal();\n$.setColor( 4 );\n$.print( pal[ 4 ].s );\n"},{"name":"getPal","isScreen":true,"description":"Gets current palette from the screen and returns an array with all the color data.","parameters":[],"seeAlso":["findColor","getDefaultPal","getPixel","setBgColor","setColor","setColors","setPalColor","swapColor"],"example":"$.screen(\"300x200\");\nvar pal = $.getPal();\n$.setColor( 2 );\n$.print( pal[ 2 ].s );\n"},{"name":"getPixel","description":"Gets the pixel color from the screen and returns the color data.","isScreen":true,"parameters":["x","y"],"pdata":["The horizontal coordinate for the pixel","The vertical coordinate for the pixel"],"seeAlso":["get","set"],"example":"$.screen(\"300x200\");\n$.setColor(5);\n$.pset(5, 5);\nvar pixel = $.getPixel(5, 5);\n$.print( pixel.s );\n"},{"name":"getPos","description":"Gets the position of the print cursor and returns the coordinates. The data\nreturned is an object containing a row and a column. Example: { row: 5, col: 5 }. The rows\nand columns are based on a grid system using the size of the font and not on exact pixels.","isScreen":true,"parameters":[],"seeAlso":["getPosPx","print","setPos","setPosPx"],"example":"$.screen(\"300x200\");\n$.setPos(5, 5);\nvar pos = $.getPos();\n$.print(pos.row + \", \" + pos.col);\n"},{"name":"getPosPx","description":"Gets the position of the print cursor and returns the coordinates. The data\nreturned is an object containing a row and a column. Example: { x: 5, y: 5 }. The x\nand y coordinates are based on top left corner pixel position of the print cursor.","isScreen":true,"parameters":[],"seeAlso":["getPos","print","setPos","setPosPx"],"example":"$.screen(\"300x200\");\n$.setPosPx(15, 15);\nvar pos = $.getPosPx();\n$.print(pos.x + \", \" + pos.y);\n"},{"name":"getRows","description":"Gets the max number of printable characters in a column on the screen.","isScreen":true,"parameters":[],"seeAlso":["getPos","getPosPx","getCols","print","setFont","setFontSize","setPos","setPosPx"],"example":"// Print a line of *'s on the left of the screen\n$.screen(\"300x200\");\nvar rows = $.getRows();\nvar msg = \"\";\nfor(var i = 0; i < rows; i++) {\n\tmsg += \"*\\n\";\n}\n$.print(msg);\n"},{"name":"getScreen","description":"Gets the screen based on a screen id.","isScreen":false,"parameters":["screenId"],"seeAlso":["screen"],"example":"$.screen(\"300x200\");\nvar $screen = $.getScreen(0);\n$screen.print(\"This is screen 0.\");\n"},{"name":"height","description":"Returns the height of the screen.","isScreen":true,"parameters":[],"seeAlso":["screen","width"],"example":"$.screen( \"300x200\" );\n$.print( \"Height: \" + $.height() );\n"},{"name":"ingamepads","description":"Gets the most recent gamepad status.","isScreen":false,"parameters":[],"seeAlso":["ongamepad"],"returns":"An array of gamepad objects.\n","example":"var x, y, frame;\n$.screen( \"300x200\" );\n$.setColor( 15 );\nx = 150;\ny = 100;\nrequestAnimationFrame( run );\nfunction run( dt ) {\n\tvar pads, factor;\n\tfactor = dt / 2500;\n\tpads = $.ingamepads( 0 );\n\t$.cls();\n\tif( pads.length > 0 ) {\n\t\tx = qbs.util.clamp( x + pads[ 0 ].axes[ 0 ] * factor, 0, 299 );\n\t\ty = qbs.util.clamp( y + pads[ 0 ].axes[ 1 ] * factor, 0, 199 );\n\t\t$.circle( Math.floor( x ), Math.floor( y ) , 10 );\n\t\t$.pset( Math.floor( x ), Math.floor( y ) );\n\t}\n\tframe = requestAnimationFrame( run );\n}\n","onclose":"cancelAnimationFrame( frame );\n"},{"name":"inkey","description":"Gets the most recent status of keys.","returns":"If the first parameter is left blank then it will return an array of key data objects. If not then it returns the\nan object containing data for a single key.","isScreen":false,"parameters":["key"],"pdata":["Name (string) or keyCode (integer) of key to return the status. Leave blank for the status of all keys that have been pressed."],"seeAlso":["input","inpress","inmouse","intouch"],"example":"$.screen( \"300x200\" );\nvar frame = requestAnimationFrame( run );\nfunction run() {\n\tvar keys, key;\n\tkeys = $.inkey();\n\t$.cls();\n\t$.print( \"Press any key\" );\n\tfor( key in $.inkey() ) {\n\t\t$.print( \"--------------------------\" );\n\t\t$.print( \"key:      \" + keys[ key ].key );\n\t\t$.print( \"location: \" + keys[ key ].location );\n\t\t$.print( \"code:     \" + keys[ key ].code );\n\t\t$.print( \"keyCode:  \" + keys[ key ].keyCode );\n\t}\n\tframe = requestAnimationFrame( run );\n}\n","onclose":"cancelAnimationFrame( frame );\n"},{"name":"inmouse","description":"Gets the most recent mouse status.","isScreen":true,"parameters":[],"returns":"An object containing data about the mouse's position and button status.","seeAlso":["inpress","offmouse","onmouse","startMouse","stopMouse"],"example":"$.screen( \"4x4\" );\nvar interval = setInterval( function () {\n\tvar mouse = $.inmouse();\n\tif( mouse.buttons > 0 ) {\n\t\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t\t$.pset( mouse.x, mouse.y );\n\t}\n}, 50 );\n","onclose":"clearInterval( interval );\n"},{"name":"inpress","description":"Gets the most recent mouse or touch status.","isScreen":true,"parameters":[],"returns":"An object containing data about the mouse or touch position and press status.","seeAlso":["inmouse","intouch","offmouse","ontouch","onmouse","setPinchZoom","startMouse","startTouch","stopMouse","stopTouch"],"example":"$.screen( \"4x4\" );\n$.startTouch();\n$.setPinchZoom( false );\nvar interval = setInterval( function () {\n\tvar press = $.inpress();\n\tif( press.buttons > 0 ) {\n\t\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t\t$.pset( press.x, press.y );\n\t}\n}, 50 );\n","onclose":"clearInterval( interval );\n"},{"name":"input","isScreen":true,"parameters":["prompt","callback","isNumber","isInteger","allowNegative","onscreenKeyboard"],"description":"Shows a prompt on screen and allows a user type in a string. The prompt is ended when the user\npresses the return key. There are two ways to get the data returned. The function returns a\npromise that will pass the response data. You can also pass a callback function which will get\ncalled when the enter key is pressed.\n","pdata":["The text that will display when the user is entering text.","A function you can pass which will get called when the user presses the return key.","Limit the data to numeric data only.","Limit the data to integer values only.","A boolean that indicates if negative numbers are allowed.","A string value that can specify an onscreen keyboard valid values include: \"auto\", \"always\", \"none\"."],"seeAlso":["inkey"],"returns":"A promise that will return the users response.","example":"$.screen( \"300x200\" );\naskQuestions();\nasync function askQuestions() {\n\tvar name = await $.input( \"What is your name? \" );\n\tvar age = await $.input( \"How old are you? \", null, true, true, false, \"always\" );\n\t$.print( \"Your name is \" + name + \" you are \" + age + \" years old.\" );\n}\n"},{"name":"intouch","description":"Gets the most recent touch status.","isScreen":true,"parameters":[],"seeAlso":["inpress","ontouch","setPinchZoom","startTouch","stopTouch"],"example":"$.screen( \"4x4\" );\n$.startTouch();\n$.setPinchZoom( false );\nvar interval = setInterval( function () {\n\tvar touches = $.intouch();\n\tif( touches.length > 0 ) {\n\t\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t\t$.pset( touches[ 0 ].x, touches[ 0 ].y );\n\t}\n}, 50 );\n","onclose":"clearInterval( interval );\n"},{"name":"line","isScreen":true,"parameters":["x1","y1","x2","y2"],"description":"Draws a line on the screen.","pdata":["The first x coordinate of the line.","The first y coordinate of the line.","The second x coordinate of the line.","The second y coordinate of the line."],"seeAlso":["arc","bezier","circle","draw","ellipse","paint","pset","setColor"],"example":"$.screen( \"300x200\" );\n$.setColor( 4 );\n$.line( 15, 15, 285, 185 );\n$.setColor( 2 );\n$.line( 15, 185, 285, 15 );\n"},{"name":"loadFont","isScreen":false,"parameters":["fontSrc","width","height","charSet","isBitmap"],"description":"Loads a font from an image or encoded string.","pdata":["The source location of the image or the encoded string location.","The width of each character in the font.","The height of each character in the font.","[OPTIONAL] An array of integers containing the ascii value for each font character in order.","[OPTIONAL] Boolean to use the font as a bitmap font versus a pixel font. Pixel fonts (default) are slower but can change colors."],"returns":"The id of the font.","seeAlso":["print","setDefaultFont","setFont"],"example":"var font = $.loadFont( \"font-block2.png\", 10, 10, [ 65, 66, 67, 68 ] );\n$.ready( function () {\n\t$.screen( \"300x200\" );\n\t$.setFont( font );\n\t$.print( \"AAABBBCCCDDD\" );\n} );\n"},{"name":"loadImage","description":"Loads an image for later use in the drawImage command. It is recommended to use the ready command after loadImage and before calling the drawImage command.\n","isScreen":false,"parameters":["src","name"],"pdata":["The source location of an image file or an image element.","[OPTIONAL]. A name you can use to refer to the image later in the drawImage command. Ifleft blank then the name will be created automatically."],"returns":"The name of image to use with the drawImage command.","seeAlso":["drawImage","loadImage","ready"],"example":"$.screen( \"300x200\" );\n$.loadImage( \"monkey.png\", \"monkey\" );\n$.ready( function () {\n\t$.drawImage( \"monkey\", 150, 100, 0, 0.5, 0.5 );\n} );\n"},{"name":"loadSpritesheet","isScreen":false,"parameters":["src","width","height","margin","name"],"description":"Loads an image for later use in the drawSprite command. It is recommended to use the ready command after loadSpritesheet and before calling the drawSprite command.\n","pdata":["The source location of an image file or an image element.","The width of each sprite in the spritesheet.","The height of each sprite in the spritesheet.","A margin in pixels around each sprite.","[OPTIONAL]. The name of the sprite for use in the drawSprite command."],"seeAlso":["drawSprite","loadSpritesheet","ready"],"example":"var frame, interval;\n$.screen( \"300x200\" );\n$.loadSpritesheet( \"monkey.png\", 32, 32, 1, \"monkey\" );\n$.ready( function () {\n\tframe = 0;\n\tinterval = setInterval( run, 500 );\n\tfunction run() {\n\t\tframe += 1;\n\t\t$.cls();\n\t\t$.drawSprite( \"monkey\", frame % 2, 150, 100, 0, 0.5, 0.5 );\n\t}\n\trun();\n} );","onclose":"clearInterval( interval );\n"},{"name":"offclick","isScreen":true,"parameters":["fn"],"description":"Removes a hitbox from the screen created by the onclick command.\n","pdata":["The function that was used to create the hitbox by the onclick command."],"seeAlso":["onclick"],"example":"$.screen( \"300x200\" );\nvar hitBox = {\n\t\"x\": 25,\n\t\"y\": 25,\n\t\"width\": 100,\n\t\"height\": 100\n};\n\n// Draw a green box\n$.setColor( 2 );\n$.rect( hitBox );\n\n// Setup the onclick function for the hitBox\n$.onclick( clickBox, false, hitBox );\n\n// Click function\nfunction clickBox() {\n\n\t// Draw a red box\n\t$.setColor( 4 );\n\t$.rect( hitBox );\n\t$.offclick( clickBox );\n\n\t// Wait a second then clear the box\n\tsetTimeout( function () {\n\t\t$.setColor( 0 );\n\t\t$.rect( hitBox );\n\t}, 1000 );\n}\n"},{"name":"offgamepad","isScreen":false,"parameters":["gamepadIndex","mode","item","fn"],"description":"Removes a gamepad event created by the ongamepad command.\n","pdata":["The index of the gamepad.","The event mode must be one of the following strings: connect, disconnect, axis,pressed, touched, pressReleased, touchReleased.","The index of the button or axis for the event. Use the string 'any' for any button or axis.","The function to be called back for the event."],"seeAlso":["ingamepads","ongamepad","stopGamepads"],"example":"$.screen( \"300x300\" );\n$.print( \"Press button 3 to stop\" );\n$.ongamepad( 0, \"pressed\", \"any\", pressButton );\n$.ongamepad( 0, \"pressed\", 3, stop );\n\n// Press button function\nfunction pressButton( btn ) {\n\tconsole.log( btn );\n\t$.print( \"Button \" + btn.index + \" pressed\" );\n}\n\n// Stop function\nfunction stop() {\n\t$.offgamepad( 0, \"pressed\", \"any\", pressButton );\n\t$.offgamepad( 0, \"pressed\", 3, stop );\n\t$.print( \"Stopped\" );\n}\n"},{"name":"offkey","isScreen":false,"parameters":["key","mode","fn"],"description":"Removes an onkey event.\n","pdata":["The key that was used in the onkey command.","The mode can be up or down.","The function that was used to create the hitbox by the onclick command."],"seeAlso":["onkey"],"example":"$.screen( \"300x200\" );\n$.print( \"Press any key.\" );\n$.print( \"Press q to stop\" );\n$.onkey( \"any\", \"down\", keyPress );\n$.onkey( \"Q\", \"down\", stopPress );\n\n// Key press function\nfunction keyPress( key ) {\n\t$.print( \"You pressed \" + key.key + \"!\" );\n}\n\n// Stop key press function\nfunction stopPress() {\n\t$.print( \"You pressed Q! Stopping.\" );\n\t$.offkey( \"any\", \"down\", keyPress );\n\t$.offkey( \"Q\", \"down\", keyPress );\n}\n"},{"name":"offmouse","isScreen":true,"parameters":["mode","fn"],"description":"Removes an onmouse event.\n","pdata":["The mode must be a string and can be up, down, or move.","The function that was used to create the hitbox by the onclick command."],"seeAlso":["onmouse"],"example":"$.screen( \"300x200\" );\n$.print( \"Move mouse to paint screen, click to stop.\" );\n$.onmouse( \"move\", mouseMove );\n$.onmouse( \"up\", mouseStop, true );\n\n// Mouse move function\nfunction mouseMove( data ) {\n\t$.setPosPx( data.x, data.y );\n\tvar pos = $.getPos();\n\t$.setPos( pos.col, pos.row );\n\t$.setColor( 8 );\n\t$.print( \"+\", true );\n}\n\n// Mouse stop function\nfunction mouseStop() {\n\t$.setColor( 14 );\n\tvar pos = $.getPos();\n\t$.setPos( pos.col - 4, pos.row );\n\t$.print( \"Stopped!\", true );\n\t$.offmouse( \"move\", mouseMove );\n}\n"},{"name":"offpress","isScreen":true,"parameters":["mode","fn","once","hitBox"]},{"name":"offtouch","isScreen":true,"parameters":["mode","fn"]},{"name":"onclick","isScreen":true,"parameters":["fn","once","hitBox","customData"],"description":"Creates an area on the screen that when the user clicks in that area a function is called. In order for a click event to trigger the user must move the mouse cursor over the hitbox area and\nmouse down and mouse up over that area.\n","pdata":["The function that gets called when the area is clicked.","Boolean if set to true the event will be deleted after it is clicked.","The hitBox area for where the click event will occur. { x, y, width, height }.","[OPTIONAL]. This can be used to assign data that will be passed into the callback event. This is useful if you have multiple onclick commands that use the same callback function."],"seeAlso":["offclick"],"example":"$.screen( \"300x200\" );\nvar hitBox = {\n\t\"x\": 25,\n\t\"y\": 25,\n\t\"width\": 100,\n\t\"height\": 100\n};\n\n// Draw a green box\n$.setColor( 2 );\n$.rect( hitBox );\n\n// Setup the onclick function for the hitBox\n$.onclick( clickBox, true, hitBox );\n\n// Click function\nfunction clickBox() {\n\n\t// Draw a red box\n\t$.setColor( 4 );\n\t$.rect( hitBox );\n\n\t// Wait a second then clear the box\n\tsetTimeout( function () {\n\t\t$.setColor( 0 );\n\t\t$.rect( hitBox );\n\t}, 1000 );\n}\n"},{"name":"ongamepad","isScreen":false,"parameters":["gamepadIndex","mode","item","fn","once","customData"],"description":"Creates a gamepad event listener.\n","pdata":["The index of the gamepad.","The event mode must be one of the following strings: connect, disconnect, axis,pressed, touched, pressReleased, touchReleased.","The index of the button or axis for the event. Use the string 'any' for any button or axis.","The function to be called back for the event.","Boolean if set to true the event will be deleted after it is triggered.","[OPTIONAL]. This can be used to assign data that will be passed into the callback event. This is useful if you have multiple ongamepad commands that use the same callback function."],"seeAlso":["ingamepads","ongamepad","stopGamepads"],"example":"$.screen( \"300x300\" );\n$.print( \"Press button 3 to stop\" );\n$.ongamepad( 0, \"pressed\", \"any\", pressButton );\n$.ongamepad( 0, \"pressed\", 3, stop );\n\n// Press button function\nfunction pressButton( btn ) {\n\t$.print( \"Button \" + btn.index + \" pressed\" );\n}\n\n// Stop function\nfunction stop() {\n\t$.offgamepad( 0, \"pressed\", \"any\", pressButton );\n\t$.offgamepad( 0, \"pressed\", 3, stop );\n\t$.print( \"Stopped\" );\n}\n"},{"name":"onkey","isScreen":false,"parameters":["key","mode","fn","once"],"description":"Creates an onkey event.\n","pdata":["The key that was used in the onkey command.","The mode can be up or down.","The function that was used to create the hitbox by the onclick command.","[OPTIONAL]. Boolean if true will delete event after the first time it is triggered."],"seeAlso":["offkey"],"example":"$.screen( \"300x200\" );\n$.print( \"Press any key.\" );\n$.print( \"Press q to stop\" );\n$.onkey( \"any\", \"down\", keyPress );\n$.onkey( \"Q\", \"down\", stopPress, true );\n\n// Key press function\nfunction keyPress( key ) {\n\t$.print( \"You pressed \" + key.key + \"!\" );\n}\n\n// Stop key press function\nfunction stopPress() {\n\t$.print( \"You pressed Q! Stopping.\" );\n\t$.offkey( \"any\", \"down\", keyPress );\n}\n"},{"name":"onmouse","isScreen":true,"parameters":["mode","fn","once","hitBox","customData"],"description":"Removes an onmouse event.\n","pdata":["The mode must be a string and can be up, down, or move.","The function to callback when the event occurs.","[OPTIONAL]. A boolean if true deletes the event after being called one time.","[OPTIONAL]. A hitBox to restrict events occuring outside the box","[OPTIONAL]. This can be used to assign data that will be passed into the callback event. This is useful if you have multiple onmouse commands that use the same callback function."],"seeAlso":["offmouse"],"example":"$.screen( \"300x200\" );\n$.print( \"Move mouse to paint screen, click to stop.\" );\n$.onmouse( \"move\", mouseMove );\n$.onmouse( \"up\", mouseStop, true );\n\n// Mouse move function\nfunction mouseMove( data ) {\n\t$.setPosPx( data.x, data.y );\n\tvar pos = $.getPos();\n\t$.setPos( pos.col, pos.row );\n\t$.setColor( 8 );\n\t$.print( \"+\", true );\n}\n\n// Mouse stop function\nfunction mouseStop() {\n\t$.setColor( 14 );\n\tvar pos = $.getPos();\n\t$.setPos( pos.col - 4, pos.row );\n\t$.print( \"Stopped!\", true );\n\t$.offmouse( \"move\", mouseMove );\n}\n"},{"name":"onpress","isScreen":true,"parameters":["mode","fn","once","hitBox","customData"]},{"name":"ontouch","description":"Create a touch event\n","isScreen":true,"parameters":["mode","fn"],"pdata":["The type of touch event. Must be a string value set to \"start\", \"end\", or \"move\".","The function to called when touch occurs. The first parameter will contain the touches data."],"seeAlso":["intouch","setPinchZoom","startTouch","stopTouch"],"example":"$.screen( \"4x4\" );\n$.setPinchZoom( false );\n$.ontouch( \"start\", function ( touches ) {\n\tvar touch = touches[ 0 ];\n\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t$.pset( touch.x, touch.y );\n} );\n"},{"name":"paint","isScreen":true,"parameters":["x","y","fillColor","tolerance"]},{"name":"play","isScreen":false,"parameters":["playString"]},{"name":"playAudioPool","isScreen":false,"parameters":["audioId","volume","startTime","duration"]},{"name":"point","isScreen":true,"parameters":["x","y"]},{"name":"print","isScreen":true,"parameters":["msg","inLine","isCentered"]},{"name":"printTable","isScreen":true,"parameters":["items","tableFormat","borderStyle","isCentered"]},{"name":"pset","isScreen":true,"parameters":["x","y"]},{"name":"put","isScreen":true,"parameters":["data","x","y","includeZero"]},{"name":"ready","isScreen":false,"parameters":["fn"]},{"name":"rect","isScreen":true,"parameters":["x","y","width","height","fillColor"]},{"name":"removeAllScreens","isScreen":false,"parameters":[]},{"name":"removeScreen","isScreen":true,"parameters":[]},{"name":"render","isScreen":true,"parameters":[]},{"name":"screen","description":"When the screen command is called it will create a canvas element and when graphics\ncommands are called they will manipulate the canvas created. There are three types\nof canvas styles that can be created a fullscreen canvas that gets appended to the\nbody of the page, a canvas that gets appended to a container element supplied, or\nan offscreen canvas.\n","isScreen":false,"parameters":["aspect","container","isOffscreen","noStyles","isMultiple","resizeCallback"]},{"name":"set","isScreen":true,"parameters":["screen","defaultPal","errorMode","actionKey","inputCursor","defaultFont","font","fontSize","enableContextMenu","pinchZoom","bgColor","containerBgColor","pixelMode","palColor","color","colors","pen","wordBreak","pos","posPx","volume"],"isSet":true,"noParse":true},{"name":"setActionKey","isScreen":false,"parameters":["key","isEnabled"]},{"name":"setAutoRender","isScreen":true,"parameters":["isAutoRender"]},{"name":"setBgColor","isScreen":true,"parameters":["color"]},{"name":"setColor","isScreen":true,"parameters":["color","isAddToPalette"]},{"name":"setColors","isScreen":true,"parameters":["colors"]},{"name":"setContainerBgColor","isScreen":true,"parameters":["color"]},{"name":"setDefaultFont","isScreen":false,"parameters":["fontId"]},{"name":"setDefaultPal","isScreen":false,"parameters":["pal"]},{"name":"setEnableContextMenu","isScreen":true,"parameters":["isEnabled"]},{"name":"setErrorMode","isScreen":false,"parameters":["mode"]},{"name":"setFont","isScreen":true,"parameters":["fontId"]},{"name":"setFontSize","isScreen":true,"parameters":["width","height"]},{"name":"setInputCursor","isScreen":true,"parameters":["cursor"]},{"name":"setPalColor","isScreen":true,"parameters":["index","color"]},{"name":"setPen","isScreen":true,"parameters":["pen","size","noise"]},{"name":"setPinchZoom","isScreen":false,"parameters":["isEnabled"],"pdata":["Set to true if you want to enable this is the default state. Set to false if you want to disable zoom."],"description":"Enables or disables pinch zoom. This is recommended when working with touch if you want to disable zoom.\n","seeAlso":["intouch","ontouch","startTouch","stopTouch"],"example":"$.screen( \"4x4\" );\n$.setPinchZoom( false );\n$.ontouch( \"start\", function ( touches ) {\n\tvar touch = touches[ 0 ];\n\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t$.pset( touch.x, touch.y );\n} );\n"},{"name":"setPixelMode","isScreen":true,"parameters":["isEnabled"]},{"name":"setPos","isScreen":true,"parameters":["col","row"]},{"name":"setPosPx","isScreen":true,"parameters":["x","y"]},{"name":"setScreen","isScreen":false,"parameters":["screen"]},{"name":"setVolume","isScreen":false,"parameters":["volume"]},{"name":"setWordBreak","isScreen":true,"parameters":["isEnabled"]},{"name":"sound","isScreen":false,"parameters":["frequency","duration","volume","oType","delay","attack","decay"]},{"name":"startKeyboard","isScreen":false,"parameters":[]},{"name":"startMouse","isScreen":true,"parameters":[]},{"name":"startTouch","description":"Starts the touch event listeners for the screen. This will get called automatically when any\ntouch command gets called.\n","isScreen":true,"parameters":[],"seeAlso":["intouch","ontouch","setPinchZoom","stopTouch"],"example":"$.screen( \"4x4\" );\n$.startTouch();\n$.setPinchZoom( false );\n$.ontouch( \"start\", function ( touches ) {\n\tvar touch = touches[ 0 ];\n\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t$.pset( touch.x, touch.y );\n} );\n"},{"name":"stopAudioPool","isScreen":false,"parameters":["audioId"]},{"name":"stopGamepads","isScreen":false,"parameters":[]},{"name":"stopKeyboard","isScreen":false,"parameters":[]},{"name":"stopMouse","isScreen":true,"parameters":[]},{"name":"stopPlay","isScreen":false,"parameters":["trackId"]},{"name":"stopSound","isScreen":false,"parameters":["soundId"]},{"name":"stopTouch","description":"Stops the touch event listeners for the screen.\n","isScreen":true,"parameters":[],"seeAlso":["intouch","ontouch","setPinchZoom","startTouch"],"example":"$.screen( \"100x100\" );\n$.startTouch();\n$.setPinchZoom( false );\nvar count = 5;\n$.print( count + \" touches left\" );\n$.ontouch( \"start\", function ( touches ) {\n\t$.setColor( Math.floor( Math.random() * 9 ) + 1 );\n\t$.print( --count + \" touches left\" );\n\tvar touch = touches[ 0 ];\n\t$.pset( touch.x, touch.y );\n\tif( count === 0 ) {\n\t\t$.stopTouch();\n\t}\n} );\n"},{"name":"swapColor","isScreen":true,"parameters":["oldColor","newColor"]},{"name":"util.checkColor","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.clamp","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.colorStringToHex","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.compareColors","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.convertToArray","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.convertToColor","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.copyProperties","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.cToHex","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.degreesToRadian","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.deleteProperties","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.getWindowSize","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.hexToColor","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.inRange","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.inRange2","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.isArray","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.isDomElement","isScreen":false,"parameters":["el"]},{"name":"util.isFunction","isScreen":false,"parameters":["fn"]},{"name":"util.isInteger","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.math","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.pad","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.padL","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.padR","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.queueMicrotask","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.radiansToDegrees","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.rgbToColor","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.rgbToHex","isScreen":false,"isUtil":true,"parameters":[]},{"name":"util.rndRange","isScreen":false,"isUtil":true,"parameters":[]},{"name":"width","description":"Returns the width of the screen.","isScreen":true,"parameters":[],"seeAlso":["height","screen"],"example":"$.screen( \"300x200\" );\n$.print( \"Width: \" + $.width() );\n"}];