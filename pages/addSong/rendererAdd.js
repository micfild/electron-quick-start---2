const Music = require('../../assets/js/music.js');
const { ipcRenderer } = require ('electron');

window.addEventListener("DOMContentLoaded", (event) => {

    const placeHolderArtist = document.querySelector('#artist');
    const placeHolderAlbum = document.querySelector('#album');
    const placeHolderlenght = document.querySelector('#lenght');
    const placeHolderDate = document.querySelector('#date');
    const placeHolderTitle = document.querySelector('#title');

    let $submitButton = document.querySelector('#add_btn');
    $submitButton.addEventListener('click', (btn)=>{
        btn.preventDefault();
        let addSong = new Music(placeHolderArtist.value,placeHolderAlbum.value,placeHolderlenght.value,placeHolderDate.value,placeHolderTitle.value);

        console.log(addSong);
        ipcRenderer.send('NewSong', addSong);
    });

    ipcRenderer.on('addSuccess', (event, el) => {
        if (el) {
            window.close();
        }
        console.log(require('electron').remote.getGlobal('sharedObject').list);
    })
});
