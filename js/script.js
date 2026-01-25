const beats = [
    {id:1, name:"Retroceder", cat:"trap", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV", img:"https://i.imgur.com/WjvDH0b.jpeg"},
    {id:2, name:"Prodígio", cat:"rnb", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr", img:"https://i.imgur.com/cyHzDoM.jpeg"},
    {id:3, name:"Desista", cat:"rnb", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1", img:"https://i.imgur.com/YDgwkli.jpeg"},
    {id:4, name:"Te Esperando", cat:"rap", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs", img:"https://i.imgur.com/BA6SDme.png"},
    {id:5, name:"Auto Confiança", cat:"trap", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069", img:"https://i.imgur.com/wAOKpZ5.jpeg"},
    {id:6, name:"Lentamente", cat:"trap", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G", img:"https://i.imgur.com/BRJxp0L.jpeg"},
    {id:7, name:"Sentimento Impuro", cat:"rnb", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v", img:"https://i.imgur.com/U4eTmbn.jpeg"},
    {id:8, name:"Espanhola", cat:"trap", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS", img:"https://i.imgur.com/y7VdvOD.jpeg"},
    {id:9, name:"Nada a Perder", cat:"rnb", bpm:76, price:"R$112", link:"https://pay.kiwify.com.br/jumCXVB", img:"https://i.imgur.com/TBZ85F4.jpeg"}
];

let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

function render(list) {
    const grid = document.getElementById("beatGrid");
    grid.innerHTML = "";
    
    if (list.length === 0) {
        grid.innerHTML = `<p style="padding:40px; color:#666; text-align:center; width:100%;">Nenhum beat encontrado aqui.</p>`;
        return;
    }

    list.forEach(b => {
        const isFav = favorites.includes(b.id);
        const isPlaying = currentId === b.id && wavesurfer.isPlaying();
        
        grid.innerHTML += `
        <div class="card">
            <div class="card-top">
                <img src="${b.img}" class="img-static">
                <div class="beat-info-main">
                    <h3>${b.name}</h3>
                    <span>${b.cat.toUpperCase()}</span>
                </div>
            </div>
            <div class="controls-row">
                <div class="left-controls">
                    <button class="play-btn-card" onclick="loadBeat(${b.id})">${isPlaying ? 'II' : '▶'}</button>
                    <span class="bpm-tag">${b.bpm} BPM</span>
                    <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${b.id})">❤</button>
                </div>
                <div class="right-controls">
                    <span class="price-tag">${b.price}</span>
                    <a href="${b.link}" class="btn-buy" target="_blank">COMPRAR</a>
                </div>
            </div>
        </div>`;
    });
}

function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    if (currentId === id) {
        wavesurfer.playPause();
        return;
    }
    currentId = id;
    document.getElementById('stickyPlayer').style.display = 'block';
    document.getElementById('p-img-player').src = beat.img;
    document.getElementById('p-name-player').innerText = beat.name;
    const msg = document.getElementById('preview-msg');
    msg.innerText = "Você está ouvindo um preview, compre o beat completo!";
    msg.style.color = "#888";
    wavesurfer.load(beat.file);
    wavesurfer.once('ready', () => wavesurfer.play());
}

// CORREÇÃO DOS FAVORITOS
function toggleFav(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favBeats', JSON.stringify(favorites));

    // Verifica se estamos na aba de favoritos no momento
    const activeButton = document.querySelector('.f-btn.active');
    if (activeButton && activeButton.innerText.includes('Favoritos')) {
        const favList = beats.filter(b => favorites.includes(b.id));
        render(favList);
    } else {
        render(beats);
    }
}

// FUNÇÃO QUE SEU HTML ESTÁ CHAMANDO
function filterFavs(e) {
    filterCat('fav', e);
}

function filterCat(cat, e) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');

    if (cat === 'all') {
        render(beats);
    } else if (cat === 'fav') {
        const favList = beats.filter(b => favorites.includes(b.id));
        render(favList);
    } else {
        render(beats.filter(b => b.cat === cat));
    }
}

wavesurfer.on('play', () => { document.getElementById('pp-btn').innerText = "II"; render(beats); });
wavesurfer.on('pause', () => { document.getElementById('pp-btn').innerText = "▶"; render(beats); });
document.addEventListener('DOMContentLoaded', () => render(beats));