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
    {id:14, name:"Adiversidades", cat:"rap", bpm:86, price:"R$142", link:"https://pay.kiwify.com.br/l6Y7evm"},
    {id:15, name:"Menor Problema v2", cat:"funk", bpm:101, price:"R$142", link:"https://pay.kiwify.com.br/kTP7YBT"},
    {id:16, name:"Menor Problema", cat:"funk", bpm:101, price:"R$140", link:"https://pay.kiwify.com.br/DQro2Vd"},
    {id:17, name:"Metas", cat:"rap", bpm:80, price:"R$110", link:"https://pay.kiwify.com.br/DZ9bjai"},
    {id:18, name:"Amores Fictícios", cat:"trap", bpm:91, price:"R$135", link:"https://pay.kiwify.com.br/4aG3STt"},
    {id:19, name:"Prioridades", cat:"trap", bpm:80, price:"R$143", link:"https://pay.kiwify.com.br/cGnuoHg"},
    {id:20, name:"Na Maciota ", cat:"funk", bpm:64, price:"R$90", link:"https://pay.kiwify.com.br/016tPBc"},
    {id:21, name:"Reflexões", cat:"trap", bpm:87, price:"R$87", link:"https://pay.kiwify.com.br/uND8Cp6"},
    {id:22, name:"O Amor Fala", cat:"rnb", bpm:120, price:"R$97", link:"https://pay.kiwify.com.br/yMStIel"},
    {id:23, name:"Modo Breck", cat:"rap", bpm:110, price:"R$146", link:"https://pay.kiwify.com.br/RjArpSP"},
    {id:24, name:"Mano do Gheto", cat:"rap", bpm:132, price:"R$168", link:"https://pay.kiwify.com.br/5KFm02p"},
];

let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;
let currentFilter = 'all';

// WaveSurfer
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    height: 35,
    responsive: true
});

// A MÁGICA DE SUMIR O LINK (CARAMBA!)
function setupSmartMenu() {
    const path = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const text = link.innerText.toLowerCase();
        // Se estiver em Drumkits, some link Drumkits
        if (path.includes("drumkits") && text.includes("drumkit")) {
            link.style.display = 'none';
        } 
        // Se estiver na Home (Beats), some link Beats
        else if (!path.includes("drumkits") && text.includes("beat")) {
            link.style.display = 'none';
        }
    });
}

function cleanName(t) { return t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/g, ""); }

function render() {
    const grid = document.getElementById("beatGrid");
    if(!grid) return;
    grid.innerHTML = "";
    
    let list = (currentFilter === 'fav') ? beats.filter(b => favorites.includes(b.id)) : 
               (currentFilter !== 'all') ? beats.filter(b => b.cat === currentFilter) : beats;

    list.forEach(b => {
        const isFav = favorites.includes(b.id);
        const isPlaying = currentId === b.id && wavesurfer.isPlaying();
        const bName = cleanName(b.name);
        grid.innerHTML += `
        <div class="card">
            <div class="card-top">
                <img src="capas/${bName}.png" class="img-static" onerror="this.src='capas/${bName}.jpg'">
                <div class="beat-info-main"><h3>${b.name}</h3><span>${b.cat.toUpperCase()}</span></div>
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
    if (currentId === id) { wavesurfer.playPause(); return; }
    currentId = id;
    document.getElementById('stickyPlayer').style.display = 'block';
    document.getElementById('p-img-player').src = `capas/${cleanName(beat.name)}.png`;
    document.getElementById('p-name-player').innerText = beat.name;
    wavesurfer.load(`beats/${cleanName(beat.name)}.mp3`);
    wavesurfer.once('ready', () => wavesurfer.play());
}

function toggleFav(e, id) {
    e.stopPropagation();
    favorites = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    localStorage.setItem('favBeats', JSON.stringify(favorites));
    render();
}

function filterCat(cat, e) {
    currentFilter = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) e.target.classList.add('active');
    render();
}

document.addEventListener('DOMContentLoaded', () => {
    setupSmartMenu();
    render();
    const pp = document.getElementById('pp-btn');
    if(pp) pp.onclick = () => currentId ? wavesurfer.playPause() : loadBeat(beats[0].id);
});

wavesurfer.on('play', render);
wavesurfer.on('pause', render);