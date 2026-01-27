const beats = [
    {id:1, name:"Retroceder", cat:"trap", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV"},
    {id:2, name:"Prodígio", cat:"rnb", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr"},
    {id:3, name:"Desista", cat:"rnb", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1"},
    {id:4, name:"Te Esperando", cat:"rap", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs"},
    {id:5, name:"Auto Confiança", cat:"trap", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069"},
    {id:6, name:"Lentamente", cat:"trap", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G"},
    {id:7, name:"Sentimento Impuro", cat:"rnb", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v"},
    {id:8, name:"Espanhola", cat:"trap", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS"},
    {id:9, name:"Nada a Perder", cat:"rnb", bpm:76, price:"R$112", link:"https://pay.kiwify.com.br/jumCXVB"},
    {id:10, name:"Olhar Distante", cat:"trap", bpm:78, price:"R$120", link:"https://pay.kiwify.com.br/4O3NlBk"},
    {id:11, name:"Será Que Não Entende", cat:"trap", bpm:87, price:"R$132", link:"https://pay.kiwify.com.br/hVGyS13"},
    {id:12, name:"Sem Você", cat:"rap", bpm:93, price:"R$98", link:"https://pay.kiwify.com.br/bxu58oa"},
    {id:13, name:"Incertezas", cat:"rap", bpm:86, price:"R$96", link:"https://pay.kiwify.com.br/VlRCKXc"},
];

// --- ESTADO GLOBAL ---
let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;
let currentFilter = 'all';

// --- CONFIGURAÇÃO WAVESURFER ---
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

// --- FUNÇÕES DE LIMPEZA E UTILIDADE ---
function cleanName(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '')            
        .replace(/[^a-z0-9]/g, "");     
}

// --- RENDERIZAÇÃO ---
function render() {
    const grid = document.getElementById("beatGrid");
    if(!grid) return;
    grid.innerHTML = "";
    
    let list = beats;
    if (currentFilter === 'fav') {
        list = beats.filter(b => favorites.includes(b.id));
    } else if (currentFilter !== 'all') {
        list = beats.filter(b => b.cat === currentFilter);
    }

    list.forEach(b => {
        const isFav = favorites.includes(b.id);
        const isPlaying = currentId === b.id && wavesurfer.isPlaying();
        const baseName = cleanName(b.name);
        
        grid.innerHTML += `
        <div class="card ${currentId === b.id ? 'active-card' : ''}">
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
                    <button class="play-btn-card" onclick="loadBeat(${b.id})">
                        ${isPlaying ? 'II' : '▶'}
                    </button>
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

// --- CONTROLE DE ÁUDIO ---
function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    const baseName = cleanName(beat.name);

    if (currentId === id) {
        wavesurfer.playPause();
        return;
    }
    
    currentId = id;
    
    const player = document.getElementById('stickyPlayer');
    if(player) player.style.display = 'block';
    
    const pImg = document.getElementById('p-img-player');
    if(pImg) {
        pImg.src = `capas/${baseName}.jpg`;
        pImg.onerror = function() { 
            this.onerror = function() {
                this.src = `capas/${baseName}.jpeg`;
                this.onerror = null;
            };
            this.src = `capas/${baseName}.png`; 
        };
    }
    
    document.getElementById('p-name-player').innerText = beat.name;

    wavesurfer.load(`beats/${baseName}.mp3`);
    wavesurfer.once('ready', () => {
        wavesurfer.play();
    });
}

// --- SINCRONIA MÚTUA (PLAY/PAUSE) ---

// Quando o WaveSurfer começa a tocar
wavesurfer.on('play', () => {
    const btnMaster = document.getElementById('pp-btn');
    if(btnMaster) btnMaster.innerText = "II"; 
    render(); // Atualiza ícones nos cards lá em cima
});

// Quando o WaveSurfer pausa
wavesurfer.on('pause', () => {
    const btnMaster = document.getElementById('pp-btn');
    if(btnMaster) btnMaster.innerText = "▶"; 
    render(); // Atualiza ícones nos cards lá em cima
});

// Clique no botão do player fixo (Baixo)
document.addEventListener('DOMContentLoaded', () => {
    const masterBtn = document.getElementById('pp-btn');
    if(masterBtn) {
        masterBtn.onclick = function() {
            if (!currentId) {
                loadBeat(beats[0].id); // Toca o primeiro beat caso nada tenha sido selecionado
            } else {
                wavesurfer.playPause();
            }
        };
    }
    render();
});

// --- FILTROS E FAVORITOS ---
function toggleFav(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
    } else {
        favorites.push(id);
    }
    localStorage.setItem('favBeats', JSON.stringify(favorites));
    render();
}

function filterCat(cat, e) {
    currentFilter = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) e.target.classList.add('active');
    render();
}