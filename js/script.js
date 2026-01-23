const beats = [
    {id:1, name:"Retroceder", cat:"trap", vibe:"Dark", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV", img:"https://i.imgur.com/WjvDH0b.jpeg", file:"beats/retroceder.mp3"},
    {id:2, name:"Prodígio", cat:"rnb", vibe:"Smooth", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr", img:"https://i.imgur.com/cyHzDoM.jpeg", file:"beats/prodigio.mp3"},
    {id:3, name:"Desista", cat:"rnb", vibe:"Sad", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1", img:"https://i.imgur.com/YDgwkli.jpeg", file:"beats/desista.mp3"},
    {id:4, name:"Te Esperando", cat:"rap", vibe:"Lo-fi", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs", img:"https://i.imgur.com/BA6SDme.png", file:"beats/teesperando.mp3"},
    {id:5, name:"Auto Confiança", cat:"trap", vibe:"Aggressive", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069", img:"https://i.imgur.com/wAOKpZ5.jpeg", file:"beats/autoconfianca.mp3"},
    {id:6, name:"Lentamente", cat:"trap", vibe:"Chill", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G", img:"https://i.imgur.com/BRJxp0L.jpeg", file:"beats/lentamente.mp3"},
    {id:7, name:"Sentimento Impuro", cat:"rnb", vibe:"Romantic", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v", img:"https://i.imgur.com/U4eTmbn.jpeg", file:"beats/sentimentoimpuro.mp3"},
    {id:8, name:"Espanhola", cat:"trap", vibe:"Club", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS", img:"https://i.imgur.com/y7VdvOD.jpeg", file:"beats/espanhola.mp3"}
];

let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;

const wavesurfer = WaveSurfer.create({
    container: '#waveform', waveColor: '#222', progressColor: '#8a2be2',
    cursorColor: '#fff', barWidth: 2, height: 35, responsive: true
});

function render(list) {
    const grid = document.getElementById("beatGrid");
    grid.innerHTML = "";
    list.forEach(b => {
        const isFav = favorites.includes(b.id);
        const isPlaying = currentId === b.id && wavesurfer.isPlaying();
        grid.innerHTML += `
        <div class="card">
            <img src="${b.img}" class="img-static">
            <button class="play-btn-card" onclick="loadBeat(${b.id})">${isPlaying ? 'II' : '▶'}</button>
            <div class="beat-info-main">
                <h3>${b.name}</h3><span>${b.cat.toUpperCase()} • ${b.bpm} BPM</span>
            </div>
            <div class="col-detail">${b.bpm} BPM</div>
            <div class="col-detail vibe">${b.vibe}</div>
            <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(event, ${b.id})">❤</button>
            <div class="price-area">
                <span class="price-tag">${b.price}</span>
                <a href="${b.link}" class="btn-buy" target="_blank">COMPRAR</a>
            </div>
        </div>`;
    });
}

function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    document.getElementById('stickyPlayer').style.display = 'block';
    if (currentId === id) { wavesurfer.playPause(); return; }
    currentId = id;
    document.getElementById('p-img-player').src = beat.img;
    document.getElementById('p-name-player').innerText = beat.name;
    wavesurfer.load(beat.file);
    wavesurfer.on('ready', () => wavesurfer.play());
}

function toggleFav(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) { favorites = favorites.filter(f => f !== id); } 
    else { favorites.push(id); }
    localStorage.setItem('favBeats', JSON.stringify(favorites));
    render(beats);
}

function filterFavs(e) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render(beats.filter(b => favorites.includes(b.id)));
}

function filterCat(cat, e) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    render(cat === 'all' ? beats : beats.filter(b => b.cat === cat));
}

wavesurfer.on('play', () => { document.getElementById('pp-btn').innerText = "II"; render(beats); });
wavesurfer.on('pause', () => { document.getElementById('pp-btn').innerText = "▶"; render(beats); });

document.addEventListener('DOMContentLoaded', () => render(beats));