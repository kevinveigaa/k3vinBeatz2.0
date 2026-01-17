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
        document.querySelectorAll(".beat-card").forEach(c => c.style.display = "flex");
        btn.remove();
      };
    }
  }

  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.onclick = () => {
      const cat = btn.dataset.category;
      document.querySelectorAll(".beat-card").forEach(card => {
        card.style.display = card.dataset.category === cat ? "flex" : "none";
      });
      menuDropdown.style.display = "none";
      showBackBtn();
    };
  });

  document.getElementById("btnShowFavs").onclick = () => {
    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display = card.querySelector(".btn-fav").classList.contains("active")
        ? "flex" : "none";
    });
    menuDropdown.style.display = "none";
    showBackBtn();
  };

  // FAVORITOS
  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];

  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const btn = card.querySelector(".btn-fav");

    if (favs.includes(name)) btn.classList.add("active");

    btn.onclick = e => {
      btn.classList.toggle("active");
      if (btn.classList.contains("active")) {
        favs.push(name);
        createParticle(e);
      } else {
        favs = favs.filter(f => f !== name);
      }
      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    };
  });

  function createParticle(e) {
    const p = document.createElement("div");
    p.className = "particle";
    p.innerHTML = "❤️";
    p.style.left = e.clientX + "px";
    p.style.top = e.clientY + "px";
    p.style.setProperty('--x', Math.random() * 2 - 1);
    p.style.setProperty('--y', Math.random() * 2 - 1);
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }

  // PLAYER
  let currentAudio = null;
  let currentBtn = null;

  document.querySelectorAll(".player").forEach(player => {
    const audio = new Audio(player.dataset.audio);
    const playBtn = player.querySelector(".play-btn");
    const bar = player.querySelector(".progress-bar");
    const fill = player.querySelector(".progress-fill");

    playBtn.onclick = () => {
      if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        if (currentBtn) currentBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      }

      currentAudio = audio;
      currentBtn = playBtn;

      audio.paused ? audio.play() : audio.pause();
      playBtn.innerHTML = audio.paused
        ? '<i class="fa-solid fa-play"></i>'
        : '<i class="fa-solid fa-pause"></i>';
    };

    audio.ontimeupdate = () => {
      fill.style.width = (audio.currentTime / audio.duration) * 100 + "%";
    };

    bar.onclick = e => {
      const rect = bar.getBoundingClientRect();
      audio.currentTime = ((e.clientX - rect.left) / bar.clientWidth) * audio.duration;
    };

    audio.onended = () => {
      playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
      fill.style.width = "0%";
    };

    // PREVIEW NA CAPA
    player.closest(".beat-card").querySelector(".thumb").addEventListener("mouseenter", () => {
      audio.volume = 0.2;
      audio.play();
      setTimeout(() => audio.pause(), 2000);
    });
  });
});

function changeTheme(t) {
  document.body.className = t === "default" ? "" : t;
}
