document.addEventListener("DOMContentLoaded", () => {

  /* ================= MENU CATEGORIAS ================= */

  const menuBtn = document.getElementById("menuButton");
  const menuDropdown = document.getElementById("menuDropdown");
  const backBtnContainer = document.getElementById("backBtnContainer");

  menuBtn.addEventListener("click", () => {
    menuDropdown.style.display =
      menuDropdown.style.display === "block" ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!menuBtn.contains(e.target) && !menuDropdown.contains(e.target)) {
      menuDropdown.style.display = "none";
    }
  });

  function showBackBtn() {
    if (!document.getElementById("backBtn")) {
      const btn = document.createElement("button");
      btn.id = "backBtn";
      btn.innerText = "← Ver todos os beats";
      backBtnContainer.appendChild(btn);

      btn.onclick = () => {
        document.querySelectorAll(".beat-card").forEach(card => {
          card.style.display = "flex";
        });
        btn.remove();
      };
    }
  }

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;

      document.querySelectorAll(".beat-card").forEach(card => {
        card.style.display =
          card.dataset.category === cat ? "flex" : "none";
      });

      menuDropdown.style.display = "none";
      showBackBtn();
    });
  });

  document.getElementById("btnShowFavs").addEventListener("click", () => {
    document.querySelectorAll(".beat-card").forEach(card => {
      const favBtn = card.querySelector(".btn-fav");
      card.style.display = favBtn.classList.contains("active")
        ? "flex"
        : "none";
    });
    menuDropdown.style.display = "none";
    showBackBtn();
  });

  /* ================= BUSCA ================= */

  document.getElementById("searchInput").addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display = card.dataset.name.includes(value)
        ? "flex"
        : "none";
    });
  });

  /* ================= FAVORITOS ================= */

  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];

  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const favBtn = card.querySelector(".btn-fav");

    if (favs.includes(name)) favBtn.classList.add("active");

    favBtn.addEventListener("click", (e) => {
      favBtn.classList.toggle("active");

      if (favBtn.classList.contains("active")) {
        favs.push(name);
        createParticleHeart(e);
      } else {
        favs = favs.filter(f => f !== name);
      }

      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    });
  });

  function createParticleHeart(e) {
    const heart = document.createElement("div");
    heart.className = "particle";
    heart.innerHTML = "❤️";

    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;

    heart.style.setProperty("--x", x);
    heart.style.setProperty("--y", y);
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";

    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  /* ================= PLAYER ================= */

  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll(".player").forEach(player => {

    const audio = new Audio(player.dataset.audio);
    const playBtn = player.querySelector(".play-btn");
    const bar = player.querySelector(".progress-bar");
    const fill = player.querySelector(".progress-fill");
    const cur = player.querySelector(".current");
    const dur = player.querySelector(".duration");

    playBtn.addEventListener("click", () => {

      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        if (currentBtn) {
          currentBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        }
      }

      currentAudio = audio;
      currentBtn = playBtn;

      if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;

      const percent = (audio.currentTime / audio.duration) * 100;
      fill.style.width = percent + "%";
      cur.innerText = formatTime(audio.currentTime);
      dur.innerText = formatTime(audio.duration);
    });

    bar.addEventListener("click", e => {
      const rect = bar.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      audio.currentTime = x * audio.duration;
    });

    audio.addEventListener("ended", () => {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      fill.style.width = "0%";
      cur.innerText = "0:00";
    });

    /* PREVIEW AO PASSAR O MOUSE NA CAPA */
    const thumb = player.closest(".beat-card").querySelector(".thumb");
    thumb.addEventListener("mouseenter", () => {
      audio.volume = 0.2;
      audio.currentTime = 0;
      audio.play();
      setTimeout(() => audio.pause(), 1800);
    });

  });

  function formatTime(t) {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

});

/* ================= TEMA ================= */

function changeTheme(theme) {
  document.body.className = theme === "default" ? "" : theme;
}
