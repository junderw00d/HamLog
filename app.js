//var screenElectron = BrowserWindow.screen;
//alert(screenElectron);
//alert(BrowserWindow.getSize());



function idSelector(id) {
  return document.getElementById(id);
}


idSelector("date-input").value = new Date().toJSON().slice(0,10);
/*
const ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => {
  idSelector(message)
})
*/

var tr, data;

function render(overwrite) {
  if (localStorage.length !== 1) {
    localStorage.clear();
    localStorage.data = "{\"contacts\":[]}";
  }
  if (overwrite === true) {
    idSelector("contacts-body").innerHTML = "";
  }
  data = JSON.parse(localStorage.data);

data["contacts"].sort(function (a, b) {
  return ((a["date"] === b["date"]) ? 0 : ((a["date"] > b["date"]) ? 1 : -1));
});

  for (i=0; i < data.contacts.length; i++) {
    tr = document.createElement("tr");
    tr.innerHTML = "<td>" + data.contacts[i].date + "</td><td>" + data.contacts[i].frequency + "</td><td>" + data.contacts[i].callsign + "</td><td>" + data.contacts[i].comments + "</td>";
    idSelector("contacts-body").appendChild(tr);
  }
}

render();

idSelector("input-row").style.display = "none";
idSelector("smit-button").style.display = "none";

idSelector("add-button").onclick = function() {
  idSelector("input-row").style.display = "table-row";
  idSelector("smit-button").style.display = "table-row";
  idSelector("add-button").style.display = "none";
};
idSelector("smit-button").onclick = function(){
  data["contacts"].push({"date":idSelector("date-input").value,"frequency":idSelector("frequency-input").value,"callsign":idSelector("callsign-input").value.toUpperCase(),"comments":idSelector("comments-input").value});
  localStorage.data = JSON.stringify(data);
  render(true);
};

var confirmDelete;
idSelector("clear").onclick = function() {
  confirmDelete = confirm("This will delete all of your contacts. Continue?", "hello");
  if (confirmDelete === true) {
    localStorage.clear();
    render(true);
  }
};


const ipc = require('electron').ipcRenderer;
idSelector("export").onclick = function() {
  ipc.send('save-dialog');
};

var fs = require("fs");
var content;
//sp for save path. I believe path alone is not compatible with fs.writeFile
ipc.on('saved-file', function (event, sp) {
  content = JSON.stringify(JSON.parse(localStorage.data), null, "\t");
  try { fs.writeFileSync(sp, content, 'utf-8'); }
catch(e) {
  //alert('Failed to save the file !');
}
});

idSelector("import").onclick = function() {
  ipc.send('open-file-dialog');
};
ipc.on('selected-directory', function (event, path) {
  alert(path);
});
