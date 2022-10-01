const path = require("path");

const {
	app
} = require("electron");

const JsonDatabase = require("json-atlas");

const JsonAtlas = new JsonDatabase({
	dir: path.join(app.getPath("userData"), "Data")
});

const db = JsonAtlas.connectTo("assembler");

if(!db.items().hasOwnProperty("windowPreferences")) {
	db.items.windowPreferences = {
		position: [0, 0],
		size: [0, 0]
	}
}

if(!db.items.keyBinds) db.items.keyBinds = [
	{ command: "newProject", binds: [ "CommandOrControl+N" ] },
	{ command: "newViewport", binds: [ "CommandOrControl+Alt+V", "CommandOrControl+Shif+V" ] }
]

module.exports = db;