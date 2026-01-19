const beats = [
    { id: 1, name: "Retroceder", cat: "trap", bpm: "132", price: "R$ 120", link: "https://pay.kiwify.com.br/0YaIpFV", img: "https://i.imgur.com/WjvDH0b.jpeg" },
    { id: 2, name: "Prodígio", cat: "rnb", bpm: "120", price: "R$ 90", link: "https://pay.kiwify.com.br/jXHrjSr", img: "https://i.imgur.com/cyHzDoM.jpeg" },
    { id: 3, name: "Desista", cat: "rnb", bpm: "91", price: "R$ 130", link: "https://pay.kiwify.com.br/rqdgNG1", img: "https://i.imgur.com/YDgwkli.jpeg" },
    { id: 4, name: "Te Esperando", cat: "rap", bpm: "130", price: "R$ 95", link: "https://pay.kiwify.com.br/509sDIs", img: "https://i.imgur.com/BA6SDme.png" },
    { id: 5, name: "Auto Confiança", cat: "trap", bpm: "128", price: "R$ 82", link: "https://pay.kiwify.com.br/BXai069", img: "https://i.imgur.com/wAOKpZ5.jpeg" },
    { id: 6, name: "Lentamente", cat: "trap", bpm: "101", price: "R$ 98", link: "https://pay.kiwify.com.br/tsbZm3G", img: "https://i.imgur.com/BRJxp0L.jpeg" },
    { id: 7, name: "Sentimento Impuro", cat: "rnb", bpm: "110", price: "R$ 110", link: "https://pay.kiwify.com.br/MlLKd8v", img: "https://i.imgur.com/U4eTmbn.jpeg" },
    { id: 8, name: "Espanhola", cat: "trap", bpm: "140", price: "R$ 130", link: "https://pay.kiwify.com.br/lkhizZS", img: "https://i.imgur.com/y7VdvOD.jpeg" }
];

let currentBeatIndex = null;
const audioPlayer = new Audio();
const progressBar = document.getElementById('progress-bar');

// Formata o nome para buscar o arquivo .mp3 (ex: "Retroceder" -> "retroceder.mp3")
function formatFileName(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").replace(/\s+/g, "");
}

// Renderiza os cards na tela
function renderBeats(filterCat = 'all') {
    const grid = document.getElementById('beatGrid');
    grid.innerHTML = '';
    const filtered = filterCat === 'all' ? beats : beats.filter(b => b.cat === filterCat);

    filtered.forEach((beat) => {
        const realIndex = beats.findIndex(b => b.id === beat.id);
        const isPlaying = (currentBeatIndex === realIndex && !audioPlayer.paused);
        
        grid.innerHTML += `
            <article class="card">
                <div class="cover-box">
                    <img src="${beat.img}">
                    <button class="play-btn" onclick="startBeat(${realIndex})">
                        <i data-lucide="${isPlaying ? 'pause' : 'play'}" class="card-icon" data-index="${realIndex}" fill="black"></i>
                    </button>
                </div>
                <div class="card-info">
                    <h3>${beat.name}</h3>
                    <p>${beat.cat.toUpperCase()} • ${beat.bpm} BPM</p>
                </div>
                <div class="card-right">
                    <span class="price">${beat.price}</span>
                    <a href="${beat.link}" target="_blank" class="buy-link">COMPRAR</a>
                </div>
            </article>
        `;
    });
    lucide.createIcons();
    syncUI();
}

// Inicia um novo beat ou alterna Play/Pause se for o mesmo
function startBeat(index) {
    if (currentBeatIndex === index) {
        toggleAudio();
        return;
    }
    currentBeatIndex = index;
    const beat = beats[currentBeatIndex];
    document.getElementById('p-title').innerText = beat.name;
    document.getElementById('p-bpm').innerText = `${beat.bpm} BPM | k3vin Beatz`;
    document.getElementById('p-img').src = beat.img;
    audioPlayer.src = `beats/${formatFileName(beat.name)}.mp3`;
    audioPlayer.play();
}

// Alterna entre Play e Pause
function toggleAudio() {
    if (currentBeatIndex === null) { startBeat(0); return; }
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
}

// Sincroniza os ícones de Play/Pause em toda a página
function syncUI() {
    const isPlaying = !audioPlayer.paused && audioPlayer.src !== "";
    
    // Ícone do Player principal
    const masterPlayIcon = document.getElementById('masterPlayIcon');
    if (masterPlayIcon) {
        masterPlayIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    }

    // Ícones dos Cards
    document.querySelectorAll('.card-icon').forEach((icon) => {
        const idx = parseInt(icon.getAttribute('data-index'));
        if (isPlaying && idx === currentBeatIndex) {
            icon.setAttribute('data-lucide', 'pause');
        } else {
            icon.setAttribute('data-lucide', 'play');
        }
    });

    lucide.createIcons();
}

// Eventos do Audio Player
audioPlayer.onplay = syncUI;
audioPlayer.onpause = syncUI;
audioPlayer.onended = () => { syncUI(); nextBeat(); };

audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent;
        document.getElementById('current-time').innerText = Math.floor(audioPlayer.currentTime / 60) + ":" + ("0" + Math.floor(audioPlayer.currentTime % 60)).slice(-2);
        document.getElementById('duration-time').innerText = Math.floor(audioPlayer.duration / 60) + ":" + ("0" + Math.floor(audioPlayer.duration % 60)).slice(-2);
    }
};

progressBar.oninput = () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
};

// Funções de Próximo e Anterior
function nextBeat() {
    startBeat((currentBeatIndex + 1) % beats.length);
}

function prevBeat() {
    startBeat((currentBeatIndex - 1 + beats.length) % beats.length);
}

// Função de Filtro com correção para o botão R&B
function filter(cat) {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(btn => {
        // Normaliza o texto do botão para comparar (Ex: "R&B" vira "rnb")
        const btnText = btn.innerText.toLowerCase().replace('&', 'n').replace('todos', 'all');
        
        if (btnText === cat) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderBeats(cat);
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    renderBeats();
});