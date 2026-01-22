const beats=[
{id:1,name:"Retroceder",cat:"trap",bpm:132,price:"R$120",link:"https://pay.kiwify.com.br/0YaIpFV",img:"https://i.imgur.com/WjvDH0b.jpeg",badge:"best"},
{id:2,name:"Prodígio",cat:"rnb",bpm:120,price:"R$90",link:"https://pay.kiwify.com.br/jXHrjSr",img:"https://i.imgur.com/cyHzDoM.jpeg",badge:"new"},
{id:3,name:"Desista",cat:"rnb",bpm:91,price:"R$130",link:"https://pay.kiwify.com.br/rqdgNG1",img:"https://i.imgur.com/YDgwkli.jpeg",badge:"new"},
{id:4,name:"Te Esperando",cat:"rap",bpm:130,price:"R$95",link:"https://pay.kiwify.com.br/509sDIs",img:"https://i.imgur.com/BA6SDme.png"},
{id:5,name:"Auto Confiança",cat:"trap",bpm:128,price:"R$82",link:"https://pay.kiwify.com.br/BXai069",img:"https://i.imgur.com/wAOKpZ5.jpeg",badge:"new"},
{id:6,name:"Lentamente",cat:"trap",bpm:101,price:"R$98",link:"https://pay.kiwify.com.br/tsbZm3G",img:"https://i.imgur.com/BRJxp0L.jpeg"},
{id:7,name:"Sentimento Impuro",cat:"rnb",bpm:110,price:"R$110",link:"https://pay.kiwify.com.br/MlLKd8v",img:"https://i.imgur.com/U4eTmbn.jpeg"},
{id:8,name:"Espanhola",cat:"trap",bpm:140,price:"R$130",link:"https://pay.kiwify.com.br/lkhizZS",img:"https://i.imgur.com/y7VdvOD.jpeg",badge:"exclusive"}
];

let audio=new Audio();
let current=null;

function render(list){
const grid=document.getElementById("beatGrid");
grid.innerHTML="";
list.forEach((b,i)=>{
grid.innerHTML+=`
<article class="card">
<div class="cover-box">
<img src="${b.img}">
${b.badge?`<span class="badge ${b.badge}">${b.badge==="best"?"Mais vendido":b.badge==="new"?"Novo":"Exclusivo"}</span>`:""}
<button class="play-btn" onclick="playPreview(${i})"><i data-lucide="play"></i></button>
</div>

<div class="preview-box" onclick="playPreview(${i})">
<div class="preview-label">Escutar preview</div>
<div class="preview-progress"><span id="bar-${i}"></span></div>
</div>

<div class="card-info">
<h3>${b.name}</h3>
<p>${b.cat.toUpperCase()} • ${b.bpm} BPM</p>
</div>

<div class="card-right">
<a class="buy-link" href="${b.link}" target="_blank">COMPRAR</a>
<span class="price">${b.price}</span>
</div>
</article>
`;
});
lucide.createIcons();
}

function playPreview(i){
if(current===i&&!audio.paused){audio.pause();return;}
current=i;
audio.src=`previews/${beats[i].name.toLowerCase().replace(/\s/g,"")}.mp3`;
audio.currentTime=0;
audio.play();
audio.ontimeupdate=()=>{
let p=(audio.currentTime/45)*100;
document.getElementById(`bar-${i}`).style.width=p+"%";
if(audio.currentTime>=45){audio.pause();}
};
}


function filterCat(cat){render(beats.filter(b=>cat==='all'?true:b.cat===cat))}
function filterBpm(type){
if(type==='above') render(beats.filter(b=>b.bpm>120))
if(type==='below') render(beats.filter(b=>b.bpm<=120))
}

document.addEventListener('DOMContentLoaded',()=>render(beats));