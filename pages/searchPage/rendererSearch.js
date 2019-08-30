const { BrowserWindow } = require('electron').remote;
const { ipcRenderer } = require('electron');

ipcRenderer.on('deezerSearch', (event, el) => {
    displayList(el.data);
});

let inputSearch = "";

ipcRenderer.send('search', inputSearch);

let $table = document.querySelector('#music_table>tbody');

function displayList(liste) {
    $table.innerHTML = '';
    console.log(liste);
    console.log(liste[0].artist.name);
    const artistName = document.querySelector('#artist_name');
    artistName.insertAdjacentHTML('beforeend', liste[0].artist.name);

    liste.forEach((el, index)=> {
        const btnX = '<button type="button" class="btn btn-outline-danger" id="remove_Song">X</button>';
        const btnEdit = '<button type="button" class="btn btn-outline-success" id="edit_song">Edit</button>';

        let row = $table.insertRow();
        let cel1 = row.insertCell(0);
        let cel2 = row.insertCell(1);
        let cel3 = row.insertCell(2);
        let cel4 = row.insertCell(3);
        // let cel5 = row.insertCell(4);
        // let cel6 = row.insertCell(5);
        // let cel7 = row.insertCell(6);

        let img = document.createElement("img");
        img.src = el.album.cover_small;
        console.log(img);

        cel1.insertAdjacentElement('beforebegin', img);
        cel2.innerHTML = el.album.title;
        cel3.innerHTML = el.duration;
        cel4.innerHTML = el.title;
        // cel5.innerHTML = el.name;
        // cel6.insertAdjacentHTML('afterbegin', btnEdit);
        // cel7.insertAdjacentHTML('afterbegin', btnX);

        // cel2.setAttribute("id", "name_"+index);
        // cel2.setAttribute("index", ""+index);
        // cel6.addEventListener("click",(el)=>{
        //     console.log(el);
        //     require('electron').remote.getGlobal('sharedObject').edit = index;
        //     console.log(require('electron').remote.getGlobal('sharedObject').edit);
        //     songpage();
        // });
        //
        // cel7.addEventListener("click", () => {
        //     ipcRenderer.send('removeSong', index);
        //     displayList();
        // });
    });
}
