const { BrowserWindow } = require('electron').remote;

window.addEventListener("DOMContentLoaded", (event) => {
    const index = require('electron').remote.getGlobal('sharedObject').edit;
    const song = require('electron').remote.getGlobal('sharedObject').list[index];
    let list = require('electron').remote.getGlobal('sharedObject').list;

    const song_index = document.querySelector('#song_index');
    const placeHolderArtist = document.querySelector('#artist');
    const placeHolderAlbum = document.querySelector('#album');
    const placeHolderlenght = document.querySelector('#lenght');
    const placeHolderDate = document.querySelector('#date');
    const placeHolderTitle = document.querySelector('#title');

    song_index.innerHTML = index;
    placeHolderArtist.setAttribute('value', song.artist);
    placeHolderAlbum.setAttribute('value', song.album);
    placeHolderlenght.setAttribute('value', song.lenght);
    placeHolderDate.setAttribute('value', song.date);
    placeHolderTitle.setAttribute('value', song.title);

    const $inputs = document.querySelectorAll('input');

    let $submitButton = document.querySelector('#edit');
    $submitButton.addEventListener('click', (btn)=>{
        btn.preventDefault();
        list[index].artist = placeHolderArtist.value;
        list[index].album = placeHolderAlbum.value;
        list[index].lenght = placeHolderlenght.value;
        list[index].date = placeHolderDate.value;
        list[index].title = placeHolderTitle.value;
        require('electron').remote.getGlobal('sharedObject').list = list;
        window.close();
    });
});
