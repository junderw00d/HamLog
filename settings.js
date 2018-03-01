const ipc = require('electron').ipcRenderer;

var fs = require("fs-extra");

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
  document.getElementById("version").innerHTML = "Local version: " + versionData.localVersion;
  document.getElementById("version-latest").innerHTML = "Latest version: " + versionData.latestVersion;
  if (versionData.localVersion !== versionData.latestVersion) {
    document.getElementById("version-message").style.display = "inline";
  }
});
