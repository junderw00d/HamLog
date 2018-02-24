//var screenElectron = BrowserWindow.screen;
//alert(screenElectron);
//alert(BrowserWindow.getSize());

function idSelector(id) {
  return document.getElementById(id);
}

/*
const ipc = require('electron').ipcRenderer;
ipc.on('message', (event, message) => {
  idSelector(message)
})
*/

var tr, data;

if (localStorage.length !== 1) {
  localStorage.clear();
  localStorage.data = "{\"contacts\":[]}";
}

function render(overwrite) {
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
  data["contacts"].push({"date":idSelector("date-input").value,"frequency":idSelector("frequency-input").value,"callsign":idSelector("callsign-input").value,"comments":idSelector("comments-input").value});
  localStorage.data = JSON.stringify(data);
  render(true);
};

idSelector("clear").onclick = function() {
  localStorage.clear();
};
