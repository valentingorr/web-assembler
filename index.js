const {
	app,
	BrowserWindow,
	ipcMain,
	globalShortcut
} = require("electron");

const path = require("path");

let mainWindow;
let commands = false;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 600,
		autoHideMenuBar: true,
		icon: path.resolve(__dirname, "icon.png"),
		titleBarStyle: "hidden",
		titleBarOverlay: {
			color: "#1d1d1d",
			symbolColor: "#eee",
			height: 30
		},
		webPreferences: {
			nodeIntegration: false,
			worldSafeExecuteJavaScript: true,
			contextIsolation: true,
			preload: path.join(__dirname, "./preload.js")
		}
	});
	mainWindow.loadFile(path.join(__dirname, "./public/index.html"));
	mainWindow.openDevTools();

	mainWindow.once("ready-to-show", () => {
		commands = require("./modules/commands")(mainWindow);
		commands.all.forEach(command => {
			if(!command.hasOwnProperty("binds")) return;
			command.binds.forEach(bind => globalShortcut.register(bind, () => commands[command.name]()));
		});
		mainWindow.webContents.send("commands", commands.all.map((command) => {
			return { name: command.name, binds: command.binds };
		}))
	});

};

app.on("ready", createWindow);
app.on("will-quit", () => globalShortcut.unregisterAll());
app.on("window-all-closed", () => process.platform !== "darwin" ? app.quit() : null);
app.on("activate", () => BrowserWindow.getAllWindows().length === 0 ? createWindow() : null);


if(require("electron-squirrel-startup")) app.quit();
if(!app.isPackaged) require("electron-reload")(__dirname, {
	electron: path.join(__dirname, "node_modules", ".bin", "electron"),
	ignored: [
		path.resolve(__dirname, "./index.js"),
		path.resolve(__dirname, "./node_modules/"),
		path.resolve(__dirname, "./packages/"),
		path.resolve(__dirname, "./modules/")
	]
});

ipcMain.handle("command", (event, receive) => commands[receive.name](...receive.args));
ipcMain.handle("commands", (event, receive) => {
	if(commands) return commands.all.map((command) => {
		return { name: command.name, binds: command.binds };
	})
});