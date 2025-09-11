//main.js
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isDev = !app.isPackaged; // check if dev or prod

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 450,
    height: 600,
    resizable: false,
    frame: false,
    transparent: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    // Dev → run Vite
    win.loadURL("http://localhost:5173");
  } else {
    // Prod → load React build
    win.loadFile(
      path.resolve(__dirname, "Timer-frontend", "dist", "index.html")
    );
  }
  // 🔍 Always open DevTools (helps in debugging black screen)
  win.webContents.openDevTools();

  // 🔍 Log console errors
  win.webContents.on("console-message", (event, level, message) => {
    console.log(`Renderer console: [${level}] ${message}`);
  });

  // 🔍 Log crashes/errors
  win.webContents.on("crashed", () => {
    console.error("Renderer crashed!");
  });

  win.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    console.error("Page failed to load:", errorCode, errorDescription);
  });
}

ipcMain.on("close-window", () => {
  if (win) win.close();
});

app.whenReady().then(() => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
