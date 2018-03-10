const ipc = require('electron').ipcRenderer;

var fs = require("fs-extra");
var os = require("os");
const {shell} = require('electron');

fs.readFile(__dirname+"/version.json", function read(err,content) {
  var version = JSON.parse(content).latestVersion;

document.getElementById("appInfo").innerHTML = "HamLog " + version + ".<br>Released under Mozilla Public License 2.0."

document.getElementById("uninstall").onclick = function() {
  var uninstallConfirm = confirm("Are you SURE??");
  if (uninstallConfirm === true) {
    ipc.send("uninstall");
  }
};

document.getElementById("check").onclick = function() {
  ipc.send("checkLatestVersion");
  document.getElementById("version").innerHTML = "Loading";
};

ipc.on('versionResponse', function (event, rrr) {
  var versionData = JSON.parse(rrr);
  document.getElementById("version").innerHTML = "Local version: " + version;
  document.getElementById("version-latest").innerHTML = "Latest version: " + versionData.latestVersion;
  if (version !== versionData.latestVersion) {
    document.getElementById("version-message").style.display = "inline";
  }
});

document.getElementById("reportBug").onclick = function() {
    shell.openExternal("https://github.com/KoalaMuffin/HamLog/issues/new?body=System%20Information" + os.type() + " " + os.release() + " Hamlog " + version);
};

document.getElementById("beep").onclick = function() {
  shell.beep();
}

document.getElementById("viewSource").onclick = function(){
  shell.openExternal("https://github.com/KoalaMuffin/HamLog")
}

});
