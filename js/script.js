const beats = [
    { id: 1, name: "Retroceder", cat: "trap", bpm: "132", price: "R$ 120", link: "https://pay.kiwify.com.br/0YaIpFV", img: "https://i.imgur.com/WjvDH0b.jpeg" },
    { id: 2, name: "Prodígio", cat: "rnb", bpm: "120", price: "R$ 90", link: "https://pay.kiwify.com.br/jXHrjSr", img: "https://i.imgur.com/cyHzDoM.jpeg" },
    { id: 3, name: "Desista", cat: "rnb", bpm: "91", price: "R$ 130", link: "https://pay.kiwify.com.br/rqdgNG1", img: "https://i.imgur.com/YDgwkli.jpeg" },
    { id: 4, name: "Te Esperando", cat: "rap", bpm: "130", price: "R$ 95", link: "LINK_KIWIFY", img: "https://i.imgur.com/BA6SDme.png" },
    { id: 5, name: "Auto Confiança", cat: "trap", bpm: "128", price: "R$ 82", link: "LINK_KIWIFY", img: "https://i.imgur.com/wAOKpZ5.jpeg" },
    { id: 6, name: "Lentamente", cat: "trap", bpm: "101", price: "R$ 98", link: "LINK_KIWIFY", img: "https://i.imgur.com/BRJxp0L.jpeg" },
    { id: 7, name: "Sentimento Impuro", cat: "rnb", bpm: "110", price: "R$ 110", link: "LINK_KIWIFY", img: "https://i.imgur.com/U4eTmbn.jpeg" },
    { id: 8, name: "Espanhola", cat: "trap", bpm: "140", price: "R$ 130", link: "LINK_KIWIFY", img: "https://i.imgur.com/y7VdvOD.jpeg" }
];

let currentBeatIndex = 0;
const audioPlayer = new Audio();
const playIcon = document.getElementById('masterPlayIcon');
const progressBar = document.getElementById('progress-bar');
const currentTimeDisplay = document.getElementById('current-time');
const durationTimeDisplay = document.getElementById('duration-time');

function formatFileName(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ç/g, "c").replace(/\s+/g, "");
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
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
                    <img src="${beat.img}" alt="${beat.name}">
                    <button class="play-btn" onclick="startBeat(${realIndex})">
                        <i data-lucide="play" fill="black" size="20"></i>
                    </button>
                </div>
                <h3>${beat.name}</h3>
                <p>${beat.cat.toUpperCase()} • ${beat.bpm} BPM</p>
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
    document.querySelector('.p-info small').innerText = `${beat.bpm} BPM | k3vin Beatz`;
    document.getElementById('p-img').src = beat.img;
    audioPlayer.src = `beats/${formatFileName(beat.name)}.mp3`;
    audioPlayer.play();
    updatePlayIcon(true);
}

function toggleAudio() {
    if (!audioPlayer.src) return;
    audioPlayer.paused ? audioPlayer.play() : audioPlayer.pause();
    updatePlayIcon(!audioPlayer.paused);
}

function updatePlayIcon(playing) {
    playIcon.setAttribute('data-lucide', playing ? 'pause' : 'play');
    lucide.createIcons();
}

audioPlayer.ontimeupdate = () => {
    if (audioPlayer.duration) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = percent;
        progressBar.style.background = `linear-gradient(to right, var(--accent) ${percent}%, #333 ${percent}%)`;
        currentTimeDisplay.innerText = formatTime(audioPlayer.currentTime);
        durationTimeDisplay.innerText = formatTime(audioPlayer.duration);
    }
};

progressBar.oninput = () => {
    audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
};

function nextBeat() {
    currentBeatIndex = (currentBeatIndex + 1) % beats.length;
    startBeat(currentBeatIndex);
}

function prevBeat() {
    currentBeatIndex = (currentBeatIndex - 1 + beats.length) % beats.length;
    startBeat(currentBeatIndex);
}

function filter(cat) {
    renderBeats(cat);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === cat || (cat === 'all' && btn.innerText === 'TODOS'));
    });
}

document.addEventListener('DOMContentLoaded', () => renderBeats());