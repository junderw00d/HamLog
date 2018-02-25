document.getElementById("uninstall").onclick = function() {
  var uninstallConfirm = confirm("Are you SURE??");
  if (uninstallConfirm === true) {
    ipc.send("uninstall");
  }
}

const ipc = require('electron').ipcRenderer;
ipc.on('hi', function (event, sp) {
  alert(sp);
});
