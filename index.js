const {app} = require('electron');
const {BrowserWindow} = require('electron');

var fs = require("fs-extra");

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    title:"HamLog",
    titleBarStyle: "hiddenInset",
  });
  mainWindow.loadURL('file://' + __dirname + '/app.html');
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
  event.sender.send("uninstallResponse", app.getAppPath());
});

ipc.on("checkLatestVersion",function(event) {
  const {net} = require('electron')
  const request = net.request({
      url: 'https://raw.githubusercontent.com/KoalaMuffin/HamLog/master/version.json',
  });
  request.on('response', (response) => {
    response.on('data', (versionRequestResponse) => {

      fs.readFile(app.getAppPath()+"/version.json","utf8", function read(err,localVersionContent) {
      var localVersion = localVersionContent;
versionRequestResponseJSON = JSON.parse(versionRequestResponse);
      versionRequestResponseJSON.localVersion = JSON.parse(localVersionContent).latestVersion;
      event.sender.send("versionResponse", JSON.stringify(versionRequestResponseJSON));
    });
    });
  });
  request.end()
});
