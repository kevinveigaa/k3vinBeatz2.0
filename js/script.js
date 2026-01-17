const beats = [
    { id: 1, name: "Retroceder", cat: "trap", price: "R$ 120", link: "https://sun.eduzz.com/60EEP52303" },
    { id: 2, name: "Prodígio", cat: "rnb", price: "R$ 90", link: "https://sun.eduzz.com/7WXQRKNO9A" },
    { id: 3, name: "Te Esperando", cat: "rap", price: "R$ 95", link: "https://chk.eduzz.com/n5j7fdbb" },
    { id: 4, name: "Auto Confiança", cat: "trap", price: "R$ 82", link: "https://chk.eduzz.com/G92E6XZZWE" },
    { id: 5, name: "Lentamente", cat: "trap", price: "R$ 98", link: "https://chk.eduzz.com/G96132EAW1" },
    { id: 6, name: "Sentimento Impuro", cat: "rnb", price: "R$ 110", link: "https://chk.eduzz.com/39YDPG6Q9O" },
    { id: 7, name: "Espanhola", cat: "trap", price: "R$ 130", link: "https://chk.eduzz.com/Q9N5JQ7P01" },
    { id: 8, name: "Desista", cat: "rnb", price: "R$ 130", link: "https://chk.eduzz.com/Q9N5JZ4K01" }
];

function render(filter = 'all') {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    const filtered = filter === 'all' ? beats : beats.filter(b => b.cat === filter);
    
    filtered.forEach(beat => {
        // Lógica de imagem por categoria automática
        const imgPath = `capas/${beat.cat}.png`;
        
        grid.innerHTML += `
            <div class="beat-card" onclick="selectBeat(${beat.id})">
                <img src="${imgPath}" alt="${beat.name}">
                <h3 style="margin: 15px 0 5px 0; font-size: 1.3rem">${beat.name}</h3>
                <span class="neon-text" style="font-size: 0.8rem; letter-spacing: 2px">${beat.cat.toUpperCase()}</span>
            </div>
        `;
    });
}

function selectBeat(id) {
    const beat = beats.find(b => b.id === id);
    const imgPath = `capas/${beat.cat}.png`;

    document.getElementById('p-img').src = imgPath;
    document.getElementById('p-name').innerText = beat.name;
    document.getElementById('p-price').innerText = beat.price;
    document.getElementById('p-buy').href = beat.link;
    
    // Feedback visual
    const cover = document.querySelector('.p-cover-wrapper');
    cover.style.transform = 'scale(1.1)';
    setTimeout(() => cover.style.transform = 'scale(1)', 200);
}

function setTheme(theme) {
    document.body.className = theme;
}

// Iniciar catálogo
render();