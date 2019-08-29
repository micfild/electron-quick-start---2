// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const path = require('path');
const Music = require('./assets/js/music.js');
const { ipcMain } = require('electron');
const { globalShortcut } = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

global.sharedObject = {
  list: [],
  edit: null
};

for (let i = 0 ;  i < 10 ; i++)
{
  let date = formatDisplaytDate(generateRandomDate(new Date('1990-06-06'), new Date()));
  console.log(date);
  let music = new Music('artist' + i , 'album' + i, 'lenght'+i, date, 'title'+i);
  global.sharedObject.list.push(music);
}

function formatDisplaytDate(date){
  console.log(date);
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  return year + '-' + month + '-' + day;
}

function generateRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

ipcMain.on('NewSong', (event, el) => {
  global.sharedObject.list.push(el);
  console.log(el);
  event.reply('addSuccess', true);
});

ipcMain.on('removeSong', (event, index) => {
  global.sharedObject.list.splice(index, 1);
});

app.on('ready', () => {
  globalShortcut.register('Ctrl+J', () => {
    mainWindow.send('add');
  });
});

ipcMain.on('sortList', (event, id) => {
  console.log(id);
  if (id === 'sort_date_asc')
  {
    global.sharedObject.list.sort(function(a, b) {
      let dateA = new Date(a.date), dateB = new Date(b.date);
      return dateA - dateB;
    });
    console.log(global.sharedObject.list);
    event.reply('reload', true);
  }
  else if (id === 'sort_date_desc')
  {
    global.sharedObject.list.sort(function(a, b) {
      let dateA = new Date(a.date), dateB = new Date(b.date);
      return dateA - dateB;
    }).reverse();
    console.log(global.sharedObject.list);
    event.reply('reload', true);
  }
  else
  {
    global.sharedObject.list.sort((a,b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
    event.reply('reload', true);
  }
});
