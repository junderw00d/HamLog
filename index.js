const {app} = require('electron')
const {BrowserWindow} = require('electron')


const ipc = require('electron').ipcMain

ipc.on('asynchronous-message', function (event, arg) {
  event.sender.send('asynchronous-reply', 'pong')
})


app.on('ready', function() {

  var mainWindow = new BrowserWindow({

  })
  mainWindow.loadURL('file://' + __dirname + '/index.html')
})﻿
