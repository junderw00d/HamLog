const {app} = require('electron')
const {BrowserWindow} = require('electron')


app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    title:"HamLog",
    titleBarStyle: "hiddenInset",
  })
  mainWindow.loadURL('file://' + __dirname + '/app.html')

  /*
  mainWindow.on("resize", function() {
      mainWindow.webContents.send('message', mainWindow.getSize());
  });
  */

});
