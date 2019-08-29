// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const { ipcRenderer } = require('electron');

let $table = document.querySelector('#music_table>tbody');

function displayList() {
    $table.innerHTML = '';
    let liste = require('electron').remote.getGlobal('sharedObject').list;
    liste.forEach((el, index)=> {
        const btnX = '<button type="button" class="btn btn-outline-danger" id="remove_Song">X</button>';
        const btnEdit = '<button type="button" class="btn btn-outline-success" id="edit_song">Edit</button>';

        let row = $table.insertRow();
        let cel1 = row.insertCell(0);
        let cel2 = row.insertCell(1);
        let cel3 = row.insertCell(2);
        let cel4 = row.insertCell(3);
        let cel5 = row.insertCell(4);
        let cel6 = row.insertCell(5);
        let cel7 = row.insertCell(6);

        cel1.innerHTML = el.artist;
        cel2.innerHTML = el.album;
        cel3.innerHTML = el.lenght;
        cel4.innerHTML = el.date;
        cel5.innerHTML = el.title;
        cel6.insertAdjacentHTML('afterbegin', btnEdit);
        cel7.insertAdjacentHTML('afterbegin', btnX);

        cel2.setAttribute("id", "name_"+index);
        cel2.setAttribute("index", ""+index);
        cel6.addEventListener("click",(el)=>{
            console.log(el);
            require('electron').remote.getGlobal('sharedObject').edit = index;
            console.log(require('electron').remote.getGlobal('sharedObject').edit);
            songpage();
        });

        cel7.addEventListener("click", () => {
            ipcRenderer.send('removeSong', index);
            displayList();
        });
    });
}

const displayElems = displayList();

const { BrowserWindow } = require('electron').remote;
function songpage() {

    // modal window
    // let currentWindow = require('electron').remote.getCurrentWindow();
    // let child = new BrowserWindow({parent : currentWindow, modal: true});
    // child.loadFile('./pages/editSong/editSong.html');
    // child.show();

    // same window
    // let currentWindow = require('electron').remote.getCurrentWindow();
    // currentWindow.loadFile('./pages/editSong/editSong.html');

    // new window
    let  editsong = new BrowserWindow({
        width: 1280,
        height: 768 ,
        webPreferences: {
            nodeIntegration: true
        }});
    editsong.loadFile('./pages/editSong/editSong.html');
    editsong.webContents.openDevTools();
    editsong.once('ready-to-show', () => {
        editsong.show()
    });
    editsong.flashFrame(false);
    editsong.on('close', ()=>{
        displayList();
        editsong = null;
    })
}

let addBtn = document.querySelector('#add_song');
const addSong = addBtn.addEventListener('click', () => {
    addMusic();
});

function addMusic(){
    let currentWindow = require('electron').remote.getCurrentWindow();
    let child = new BrowserWindow({parent : currentWindow, modal: true, webPreferences: {nodeIntegration: true}});
    child.loadFile('./pages/addSong/addSong.html');
    child.show();
    child.on('close', () => {
        window.location.reload();
        child = null;
    })
}

ipcRenderer.on("add", ()=>{
    addMusic();
});

let sort = document.querySelectorAll('[id^=sort]');
sort.forEach((btn) => {
    btn.addEventListener('click', (el) => {
        // console.log(el, el.path[0].id);
        ipcRenderer.send('sortList', el.path[0].id);

    });
});


ipcRenderer.on('reload', () => {
    displayList()
});
