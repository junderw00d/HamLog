const {app} = require('electron');
const {BrowserWindow} = require('electron');

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    title:"HamLog",
    titleBarStyle: "hiddenInset",
  });
  mainWindow.loadURL('file://' + __dirname + '/app.html');

  /*
  mainWindow.on("resize", function() {
      mainWindow.webContents.send('message', mainWindow.getSize());
  });
  */

});

const ipc = require('electron').ipcMain;
const dialog = require('electron').dialog;

ipc.on('save-dialog', function (event) {
  const options = {
    title:"Export HamLog Data",
    buttonLabel:"Export",
    defaultPath:app.getPath("desktop")+"/HamLog-data.json",
    showsTagField: false,
    filters: [
      { name: 'JSON', extensions: ["json"] }
    ]
  };
  dialog.showSaveDialog(options, function (filename) {
    event.sender.send('saved-file', filename);
  });
});

ipc.on('open-file-dialog', function (event) {
const openOptions = {
  properties: ['openFile'],
  filters: [
    { name: 'JSON', extensions: ["json"] }
  ],
buttonLabel:"Import",
defaultPath:app.getPath("desktop")
}
  dialog.showOpenDialog(openOptions, function (filename) {
    if (filename) event.sender.send('selected-directory', filename)
  })
})

ipc.on("settings",function (event) {
  var settingsWindow = new BrowserWindow({
    title:"HamLog",
    titleBarStyle: "hiddenInset",
    width:450,
    height:400
  });
  settingsWindow.loadURL('file://' + __dirname + '/settings.html');
});

ipc.on("uninstall",function(event) {
  event.sender.send("hi", app.getAppPath())
});
