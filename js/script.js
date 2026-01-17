document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("menuButton");
  const menuDropdown = document.getElementById("menuDropdown");
  const backContainer = document.getElementById("backBtnContainer");

  menuBtn.onclick = () => {
    menuDropdown.style.display =
      menuDropdown.style.display === "block" ? "none" : "block";
  };

  function createBackBtn() {
    if (document.getElementById("backBtn")) return;

    const btn = document.createElement("button");
    btn.id = "backBtn";
    btn.innerText = "← Ver todos os beats";
    btn.style.cssText = `
      margin:15px auto;
      padding:8px 18px;
      border-radius:20px;
      border:1px solid var(--main-color);
      background:none;
      color:white;
      cursor:pointer;
    `;

    backContainer.appendChild(btn);

    btn.onclick = () => {
      document.querySelectorAll(".beat-card").forEach(card => {
        card.style.display = "flex";
      });
      btn.remove();
    };
  }

  /* FILTRO */
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;

      document.querySelectorAll(".beat-card").forEach(card => {
        card.style.display =
          card.dataset.category === cat ? "flex" : "none";
      });

      menuDropdown.style.display = "none";
      createBackBtn();
    };
  });

  /* FAVORITOS */
  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];

  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const favBtn = card.querySelector(".btn-fav");

    if (favs.includes(name)) favBtn.classList.add("active");

    favBtn.onclick = () => {
      favBtn.classList.toggle("active");

      if (favBtn.classList.contains("active")) {
        favs.push(name);
      } else {
        favs = favs.filter(n => n !== name);
      }

      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    };
  });

  document.getElementById("btnShowFavs").onclick = () => {
    document.querySelectorAll(".beat-card").forEach(card => {
      const fav = card.querySelector(".btn-fav").classList.contains("active");
      card.style.display = fav ? "flex" : "none";
    });

    menuDropdown.style.display = "none";
    createBackBtn();
  };

  /* BUSCA */
  document.getElementById("searchInput").addEventListener("input", e => {
    const val = e.target.value.toLowerCase();

    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display =
        card.dataset.name.includes(val) ? "flex" : "none";
    });
  });

  /* PLAYER */
  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll(".player").forEach(player => {

    const audio = new Audio(player.dataset.audio);
    const playBtn = player.querySelector(".play-btn");
    const bar = player.querySelector(".progress-bar");
    const fill = player.querySelector(".progress-fill");
    const current = player.querySelector(".current");
    const duration = player.querySelector(".duration");

    playBtn.onclick = () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }

      currentAudio = audio;
      currentBtn = playBtn;

      audio.paused ? audio.play() : audio.pause();
      playBtn.innerHTML = audio.paused
        ? '<i class="fa-solid fa-play"></i>'
        : '<i class="fa-solid fa-pause"></i>';
    };

    audio.ontimeupdate = () => {
      if (!audio.duration) return;
      const percent = (audio.currentTime / audio.duration) * 100;
      fill.style.width = percent + "%";
      current.innerText = format(audio.currentTime);
      duration.innerText = format(audio.duration);
    };

    bar.onclick = e => {
      const rect = bar.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pos * audio.duration;
    };

    audio.onended = () => {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      fill.style.width = "0%";
      current.innerText = "0:00";
    };
  });

  function format(sec) {
    if (!sec) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
});
