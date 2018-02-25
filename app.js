//HamLog

function idSelector(id) {
  return document.getElementById(id);
}

idSelector("date-input").value = new Date().toJSON().slice(0,10);

var data;
function render(overwrite) {
  var tr;
  if (localStorage.length !== 1) {
    localStorage.clear();
    localStorage.data = "{\"contacts\":[]}";
  }
  if (overwrite === true) {
    idSelector("contacts-body").innerHTML = "";
  }
  data = JSON.parse(localStorage.data);
  data["contacts"].sort(function (a, b) {
    return ((a.date === b.date) ? 0 : ((a.date > b.date) ? 1 : -1));
  });
  for (i=0; i < data.contacts.length; i++) {
    tr = document.createElement("tr");
    tr.classList.add("content-row");
    tr.innerHTML = "<td>" + data.contacts[i].date + "</td><td>" + data.contacts[i].frequency + "</td><td>" + data.contacts[i].callsign + "</td><td>" + data.contacts[i].comments + "</td>";
    idSelector("contacts-body").appendChild(tr);
  }
  tr = document.createElement("tr");
  tr.classList.add("dummy");
  idSelector("contacts-body").appendChild(tr);
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
  data.contacts.push({"date":idSelector("date-input").value,"frequency":idSelector("frequency-input").value,"callsign":idSelector("callsign-input").value.toUpperCase(),"comments":idSelector("comments-input").value});
  localStorage.data = JSON.stringify(data);
  render(true);
};


idSelector("clear").onclick = function() {
  var confirmDelete;
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
var confirmImport;
ipc.on('selected-directory', function (event, ip) {
  confirmImport = confirm("Are you sure you want to import " + ip[0].split("/")[ip[0].split("/").length - 1] + "? This will overwrite any current data.");
  if (confirmImport === true) {
    fs.readFile(ip[0], function read(err,content) {

      localStorage.data = content;
      render(true);
    });
  }
});

function search() {
  var i, j;
  var valids = new Array([]);
  for (i = 0; i < document.querySelectorAll('#contacts-body .content-row').length; i++) {
    for (j = 0; j < 4; j++) {
      if (idSelector("contacts-body").getElementsByClassName("content-row")[i].getElementsByTagName("td")[j].innerHTML.toUpperCase().includes(idSelector("search").value.toUpperCase()) && valids.includes(i) === false) {
          valids.push(i);
      }
    }
    if (valids.includes(i)) {
      idSelector("contacts-body").getElementsByClassName("content-row")[i].style.display = "table-row";
      if (idSelector("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling.classList.contains("dummy") && i !== document.querySelectorAll('#contacts-body .content-row').length -1) {
        idSelector("contacts-body").removeChild(idSelector("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling);
      }
    } else {
      idSelector("contacts-body").getElementsByClassName("content-row")[i].style.display = "none";
      if (idSelector("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling.classList.contains("dummy") === false) {
        idSelector("contacts-body").getElementsByClassName("content-row")[i].insertAdjacentHTML("afterend", "<tr class='dummy'></tr>");
      }
    }
  }
}
