const JsonAtlas = require("./database.js");

let window;

const keybinds = JsonAtlas.items.keyBinds;

const commands = new Proxy([

	{
		name: "newProject",
		exec: (...args) => {
			window.webContents.send("newProject");
			return { status: true };
		}
	}

].map(command => {
	const keybind = keybinds.find(bind => command.name === bind.command);
	if(keybind) return {
		...command,
		binds: keybind.binds
	};
	return command;
}), {
	get(target, prop) {
		if(prop === "all") return target;
		const command = target.find(({ name }) => name === prop);
		if(!command) return () => {
			window.webContents.send("notification", {
				type: "error",
				code: 1,
				message: `"${prop}" is not a valid command.`
			});
		};

		return (...args) => new Promise(async (resolve, reject) => {
			const response = await command.exec(...args);
			if(response.status) {
				if(response.hasOwnProperty("resolve")) return resolve(response.resolve);
				return resolve();
			} else {
				if(response.hasOwnProperty("message")) return reject(response.message);
				reject();
			}
		});

	},
});

module.exports = w => {
	window = w;
	return commands;
};