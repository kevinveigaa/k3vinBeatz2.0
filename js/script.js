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

function formatFileName(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").replace(/\s+/g, "");
}

function renderBeats(filterCat = 'all') {
    const grid = document.getElementById('beatGrid');
    grid.innerHTML = '';
    const filtered = filterCat === 'all' ? beats : beats.filter(b => b.cat === filterCat);

    filtered.forEach((beat) => {
        const realIndex = beats.findIndex(b => b.id === beat.id);
        grid.innerHTML += `
            <article class="card">
                <div class="cover-box">
                    <img src="${beat.img}">
                    <button class="play-btn" onclick="startBeat(${realIndex})">
                        <i data-lucide="play" class="card-icon" id="icon-${realIndex}" fill="black"></i>
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
    updateAllIcons(); // Garante que ícones fiquem certos ao filtrar
}

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

function toggleAudio() {
    if (currentBeatIndex === null) {
        startBeat(0);
        return;
    }
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
}

// FUNÇÃO ÚNICA PARA ATUALIZAR TODOS OS ÍCONES DO SITE
function updateAllIcons() {
    const isPlaying = !audioPlayer.paused && audioPlayer.src !== "";

    // 1. Atualiza o ícone do Player Principal (Rodapé)
    const masterPlayIcon = document.getElementById('masterPlayIcon');
    if (masterPlayIcon) {
        masterPlayIcon.setAttribute('data-lucide', isPlaying ? 'pause' : 'play');
    }

    // 2. Reseta todos os ícones dos cards para "play"
    document.querySelectorAll('.card-icon').forEach(icon => {
        icon.setAttribute('data-lucide', 'play');
    });

    // 3. Se estiver tocando, coloca "pause" no card da música atual
    if (isPlaying && currentBeatIndex !== null) {
        const currentCardIcon = document.getElementById(`icon-${currentBeatIndex}`);
        if (currentCardIcon) {
            currentCardIcon.setAttribute('data-lucide', 'pause');
        }
    }

    // 4. Renderiza as mudanças na tela
    lucide.createIcons();
}

// EVENTOS DO PLAYER (Gatilhos automáticos para atualizar ícones)
audioPlayer.onplay = updateAllIcons;
audioPlayer.onpause = updateAllIcons;
audioPlayer.onended = () => {
    updateAllIcons();
    nextBeat(); // Toca a próxima música automaticamente ao acabar
};

audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent;
        progressBar.style.background = `linear-gradient(to right, #1DB954 ${percent}%, #333 ${percent}%)`;
        
        const curMin = Math.floor(audioPlayer.currentTime / 60);
        const curSec = Math.floor(audioPlayer.currentTime % 60);
        const durMin = Math.floor(audioPlayer.duration / 60);
        const durSec = Math.floor(audioPlayer.duration % 60);
        
        document.getElementById('current-time').innerText = `${curMin}:${curSec < 10 ? '0' : ''}${curSec}`;
        document.getElementById('duration-time').innerText = `${durMin}:${durSec < 10 ? '0' : ''}${durSec}`;
    }
};

progressBar.oninput = () => { audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration; };

function nextBeat() {
    if (currentBeatIndex === null) return;
    startBeat((currentBeatIndex + 1) % beats.length);
}

function prevBeat() {
    if (currentBeatIndex === null) return;
    startBeat((currentBeatIndex - 1 + beats.length) % beats.length);
}

function filter(cat) {
    renderBeats(cat);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === cat || (cat === 'all' && btn.innerText === 'TODOS'));
    });
}

document.addEventListener('DOMContentLoaded', () => renderBeats());