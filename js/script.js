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

// --- VARIÁVEIS DE CONTROLE ---
let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;
let currentFilter = 'all';

// --- INICIALIZAR WAVESURFER ---
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

// --- FUNÇÕES AUXILIARES ---

// Limpa o nome para: nadaaperder, autoconfianca, etc.
function cleanName(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") 
        .replace(/\s+/g, '')            
        .replace(/[^a-z0-9]/g, "");     
}

// Lógica de fallback de imagem (tenta jpg -> png -> jpeg)
function getImgAttributes(baseName) {
    return `src="capas/${baseName}.jpg" 
            onerror="this.onerror=function(){this.src='capas/${baseName}.jpeg'; this.onerror=function(){this.src='capas/${baseName}.png'; this.onerror=null}}; this.src='capas/${baseName}.png';"`;
}

// --- RENDERIZAÇÃO DA INTERFACE ---

function render() {
    const grid = document.getElementById("beatGrid");
    if(!grid) return;
    grid.innerHTML = "";
    
    // Aplica o filtro atual antes de desenhar
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
                <img ${getImgAttributes(baseName)} class="img-static">
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

// --- LÓGICA DE ÁUDIO ---

function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    const baseName = cleanName(beat.name);

    // Se clicar no mesmo beat, alterna Play/Pause
    if (currentId === id) {
        wavesurfer.playPause();
        return;
    }
    
    currentId = id;
    
    // Atualiza o Player Fixo embaixo
    const player = document.getElementById('stickyPlayer');
    if(player) player.style.display = 'block';
    
    // Imagem do Player com Fallback (mesma lógica do card)
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

    // Carregar arquivo de som e dar Play Automático
    wavesurfer.load(`beats/${baseName}.mp3`);
    wavesurfer.once('ready', () => {
        wavesurfer.play();
    });
}

// --- SINCRONIZAÇÃO E EVENTOS ---

// Quando o áudio começa (seja pelo card ou pelo player de baixo)
wavesurfer.on('play', () => { 
    const btn = document.getElementById('pp-btn');
    if(btn) btn.innerText = "II"; 
    render(); // Redesenha para colocar "II" no card certo
});

// Quando o áudio pausa (seja pelo card ou pelo player de baixo)
wavesurfer.on('pause', () => { 
    const btn = document.getElementById('pp-btn');
    if(btn) btn.innerText = "▶"; 
    render(); // Redesenha para colocar "▶" no card
});

// Botão Central do Player Fixo (Baixo)
const masterBtn = document.getElementById('pp-btn');
if(masterBtn) {
    masterBtn.addEventListener('click', () => {
        if (!currentId) {
            loadBeat(beats[0].id); // Toca o primeiro se nada estiver selecionado
        } else {
            wavesurfer.playPause();
        }
    });
}

// --- FAVORITOS E FILTROS ---

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

function filterFavs(e) {
    currentFilter = 'fav';
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) e.target.classList.add('active');
    render();
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', () => render());