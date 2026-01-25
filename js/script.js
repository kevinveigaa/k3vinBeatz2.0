const beats = [
    {id:1, name:"Retroceder", cat:"trap", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV"},
    {id:2, name:"Prodígio", cat:"rnb", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr"},
    {id:3, name:"Desista", cat:"rnb", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1"},
    {id:4, name:"Te Esperando", cat:"rap", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs"},
    {id:5, name:"Auto Confiança", cat:"trap", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069"},
    {id:6, name:"Lentamente", cat:"trap", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G"},
    {id:7, name:"Sentimento Impuro", cat:"rnb", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v"},
    {id:8, name:"Espanhola", cat:"trap", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS"},
    {id:9, name:"Nada a Perder", cat:"rnb", bpm:76, price:"R$112", link:"https://pay.kiwify.com.br/jumCXVB"}
];

// 1. Função de limpeza ajustada para manter todas as letras (Nada a Perder -> nadaaperder)
function cleanName(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, '')            // Remove espaços mantendo as letras (o "a" continua lá)
        .replace(/[^a-z0-9]/g, "");     // Remove símbolos
}

// 2. Inicialização WaveSurfer
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;

// 3. Renderização com Suporte a JPG/PNG/JPEG automático
function render(list) {
    const grid = document.getElementById("beatGrid");
    if(!grid) return;
    grid.innerHTML = "";
    
    list.forEach(b => {
        const isFav = favorites.includes(b.id);
        const isPlaying = currentId === b.id && wavesurfer.isPlaying();
        const baseName = cleanName(b.name);
        
        grid.innerHTML += `
        <div class="card">
            <div class="card-top">
                <img src="capas/${baseName}.jpg" class="img-static" 
                     onerror="this.onerror=function(){this.src='capas/${baseName}.png'; this.onerror=function(){this.src='capas/${baseName}.jpeg'}}; this.src='capas/${baseName}.png';">
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

// 4. Carregar Beat (Som e Imagem do Player)
function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    const baseName = cleanName(beat.name);

    if (currentId === id) {
        wavesurfer.playPause();
        return;
    }
    
    currentId = id;
    
    // Mostra Player Fixo
    const player = document.getElementById('stickyPlayer');
    if(player) player.style.display = 'block';
    
    // Atualiza Imagem do Player com Fallback
    const pImg = document.getElementById('p-img-player');
    pImg.src = `capas/${baseName}.jpg`;
    pImg.onerror = function() { this.src = `capas/${baseName}.png`; };
    
    document.getElementById('p-name-player').innerText = beat.name;

    // Carrega o áudio: ex beats/nadaaperder.mp3
    wavesurfer.load(`beats/${baseName}.mp3`);
    
    wavesurfer.once('ready', () => {
        wavesurfer.play();
        render(beats);
    });
}

// 5. Funções de Filtro e Favoritos
function toggleFav(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favBeats', JSON.stringify(favorites));
    render(beats);
}

function filterCat(cat, e) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) e.target.classList.add('active');
    const filtered = (cat === 'all') ? beats : beats.filter(b => b.cat === cat);
    render(filtered);
}

function filterFavs(e) {
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) e.target.classList.add('active');
    render(beats.filter(b => favorites.includes(b.id)));
}

// 6. Controle WaveSurfer
wavesurfer.on('play', () => { 
    if(document.getElementById('pp-btn')) document.getElementById('pp-btn').innerText = "II"; 
});

wavesurfer.on('pause', () => { 
    if(document.getElementById('pp-btn')) document.getElementById('pp-btn').innerText = "▶"; 
});

// Botão Master Play/Pause
const masterBtn = document.getElementById('pp-btn');
if(masterBtn) masterBtn.addEventListener('click', () => wavesurfer.playPause());

document.addEventListener('DOMContentLoaded', () => render(beats));