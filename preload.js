//preload.js
const { contextBridge, ipcRenderer } = require("electron");

// ✅ Safely expose only what you need
contextBridge.exposeInMainWorld("electronAPI", {
  closeWindow: () => ipcRenderer.send("close-window"),
});

window.addEventListener("DOMContentLoaded", () => {
  console.log("Preload script loaded, DOM ready");
});
