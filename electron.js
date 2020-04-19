const { app, BrowserWindow } = require('electron')

function createWindow () {
  // Create the browser window.
  let win = new BrowserWindow({
    width: 350,
    height: 500,
    webPreferences: {
      nodeIntegration: true
    }
  })

  win.loadURL(`file://${__dirname}/dist/snake-angular-electron/index.html`)
}

app.allowRendererProcessReuse = true;
app.whenReady().then(createWindow)
