const { contextBridge, ipcRenderer } = require("electron");

const api = {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
};

contextBridge.exposeInMainWorld("api", api);

contextBridge.exposeInMainWorld("electronAPI", {
  closeApp: () => ipcRenderer.send("close-app"),
  minimizeApp: () => ipcRenderer.send("minimize-app"),
  fullscreenApp: () => ipcRenderer.send("fullscreen-app"),
});

