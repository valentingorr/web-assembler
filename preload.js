const {
	contextBridge,
	ipcRenderer
} = require("electron");

contextBridge.exposeInMainWorld("bridge", {
	command: name => {
		return (...args) => ipcRenderer.invoke("command", { name, args });
	},
	api: {
		on: (event, callback) => ipcRenderer.on(event, callback),
		send: (event, data) => ipcRenderer.send(event, data),
		invoke: (event, data) => ipcRenderer.invoke(event, data)
	},
});