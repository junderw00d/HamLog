//HamLog

var escapeHtml = require('escape-html');

document.getElementById("date-input").value = new Date().toJSON().slice(0,10);

var data;
function render(overwrite) {
  var tr;
  if (localStorage.length !== 1) {
    localStorage.clear();
    localStorage.data = "{\"contacts\":[]}";
  }
  if (overwrite === true) {
    document.getElementById("contacts-body").innerHTML = "";
  }
  data = JSON.parse(localStorage.data);
  data["contacts"].sort(function (a, b) {
    return ((a.date === b.date) ? 0 : ((a.date > b.date) ? 1 : -1));
  });
  for (i=0; i < data.contacts.length; i++) {
    tr = document.createElement("tr");
    tr.classList.add("content-row");
    tr.innerHTML = "<td>" + escapeHtml(data.contacts[i].date) + "</td><td>" + escapeHtml(data.contacts[i].frequency) + "</td><td>" + escapeHtml(data.contacts[i].callsign) + "</td><td>" + escapeHtml(data.contacts[i].power) + "</td><td>" + escapeHtml(data.contacts[i].comments) + "</td><td class='edit-cell'><button class='button cell-button edit' onclick='addEdit(" + i + ")'>Edit</button></td>";
    document.getElementById("contacts-body").appendChild(tr);
  }
  tr = document.createElement("tr");
  tr.classList.add("dummy");
  document.getElementById("contacts-body").appendChild(tr);
}

render();

document.getElementById("input-row").style.display = "none";
document.getElementById("smit-button").style.display = "none";
document.getElementById("delete-button").style.display = "none";
document.getElementById("save-button").style.display = "none";

document.getElementById("add-button").onclick = function() {
  addEdit();
};
document.getElementById("smit-button").onclick = function(){
  data.contacts.push({"date":document.getElementById("date-input").value,"frequency":document.getElementById("frequency-input").value,"callsign":document.getElementById("callsign-input").value.toUpperCase(),"comments":document.getElementById("comments-input").value,"power":document.getElementById("power-input").value});
  localStorage.data = JSON.stringify(data);
  render(true);

  resetInput()
};

function resetInput() {
  document.getElementById("input-row").style.display = "none";
  document.getElementById("smit-button").style.display = "none";
  document.getElementById("save-button").style.display = "none";
  document.getElementById("delete-button").style.display = "none";
  document.getElementById("add-button").style.display = "table-row";
  for (i = 0; i < 5; i++) {
    document.getElementById("input-row").getElementsByTagName("input")[i].value = null;
  }
  document.getElementById("date-input").value = new Date().toJSON().slice(0,10);
}

document.getElementById("clear").onclick = function() {
  var confirmDelete;
  confirmDelete = confirm("This will delete all of your contacts. Continue?", "hello");
  if (confirmDelete === true) {
    localStorage.clear();
    render(true);
  }
};


const ipc = require('electron').ipcRenderer;
document.getElementById("export").onclick = function() {
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

document.getElementById("import").onclick = function() {
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
    for (j = 0; j < 5; j++) {
      if (document.getElementById("contacts-body").getElementsByClassName("content-row")[i].getElementsByTagName("td")[j].innerHTML.toUpperCase().includes(document.getElementById("search").value.toUpperCase()) && valids.includes(i) === false) {
          valids.push(i);
      }
    }
    if (valids.includes(i)) {
      document.getElementById("contacts-body").getElementsByClassName("content-row")[i].style.display = "table-row";
      if (document.getElementById("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling.classList.contains("dummy") && i !== document.querySelectorAll('#contacts-body .content-row').length -1) {
        document.getElementById("contacts-body").removeChild(document.getElementById("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling);
      }
    } else {
      document.getElementById("contacts-body").getElementsByClassName("content-row")[i].style.display = "none";
      if (document.getElementById("contacts-body").getElementsByClassName("content-row")[i].nextElementSibling.classList.contains("dummy") === false) {
        document.getElementById("contacts-body").getElementsByClassName("content-row")[i].insertAdjacentHTML("afterend", "<tr class='dummy'></tr>");
      }
    }
  }
}

document.getElementById("settings").onclick = function() {
  ipc.send("settings");
}

function saveEdit(number) {
  data.contacts[number] = {"date":document.getElementById("date-input").value,"frequency":document.getElementById("frequency-input").value,"callsign":document.getElementById("callsign-input").value.toUpperCase(),"comments":document.getElementById("comments-input").value,"power":document.getElementById("power-input").value}
  localStorage.data = JSON.stringify(data);
  render(true);
  resetInput();
}

function addEdit(edit) {
  document.getElementById("input-row").style.display = "table-row";
  document.getElementById("add-button").style.display = "none";

  if (typeof edit !== "undefined") {
    document.getElementById("save-button").style.display = "table-row";
    document.getElementById("save-button").onclick = function() {
      saveEdit(edit);
    };

    document.getElementById("delete-button").style.display = "table-cell";
    document.getElementById("delete-button").onclick = function() {
      data.contacts.splice(edit, 1);
      localStorage.data = JSON.stringify(data);
      render(true);
      resetInput();
    }

    for (i = 0; i < 5; i ++) {
      document.getElementById("input-row").getElementsByTagName("input")[i].value = document.getElementById("contacts-body").getElementsByTagName("tr")[edit].getElementsByTagName("td")[i].innerHTML;
    }
  } else {
    document.getElementById("smit-button").style.display = "table-row";
  }
}

document.getElementById("cancel-button").onclick = function() {
  resetInput();
};
