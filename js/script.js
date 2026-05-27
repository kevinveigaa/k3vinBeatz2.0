// --- BANCO DE DADOS DOS BEATS ---
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
    {id:25, name:"Aquele Momento", cat:"trap", bpm:130, price:"R$154", link:"https://pay.kiwify.com.br/dXHJBi4"},
];

const destaquesIds = [1, 2, 3];
const popularesIds = [4, 5, 6];

let favorites = JSON.parse(localStorage.getItem('favBeats')) || [];
let currentId = null;
let currentFilter = 'all';
let searchQuery = "";

const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

function cleanName(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '').replace(/[^a-z0-9]/g, "");
}

function normalizarBusca(text) {
    let t = cleanName(text);
    if(t.includes("trep")) t = t.replace("trep", "trap");
    if(t.includes("eb")) t = t.replace("eb", "rnb");
    if(t.includes("repi")) t = t.replace("repi", "rap");
    if(t.includes("fank")) t = t.replace("fank", "funk");
    return t;
}

function criarCardHTML(b) {
    const isFav = favorites.includes(b.id);
    const isPlaying = currentId === b.id && wavesurfer.isPlaying();
    const baseName = cleanName(b.name);
    
    return `
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
}

function handleSearchInput() {
    const input = document.getElementById("beatSearch");
    const clearBtn = document.getElementById("clearSearchBtn");
    searchQuery = input.value;
    
    if(searchQuery.trim().length > 0) {
        clearBtn.style.display = "block";
    } else {
        clearBtn.style.display = "none";
    }
    render();
}

function clearSearch() {
    const input = document.getElementById("beatSearch");
    const clearBtn = document.getElementById("clearSearchBtn");
    input.value = "";
    searchQuery = "";
    clearBtn.style.display = "none";
    render();
}

function render() {
    const gridDestaques = document.getElementById("destaquesGrid");
    const gridPopulares = document.getElementById("popularesGrid");
    const gridRestante = document.getElementById("beatGrid");
    
    const secDestaques = document.getElementById("destaquesSection");
    const secPopulares = document.getElementById("popularesSection");
    const mainTitle = document.getElementById("mainSectionTitle");

    if(!gridRestante) return;

    if (searchQuery.trim() !== "" || currentFilter !== "all") {
        if(secDestaques) secDestaques.style.display = "none";
        if(secPopulares) secPopulares.style.display = "none";
        mainTitle.innerText = "Resultados da Busca";
        
        let filtrados = beats;
        
        if (currentFilter === 'fav') {
            filtrados = filtrados.filter(b => favorites.includes(b.id));
        } else if (currentFilter !== 'all') {
            filtrados = filtrados.filter(b => b.cat === currentFilter);
        }
        
        if(searchQuery.trim() !== "") {
            const queryClean = normalizarBusca(searchQuery);
            filtrados = filtrados.filter(b => {
                const nClean = normalizarBusca(b.name);
                const cClean = normalizarBusca(b.cat);
                const bpmClean = b.bpm.toString();
                return nClean.includes(queryClean) || cClean.includes(queryClean) || bpmClean.includes(queryClean);
            });
        }
        
        gridRestante.innerHTML = "";
        filtrados.forEach(b => { gridRestante.innerHTML += criarCardHTML(b); });
        
    } else {
        if(secDestaques) secDestaques.style.display = "block";
        if(secPopulares) secPopulares.style.display = "block";
        mainTitle.innerText = "Beats Restantes";

        gridDestaques.innerHTML = "";
        const listaDestaques = beats.filter(b => destaquesIds.includes(b.id));
        listaDestaques.forEach(b => { gridDestaques.innerHTML += criarCardHTML(b); });

        gridPopulares.innerHTML = "";
        const listaPopulares = beats.filter(b => popularesIds.includes(b.id));
        listaPopulares.forEach(b => { gridPopulares.innerHTML += criarCardHTML(b); });

        gridRestante.innerHTML = "";
        const listaRestante = beats.filter(b => !destaquesIds.includes(b.id) && !popularesIds.includes(b.id));
        listaRestante.forEach(b => { gridRestante.innerHTML += criarCardHTML(b); });
    }
}

function loadBeat(id) {
    const beat = beats.find(x => x.id === id);
    const baseName = cleanName(beat.name);
    const vPlayer = document.getElementById('portfolioVideo');
    if(vPlayer) vPlayer.pause();
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
            this.src = `capas/${baseName}.png`;
            this.onerror = function() { this.src = `capas/${baseName}.jpeg`; };
        };
    }
   
    document.getElementById('p-name-player').innerText = beat.name;
    wavesurfer.load(`beats/${baseName}.mp3`);
    wavesurfer.once('ready', () => { wavesurfer.play(); });
}

wavesurfer.on('audioprocess', () => {
    if (wavesurfer.getCurrentTime() >= 45) {
        wavesurfer.pause();
        wavesurfer.setTime(0);
        alert("Atenção: Este é um preview de 45 segundos. Adquira o beat para o arquivo completo!");
    }
});

wavesurfer.on('play', () => { document.getElementById('pp-btn').innerText = "II"; render(); });
wavesurfer.on('pause', () => { document.getElementById('pp-btn').innerText = "▶"; render(); });

// MONITOR DO SCROLL PARA EXIBIR/ESCONDER O BOTÃO FLUTUANTE
window.onscroll = function() {
    const topBtn = document.getElementById("scrollTopBtn");
    if (topBtn) {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            topBtn.style.display = "flex";
        } else {
            topBtn.style.display = "none";
        }
    }
};

function voltarParaTopo() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
    const masterBtn = document.getElementById('pp-btn');
    if(masterBtn) {
        masterBtn.onclick = function() {
            if (!currentId) { loadBeat(beats[0].id); } else { wavesurfer.playPause(); }
        };
    }
    const vPlayer = document.getElementById('portfolioVideo');
    if(vPlayer) { vPlayer.onplay = () => { if(wavesurfer.isPlaying()) wavesurfer.pause(); }; }
    render();
});

function toggleFav(e, id) {
    e.stopPropagation();
    if (favorites.includes(id)) { favorites = favorites.filter(f => f !== id); } else { favorites.push(id); }
    localStorage.setItem('favBeats', JSON.stringify(favorites));
    render();
}

function filterCat(cat, e) {
    currentFilter = cat;
    document.querySelectorAll('.f-btn').forEach(b => b.classList.remove('active'));
    if(e) {
        e.target.classList.add('active');
    } else if (cat === 'all') {
        const btnAll = document.getElementById('btn-all-filter');
        if(btnAll) btnAll.classList.add('active');
    }
    render();
}

function irParaExemplo() {
    voltarBeats();
    const showcase = document.querySelector('.portfolio-showcase');
    if (showcase) { showcase.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

function voltarParaLoja() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}