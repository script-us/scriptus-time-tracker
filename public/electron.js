const { app, BrowserWindow } = require("electron");
const path = require("path");
const isDev = require("electron-is-dev");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // const startUrl = isDev ? "http://localhost:5173/" : path.join(__dirname, "..", "build", "index.html");

  // if (isDev) {
  //   win.loadURL(startUrl);
  // } else {
  //   win.loadFile(startUrl).catch((err) => console.error("Failed to load index.html", err));
  // }

  // win.loadFile(path.join(__dirname, "..", "build", "index.html"));

  win.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);
  win.webContents.openDevTools();
};

app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
  event.preventDefault();
  callback(true);
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
