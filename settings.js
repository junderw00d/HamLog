const ipc = require('electron').ipcRenderer;

document.getElementById("uninstall").onclick = function() {
  var uninstallConfirm = confirm("Are you SURE??");
  if (uninstallConfirm === true) {
    ipc.send("uninstall");
  }
};


document.getElementById("check").onclick = function() {
alert("hi");
ipc.send("checkLatestVersion");
};

ipc.on('versionResponse', function (event, rrr) {
  var latestVersion = JSON.parse(rrr).currentVersion;
  fs.readFile(version.json,function read(err,content) {
    var localVersion = content;

    alert("Local version: " + localVersion + "Latest Version: " + latestVersion);
  });
});
