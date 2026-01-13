let currentAudio = null;

document.addEventListener("DOMContentLoaded", () => {

  // MENU
  const menuBtn = document.getElementById("menuButton");
  const menu = document.getElementById("menuDropdown");

  menuBtn.onclick = () => {
    menu.style.display = menu.style.display === "block" ? "none" : "block";
  };

  // FAVORITOS
  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];

  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const favBtn = card.querySelector(".btn-fav");

    if (favs.includes(name)) favBtn.classList.add("active");

    favBtn.onclick = e => {
      e.stopPropagation();
      favBtn.classList.toggle("active");

      if (favBtn.classList.contains("active")) favs.push(name);
      else favs = favs.filter(f => f !== name);

      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    };

    // PLAYER
    const player = card.querySelector(".player");
    const btn = player.querySelector(".play-btn");
    const audio = new Audio(player.dataset.audio);

    btn.onclick = () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        document.querySelectorAll(".play-btn i").forEach(i => i.className = "fa-solid fa-play");
      }

      if (audio.paused) {
        audio.play();
        btn.querySelector("i").className = "fa-solid fa-pause";
        currentAudio = audio;
      } else {
        audio.pause();
        btn.querySelector("i").className = "fa-solid fa-play";
      }
    };
  });

  // BUSCA
  document.getElementById("searchInput").addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll(".beat-card").forEach(c => {
      c.style.display = c.dataset.name.includes(v) ? "flex" : "none";
    });
  });

  // CATEGORIAS
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;
      document.querySelectorAll(".beat-card").forEach(c => {
        c.style.display = c.dataset.category === cat ? "flex" : "none";
      });
      menu.style.display = "none";
    };
  });

  document.getElementById("btnShowFavs").onclick = () => {
    document.querySelectorAll(".beat-card").forEach(c => {
      c.style.display = c.querySelector(".btn-fav").classList.contains("active") ? "flex" : "none";
    });
    menu.style.display = "none";
  };
});

function changeTheme(t) {
  document.body.className = t === "default" ? "" : t;
}
