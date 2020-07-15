const fs = require('fs');
const toml = require("@iarna/toml");
const buildFile = "build.toml";

// Start the process
readBuilds();

function readBuilds() {
	
	fs.readFile(buildFile, "utf8", function(err, data) {
		let builds = toml.parse(data).builds;
		for(let i = 0; i < builds.length; i++) {
			console.log("---------------------------");
			console.log(builds[i].name);
			readFiles(builds[i]);
		}
	});
}

// Combine and minify all files
function processFiles(build) {

	console.log("");
	console.log("* Minifying Code *");

	let fileOut = build.name + ".min.js";
	let fileMap = build.name + ".min.js.map";

	// Minify the code
	let result = "";

	for(let i = 0; i < build.files.length; i++) {
		result += build.fileData[build.files[i]];
	}

	// Log success method
	console.log("Success");

	writeFile( "build/" + fileOut );
	writeFile( "../qbs-pixel/qbs/" + fileOut );

	function writeFile( fileName ) {

		// Write output to file
		fs.writeFile( fileName, result, function (err) {

			// If unable to write to file throw error
			if(err) {
				throw err;
			}

			// Log file created message
			console.log( "Created new file " + fileName );
		} );
	}
}

// Read all the files
function readFiles(build) {

	build.fileData = {};
	let filesLoaded = 0;
	for(let i = 0; i < build.files.length; i++) {
		build.fileData[build.files[i]] = "";
	}
	console.log("");
	console.log("* Reading files *");

	// Loop through all the files
	for(let filename in build.fileData) {

		// Read the file
		fs.readFile(filename, "utf8", function(err, data) {
			
			// If unable to read a file throw an error
			if(err) {
				throw err;
			}

			// Log the file name
			console.log(filename);

			// Save the data to the files array
			build.fileData[filename] = data;

			// Check if all files are loaded
			filesLoaded++;
			if(filesLoaded === Object.keys(build.fileData).length) {
				processFiles(build);
			}
		});
	}
}
