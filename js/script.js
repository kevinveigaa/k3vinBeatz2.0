const beats = [
<<<<<<< HEAD

    {id:1, name:"Retroceder", cat:"trap", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV", img:"https://i.imgur.com/WjvDH0b.jpeg", badge:"best"},

    {id:2, name:"Prodígio", cat:"rnb", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr", img:"https://i.imgur.com/cyHzDoM.jpeg", badge:"new"},

    {id:3, name:"Desista", cat:"rnb", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1", img:"https://i.imgur.com/YDgwkli.jpeg", badge:"new"},

    {id:4, name:"Te Esperando", cat:"rap", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs", img:"https://i.imgur.com/BA6SDme.png"},

    {id:5, name:"Auto Confiança", cat:"trap", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069", img:"https://i.imgur.com/wAOKpZ5.jpeg", badge:"new"},

    {id:6, name:"Lentamente", cat:"trap", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G", img:"https://i.imgur.com/BRJxp0L.jpeg"},

    {id:7, name:"Sentimento Impuro", cat:"rnb", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v", img:"https://i.imgur.com/U4eTmbn.jpeg"},

    {id:8, name:"Espanhola", cat:"trap", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS", img:"https://i.imgur.com/y7VdvOD.jpeg", badge:"exclusive"}

];

const highlightsIds = [2, 3, 6];

let audio = new Audio();

let currentId = null;

let likedBeats = []; 

function render(list) {

    const grid = document.getElementById("beatGrid");

    grid.innerHTML = "";

    list.forEach((b) => {

        const isLiked = likedBeats.includes(b.id);

        grid.innerHTML += `

        <article class="card" id="beat-card-${b.id}">

            <div class="cover-box">

                <img src="${b.img}" alt="${b.name}">

                <button class="fav-btn ${isLiked ? 'active' : ''}" onclick="toggleFav(this, ${b.id})">❤</button>

                ${b.badge ? `<span class="badge ${b.badge}">${b.badge === "best" ? "Mais vendido" : b.badge === "new" ? "Novo" : "Exclusivo"}</span>` : ""}

            </div>

            <div class="preview-box" onclick="playPreview(${b.id}, this)">

                <div class="preview-label">▶</div>

                <div class="preview-progress"><span id="bar-${b.id}"></span></div>

            </div>

            <div class="card-info">

                <h3>${b.name}</h3>

                <p>${b.cat.toUpperCase()} • ${b.bpm} BPM</p>

            </div>

            <div class="card-right">

                <span class="price">${b.price}</span>

                <a class="buy-link" href="${b.link}" target="_blank">COMPRAR</a>

            </div>

        </article>`;

    });

}

function playPreview(id, el) {

    const beat = beats.find(b => b.id === id);

    const label = el.querySelector('.preview-label');

    if (currentId === id && !audio.paused) { audio.pause(); return; }

    document.querySelectorAll('.preview-label').forEach(l => l.innerText = "▶");

    document.querySelectorAll('.preview-progress span').forEach(s => s.style.width = "0%");

    currentId = id;

    const fileName = beat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "");

    audio.src = `beats/${fileName}.mp3`;

    audio.play();

    label.innerText = "❚❚";

    audio.ontimeupdate = () => {

        let p = (audio.currentTime / audio.duration) * 100;

        const bar = document.getElementById(`bar-${id}`);

        if (bar) bar.style.width = p + "%";

    };

    audio.onended = () => { label.innerText = "▶"; };

}

function toggleFav(btn, id) {

    if (likedBeats.includes(id)) {

        likedBeats = likedBeats.filter(i => i !== id);

        btn.classList.remove('active');

    } else {

        likedBeats.push(id);

        btn.classList.add('active');

    }

}

function filterCat(cat, event) {

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    event.currentTarget.classList.add('active');

    const filtered = cat === 'all' ? beats : beats.filter(b => b.cat === cat);

    render(filtered);

}

function filterFavs(event) {

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    event.currentTarget.classList.add('active');

    const filtered = beats.filter(b => likedBeats.includes(b.id));

    render(filtered);

}

function filterBpm(type, event) {

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    event.currentTarget.classList.add('active');

    const filtered = beats.filter(b => type === 'above' ? b.bpm > 120 : b.bpm <= 120);

    render(filtered);

}

function sendComment() {

    const input = document.getElementById('userComment');

    if (input.value.trim() !== "") { input.placeholder = "Obrigado!"; input.value = ""; }

}

function renderHighlights() {

    const grid = document.getElementById("highlightGrid");

    grid.innerHTML = "";

    highlightsIds.forEach(id => {

        const b = beats.find(bt => bt.id === id);

        if(b) grid.innerHTML += `<div class="highlight-card" onclick="scrollToBeat(${b.id})"><img src="${b.img}"></div>`;

    });

}

function scrollToBeat(id) {

    const element = document.getElementById(`beat-card-${id}`);

    if(element) element.scrollIntoView({ behavior: "smooth", block: "center" });

}

document.addEventListener('DOMContentLoaded', () => { render(beats); renderHighlights(); });

=======
    {id:1, name:"Retroceder", cat:"trap", bpm:132, price:"R$120", link:"https://pay.kiwify.com.br/0YaIpFV", img:"https://i.imgur.com/WjvDH0b.jpeg", badge:"best"},
    {id:2, name:"Prodígio", cat:"rnb", bpm:120, price:"R$90", link:"https://pay.kiwify.com.br/jXHrjSr", img:"https://i.imgur.com/cyHzDoM.jpeg", badge:"new"},
    {id:3, name:"Desista", cat:"rnb", bpm:91, price:"R$130", link:"https://pay.kiwify.com.br/rqdgNG1", img:"https://i.imgur.com/YDgwkli.jpeg", badge:"new"},
    {id:4, name:"Te Esperando", cat:"rap", bpm:130, price:"R$95", link:"https://pay.kiwify.com.br/509sDIs", img:"https://i.imgur.com/BA6SDme.png"},
    {id:5, name:"Auto Confiança", cat:"trap", bpm:128, price:"R$82", link:"https://pay.kiwify.com.br/BXai069", img:"https://i.imgur.com/wAOKpZ5.jpeg", badge:"new"},
    {id:6, name:"Lentamente", cat:"trap", bpm:101, price:"R$98", link:"https://pay.kiwify.com.br/tsbZm3G", img:"https://i.imgur.com/BRJxp0L.jpeg"},
    {id:7, name:"Sentimento Impuro", cat:"rnb", bpm:110, price:"R$110", link:"https://pay.kiwify.com.br/MlLKd8v", img:"https://i.imgur.com/U4eTmbn.jpeg"},
    {id:8, name:"Espanhola", cat:"trap", bpm:140, price:"R$130", link:"https://pay.kiwify.com.br/lkhizZS", img:"https://i.imgur.com/y7VdvOD.jpeg", badge:"exclusive"}
];

const highlightsIds = [2, 3, 6];
let audio = new Audio();
let currentId = null;

function render(list) {
    const grid = document.getElementById("beatGrid");
    grid.innerHTML = "";
    list.forEach((b) => {
        grid.innerHTML += `
        <article class="card" id="beat-card-${b.id}">
            <div class="cover-box">
                <img src="${b.img}" alt="${b.name}">
                ${b.badge ? `<span class="badge ${b.badge}">${b.badge === "best" ? "Mais vendido" : b.badge === "new" ? "Novo" : "Exclusivo"}</span>` : ""}
            </div>
            <div class="preview-box" onclick="playPreview(${b.id}, this)">
                <div class="preview-label">▶</div>
                <div class="preview-progress"><span id="bar-${b.id}"></span></div>
            </div>
            <div class="card-info">
                <h3>${b.name}</h3>
                <p>${b.cat.toUpperCase()} • ${b.bpm} BPM</p>
            </div>
            <div class="card-right">
                <span class="price">${b.price}</span>
                <a class="buy-link" href="${b.link}" target="_blank">COMPRAR</a>
            </div>
        </article>`;
    });
}

function playPreview(id, el) {
    const beat = beats.find(b => b.id === id);
    const label = el.querySelector('.preview-label');

    if (currentId === id && !audio.paused) {
        audio.pause();
        return;
    }

    document.querySelectorAll('.preview-label').forEach(l => l.innerText = "▶");
    document.querySelectorAll('.preview-progress span').forEach(s => s.style.width = "0%");

    currentId = id;
    const fileName = beat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "");
    audio.src = `beats/${fileName}.mp3`;
    audio.play();
    label.innerText = "❚❚";

    audio.ontimeupdate = () => {
        let p = (audio.currentTime / audio.duration) * 100;
        const bar = document.getElementById(`bar-${id}`);
        if (bar) bar.style.width = p + "%";
    };

    audio.onended = () => { label.innerText = "▶"; };
    audio.onpause = () => { label.innerText = "▶"; };
}

function setActiveButton(element) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}

function filterCat(cat, event) {
    if(event) setActiveButton(event.currentTarget);
    const filtered = cat === 'all' ? beats : beats.filter(b => b.cat === cat);
    render(filtered);
}

function filterBpm(type, event) {
    if(event) setActiveButton(event.currentTarget);
    const filtered = beats.filter(b => type === 'above' ? b.bpm > 120 : b.bpm <= 120);
    render(filtered);
}

function renderHighlights() {
    const grid = document.getElementById("highlightGrid");
    grid.innerHTML = "";
    highlightsIds.forEach(id => {
        const b = beats.find(bt => bt.id === id);
        if(b) {
            grid.innerHTML += `<div class="highlight-card" onclick="scrollToBeat(${b.id})"><img src="${b.img}"></div>`;
        }
    });
}

function scrollToBeat(id) {
    const element = document.getElementById(`beat-card-${id}`);
    if(element) element.scrollIntoView({ behavior: "smooth", block: "center" });
}

document.addEventListener('DOMContentLoaded', () => {
    render(beats);
    renderHighlights();
});
>>>>>>> 7a1b217aafd7754ff0fb4c9a64dc4d7c4814115c
