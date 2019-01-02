const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu;
const Tray = electron.Tray;

const globalShortcut = electron.globalShortcut;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

let mainWindow;
let deeplinkingUrl

function createWindow() {
  mainWindow = new BrowserWindow({width: 900, height: 680, frame: false});
  mainWindow.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

  if (process.platform == 'win32') {
    deeplinkingUrl = process.argv.slice(1);
  }
  mainWindow.webContents.on('did-finish-load', () => {
    logEverywhere("createWindow: " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
  })

  mainWindow.on("closed", () => (mainWindow = null));
}

function logEverywhere(s) {
  console.log(s);
  if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.executeJavaScript(`console.log("${s}")`);
  }
}

function focusWindow() {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
}

require("update-electron-app")({
  repo: "davchezt/electron-create-react-app",
  updateInterval: "1 hour"
});

const gotTheLock = app.requestSingleInstanceLock();
if (gotTheLock) {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (process.platform == 'win32') {
      deeplinkingUrl = commandLine.slice(1);
    }
    logEverywhere("second-instance: " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);

    focusWindow();
  });

  app.on("ready", () => {
    createWindow();

    tray = new Tray(isDev ? path.join(__dirname, "/favicon.ico") : path.join(app.getAppPath(), "build/favicon.ico"));
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Dev Tools', type: 'normal', click: () => {
        if (mainWindow) mainWindow.webContents.openDevTools({mode:'undocked'});
      }},
      { type: 'separator' },
      { label: 'Dua', type: 'normal', click: () => {
        deeplinkingUrl = ["harmony://dua/"];
        if (mainWindow) {
          mainWindow.webContents.send("harmony-url", deeplinkingUrl);
          focusWindow();
        }
        logEverywhere("open-url: " + deeplinkingUrl);
      }},
      { label: 'Item 1', type: 'radio', checked: true },
      { label: 'Item 2', type: 'radio' },
      { label: '', type: 'separator' },
      { label: 'Quit', type: 'normal', click: (ev) => {
        app.quit();
      }}
    ])
    tray.setToolTip('Harmony.');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', () => {
      focusWindow();
    });

    contextMenu.items[4].checked = true;

    const ret = globalShortcut.register('CommandOrControl+R', () => {
      console.log('CommandOrControl+R is pressed');
      mainWindow.reload();
    })
  
    if (!ret) {
      console.log('registration failed')
    }
    console.log(globalShortcut.isRegistered('CommandOrControl+R'))
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.setAsDefaultProtocolClient('harmony');

  app.on('open-url', function (event, url) {
    event.preventDefault();
    deeplinkingUrl = url;
    logEverywhere("open-url: " + deeplinkingUrl);
    mainWindow.webContents.send("harmony-url", deeplinkingUrl);
    focusWindow();
  });

  app.on('will-quit', () => {
    globalShortcut.unregisterAll()
  })
}
else {
  app.quit();
  return;
}