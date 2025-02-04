const { log } = require("console");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

if (require("electron-squirrel-startup")) app.quit();

const isDevEnvironment = process.env.DEV_ENV === "true";

if (isDevEnvironment) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "..", "node_modules", ".bin", "electron"),
    hardResetMethod: "exit",
  });
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  mainWindow.center();
  // mainWindow.maximize();

  // Set up permission handlers
  mainWindow.webContents.session.setPermissionRequestHandler(
    (webContents, permission, callback, details) => {
      console.log("Permission request:", permission, details);

      if (permission === "midi" || permission === "midiSysex") {
        callback(true);
      } else {
        callback(false);
      }
    }
  );

  mainWindow.webContents.session.setPermissionCheckHandler(
    (webContents, permission, requestingOrigin) => {
      console.log("Permission check:", permission, requestingOrigin);

      if (permission === "midi" || permission === "midiSysex") {
        return true;
      }

      return false;
    }
  );

  if (isDevEnvironment) {
    mainWindow.loadURL("http://localhost:5173/");
  } else {
    mainWindow.loadFile(path.join(__dirname, "build", "index.html"));
    log("Electron running in prod mode: 🚀");
  }
};

app.on("ready", createWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("close-app", () => {
  app.quit();
});

ipcMain.on("minimize-app", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  focusedWindow.minimize();
});

ipcMain.on("fullscreen-app", () => {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  if (focusedWindow) {
    const isFullScreen = focusedWindow.isFullScreen();
    focusedWindow.setFullScreen(!isFullScreen);
  }
});
