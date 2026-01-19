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

const audioPlayer = document.getElementById('main-audio');
const masterPlay = document.getElementById('masterPlay');

// Função para formatar o nome do ficheiro conforme a tua regra
function formatFileName(text) {
    return text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/ç/g, "c")              // Troca ç por c
        .replace(/\s+/g, "");            // Remove espaços (tudo junto)
}

function renderBeats(filterCat = 'all') {
    const grid = document.getElementById('beatGrid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = filterCat === 'all' ? beats : beats.filter(b => b.cat === filterCat);

    filtered.forEach(beat => {
        grid.innerHTML += `
            <article class="card">
                <div class="cover-box">
                    <img src="${beat.img}" alt="${beat.name}" onerror="this.src='https://via.placeholder.com/400?text=Beat'">
                    <button class="play-btn" onclick="setPlayer('${beat.name}', '${beat.img}')">
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

function setPlayer(name, img) {
    document.getElementById('p-title').innerText = name;
    document.getElementById('p-img').src = img;

    const fileName = formatFileName(name);
    audioPlayer.src = `beats/${fileName}.mp3`;
    
    audioPlayer.play();
    masterPlay.setAttribute('data-lucide', 'pause-circle');
    lucide.createIcons();
}

function toggleAudio() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        masterPlay.setAttribute('data-lucide', 'pause-circle');
    } else {
        audioPlayer.pause();
        masterPlay.setAttribute('data-lucide', 'play-circle');
    }
    lucide.createIcons();
}

function filter(cat) {
    renderBeats(cat);
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const text = btn.innerText.toLowerCase();
        btn.classList.toggle('active', text === cat || (cat === 'all' && text === 'todos'));
    });
}

document.addEventListener('DOMContentLoaded', () => renderBeats());