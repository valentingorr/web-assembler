const JsonAtlas = require("./database.js");
const {
	ipcRenderer
} = require("electron");

let window;

const keybinds = JsonAtlas.items.keyBinds;

const alias = [
	{ name: "newProject", title: "New Project", command: { name: "form", args: ["newProject"] } }
].map(command => {
	const keybind = keybinds.find(bind => command.name === bind.command || command.alias === bind.command);
	if(keybind) return {
		...command,
		binds: keybind.binds
	};
	return command;
});

const commands = new Proxy([
	{
		name: "form",
		exec: (...args) => {
			window.webContents.send("form", args[0]);
			return { status: true };
		}
	},
	{
		name: "projects",
		exec: async (...args) => {
			switch (args[0]) {
				case "open":
					console.log(args[1])
					// window.webContents.send("project", { args[1] });
					return { status: false, message: "error salope" };
					break;
				case "new":
					args[1].viewports = args[1].viewports.map(viewport => {
						const { width, height, background, name } = viewport;
						return { width, height, background, name };
					});
					const id = JsonAtlas.table("projects").insert({
						...args[1],
						title: args[1].title || "untitled"
					})._id;
					return {
						status: true,
						command: {
							name: "projects",
							args: [ "open", { id } ]
						}
					}

					break;
			}
			return { status: false, message: "invalid supplied action" };
		}
	},
	{
		name: "viewports",
		exec: (...args) => {
			const parameters = {
				...args[0]
			};

			switch(parameters.action) {
				case "save":
					const { width, height, name, background } = parameters.viewport;
					JsonAtlas.table("viewports").insert({ size: [width, height], name, background });
					return { status: true };
					break;
				case "get":
					return {
						status: true,
						resolve: JsonAtlas.table("viewports").select()
					}
					break;
				case "remove":
					JsonAtlas.table("viewports").remove(item => item._id === parameters.id);
					return { status: true };
					break;
			}

			return { status: false, message: "invalid supplied action" };
		}
	}

].map(command => {
	const keybind = keybinds.find(bind => command.name === bind.command || command.alias === bind.command);
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
				if(response.hasOwnProperty("command")) return resolve(this.get(target, response.command.name)(...response.command.args));
				return resolve();
			} else {
				if(response.hasOwnProperty("message")) return reject(response);
				reject();
			}
		});

	},
});


module.exports = w => {
	window = w;
	return { commands, alias };
};