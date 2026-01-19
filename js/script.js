const beats = [
    { id: 1, name: "Retroceder", cat: "trap", price: "R$ 120", link: "https://sun.eduzz.com/60EEP52303", img: "capas/trap.png" },
    { id: 2, name: "Prodígio", cat: "rnb", price: "R$ 90", link: "https://sun.eduzz.com/7WXQRKNO9A", img: "capas/rnb.png" },
    { id: 3, name: "Te Esperando", cat: "rap", price: "R$ 95", link: "https://chk.eduzz.com/n5j7fdbb", img: "capas/rap.png" },
    { id: 4, name: "Auto Confiança", cat: "trap", price: "R$ 82", link: "https://chk.eduzz.com/G92E6XZZWE", img: "capas/trap.png" },
    { id: 5, name: "Lentamente", cat: "trap", price: "R$ 98", link: "https://chk.eduzz.com/G96132EAW1", img: "capas/trap.png" },
    { id: 6, name: "Sentimento Impuro", cat: "rnb", price: "R$ 110", link: "https://chk.eduzz.com/39YDPG6Q9O", img: "capas/rnb.png" },
    { id: 7, name: "Espanhola", cat: "trap", price: "R$ 130", link: "https://chk.eduzz.com/Q9N5JQ7P01", img: "capas/trap.png" },
    { id: 8, name: "Desista", cat: "rnb", price: "R$ 130", link: "https://chk.eduzz.com/Q9N5JZ4K01", img: "capas/rnb.png" }
];

let currentBeatIndex = 0;
const audioPlayer = document.getElementById('main-audio');
const playIcon = document.getElementById('masterPlayIcon');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationTimeDisplay = document.getElementById('duration-time');

// Formata nome: minúsculo, sem acentos, sem ç, sem espaços
function formatFileName(text) {
    return text.toLowerCase().normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ç/g, "c")
        .replace(/\s+/g, "");
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

function renderBeats(filterCat = 'all') {
    const grid = document.getElementById('beatGrid');
    if(!grid) return;
    grid.innerHTML = '';
    const filtered = filterCat === 'all' ? beats : beats.filter(b => b.cat === filterCat);

    filtered.forEach((beat) => {
        // Encontra o index real no array principal para manter navegação correta
        const realIndex = beats.findIndex(b => b.id === beat.id);
        grid.innerHTML += `
            <article class="card">
                <div class="cover-box">
                    <img src="${beat.img}" alt="${beat.name}" onerror="this.src='https://via.placeholder.com/400?text=Beat'">
                    <button class="play-btn" onclick="startBeat(${realIndex})">
                        <i data-lucide="play" fill="black" size="20"></i>
                    </button>
                </div>
                <h3>${beat.name}</h3>
                <p>${beat.cat.toUpperCase()}</p>
                <div class="card-footer">
                    <span class="price">${beat.price}</span>
                    <a href="${beat.link}" target="_blank" class="buy-link">COMPRAR</a>
                </div>
            </article>
        `;
    });
    lucide.createIcons();
}

function startBeat(index) {
    currentBeatIndex = index;
    const beat = beats[currentBeatIndex];
    document.getElementById('p-title').innerText = beat.name;
    document.getElementById('p-img').src = beat.img;

    const fileName = formatFileName(beat.name);
    audioPlayer.src = `beats/${fileName}.mp3`;
    audioPlayer.play();
    
    updatePlayIcon(true);
}

function toggleAudio() {
    if (!audioPlayer.src) return;
    if (audioPlayer.paused) {
        audioPlayer.play();
        updatePlayIcon(true);
    } else {
        audioPlayer.pause();
        updatePlayIcon(false);
    }
}

function updatePlayIcon(playing) {
    playIcon.setAttribute('data-lucide', playing ? 'pause' : 'play');
    lucide.createIcons();
}

// ATUALIZAÇÃO DA BARRA COM COR VERDE DINÂMICA
audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        
        // Move a bolinha
        progressBar.value = percent;
        
        // Pinta a linha: verde onde passou, cinza o resto
        progressBar.style.background = `linear-gradient(to right, var(--accent) ${percent}%, #333 ${percent}%)`;
        
        // Atualiza tempos
        currentTimeDisplay.innerText = formatTime(audioPlayer.currentTime);
        durationTimeDisplay.innerText = formatTime(audioPlayer.duration);
    }
};

// ARRASTAR A BOLINHA
progressBar.oninput = () => {
    if (!audioPlayer.duration) return;
    const percent = progressBar.value;
    const seekTime = (percent / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
    
    // Atualiza cor enquanto arrasta
    progressBar.style.background = `linear-gradient(to right, var(--accent) ${percent}%, #333 ${percent}%)`;
};

function nextBeat() {
    currentBeatIndex = (currentBeatIndex + 1) % beats.length;
    startBeat(currentBeatIndex);
}

function prevBeat() {
    currentBeatIndex = (currentBeatIndex - 1 + beats.length) % beats.length;
    startBeat(currentBeatIndex);
}

audioPlayer.onended = () => nextBeat();

function filter(cat) {
    renderBeats(cat);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const text = btn.innerText.toLowerCase();
        btn.classList.toggle('active', text === cat || (cat === 'all' && text === 'todos'));
    });
}

document.addEventListener('DOMContentLoaded', () => renderBeats());