const {app} = require('electron')
const {BrowserWindow} = require('electron')

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    title:"HamLog",
  })
  mainWindow.loadURL('file://' + __dirname + '/app.html')
})
