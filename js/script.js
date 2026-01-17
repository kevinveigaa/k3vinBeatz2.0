document.addEventListener("DOMContentLoaded", () => {

  const menuBtn = document.getElementById("menuButton");
  const menuDropdown = document.getElementById("menuDropdown");
  const backBtnContainer = document.getElementById("backBtnContainer");

  menuBtn.onclick = () => {
    menuDropdown.style.display =
      menuDropdown.style.display === "block" ? "none" : "block";
  };

  function showBackBtn() {
    if (!document.getElementById("backBtn")) {
      const btn = document.createElement("button");
      btn.id = "backBtn";
      btn.innerText = "← Ver todos os beats";
      backBtnContainer.appendChild(btn);
      btn.onclick = () => {
        document.querySelectorAll(".beat-card")
          .forEach(c => c.style.display = "flex");
        btn.remove();
      };
    }
  }

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;
      document.querySelectorAll(".beat-card").forEach(card => {
        card.style.display =
          card.dataset.category === cat ? "flex" : "none";
      });
      menuDropdown.style.display = "none";
      showBackBtn();
    };
  });

  document.getElementById("btnShowFavs").onclick = () => {
    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display =
        card.querySelector(".btn-fav").classList.contains("active")
          ? "flex" : "none";
    });
    menuDropdown.style.display = "none";
    showBackBtn();
  };

  /* BUSCA */
  document.getElementById("searchInput").addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display =
        card.dataset.name.includes(v) ? "flex" : "none";
    });
  });

  /* FAVORITOS */
  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];

  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const btn = card.querySelector(".btn-fav");

    if (favs.includes(name)) btn.classList.add("active");

    btn.onclick = (e) => {
      btn.classList.toggle("active");
      if (btn.classList.contains("active")) {
        favs.push(name);
        createParticleHeart(e);
      } else {
        favs = favs.filter(f => f !== name);
      }
      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    };
  });

  function createParticleHeart(e) {
    const heart = document.createElement("div");
    heart.className = "particle";
    heart.innerHTML = "❤️";
    heart.style.setProperty('--x', Math.random() * 2 - 1);
    heart.style.setProperty('--y', Math.random() * 2 - 1);
    heart.style.left = e.clientX + "px";
    heart.style.top = e.clientY + "px";
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 800);
  }

  /* PLAYER */
  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll(".player").forEach(player => {
    const audio = new Audio(player.dataset.audio);
    const playBtn = player.querySelector(".play-btn");
    const bar = player.querySelector(".progress-bar");
    const fill = player.querySelector(".progress-fill");
    const cur = player.querySelector(".current");
    const dur = player.querySelector(".duration");

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
      fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
      cur.innerText = format(audio.currentTime);
      dur.innerText = format(audio.duration);
    };

    bar.onclick = e => {
      const rect = bar.getBoundingClientRect();
      audio.currentTime =
        ((e.clientX - rect.left) / bar.clientWidth) * audio.duration;
    };

    audio.onended = () => {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      fill.style.width = "0%";
      cur.innerText = "0:00";
    };

    player.parentElement.querySelector(".thumb")
      .addEventListener("mouseenter", () => {
        audio.volume = 0.2;
        audio.play();
        setTimeout(() => audio.pause(), 2000);
      });
  });

  function format(t) {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }
});

/* TEMA */
function changeTheme(t) {
  document.body.className = t === "default" ? "" : t;
}
