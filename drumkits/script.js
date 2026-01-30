// =======================
// DRUMKITS DATA
// =======================
const drumkits = [
    {
        id: 1,
        name: "Trap Essentials Vol.1",
        price: "R$79",
        link: "https://pay.kiwify.com.br/SEULINK1",
        cover: "trapessentials",
        preview: "trapessentials"
    },
    {
        id: 2,
        name: "Funk Brasil Pack",
        price: "R$69",
        link: "https://pay.kiwify.com.br/SEULINK2",
        cover: "funkbrasil",
        preview: "funkbrasil"
    },
    {
        id: 3,
        name: "RnB Vibes Kit",
        price: "R$89",
        link: "https://pay.kiwify.com.br/SEULINK3",
        cover: "rnbvibes",
        preview: "rnbvibes"
    }
];

// =======================
// ESTADO GLOBAL
// =======================
let currentId = null;

// =======================
// WAVESURFER
// =======================
const wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#333',
    progressColor: '#8a2be2',
    cursorColor: '#fff',
    barWidth: 2,
    height: 35,
    responsive: true
});

// =======================
// RENDER
// =======================
function renderDrumkits() {
    const grid = document.getElementById("drumkitGrid");
    if (!grid) return;

    grid.innerHTML = "";

    drumkits.forEach(d => {
        const isPlaying = currentId === d.id && wavesurfer.isPlaying();

        grid.innerHTML += `
            <div class="card">
                <div class="card-top">
                    <img src="capas/${d.cover}.jpg"
                         class="img-static"
                         onerror="this.onerror=null;this.src='capas/${d.cover}.png'">
                    <div class="beat-info-main">
                        <h3>${d.name}</h3>
                        <span>DRUMKIT</span>
                    </div>
                </div>

                <div class="controls-row">
                    <button class="play-btn-card" onclick="loadDrumkit(${d.id})">
                        ${isPlaying ? 'II' : '▶'}
                    </button>

                    <span class="price-tag">${d.price}</span>
                    <a href="${d.link}" target="_blank" class="btn-buy">COMPRAR</a>
                </div>
            </div>
        `;
    });
}

// =======================
// LOAD / PLAY DRUMKIT
// =======================
function loadDrumkit(id) {
    const kit = drumkits.find(k => k.id === id);
    if (!kit) return;

    if (currentId === id) {
        wavesurfer.playPause();
        return;
    }

    currentId = id;

    const player = document.getElementById("stickyPlayer");
    if (player) player.style.display = "block";

    document.getElementById("p-name-player").innerText = kit.name;

    const img = document.getElementById("p-img-player");
    img.src = `capas/${kit.cover}.jpg`;
    img.onerror = function () {
        this.onerror = null;
        this.src = `capas/${kit.cover}.png`;
    };

    wavesurfer.load(`previews/${kit.preview}.mp3`);
    wavesurfer.once("ready", () => wavesurfer.play());
}

// =======================
// PLAYER MASTER BUTTON
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const masterBtn = document.getElementById("pp-btn");

    if (masterBtn) {
        masterBtn.onclick = () => {
            if (!currentId) {
                loadDrumkit(drumkits[0].id);
            } else {
                wavesurfer.playPause();
            }
        };
    }

    renderDrumkits();
});

// =======================
// SYNC PLAY / PAUSE ICONS
// =======================
wavesurfer.on("play", () => {
    const btn = document.getElementById("pp-btn");
    if (btn) btn.innerText = "II";
    renderDrumkits();
});

wavesurfer.on("pause", () => {
    const btn = document.getElementById("pp-btn");
    if (btn) btn.innerText = "▶";
    renderDrumkits();
});
