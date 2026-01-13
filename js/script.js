document.addEventListener("DOMContentLoaded", () => {

  // MENU
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
      btn.style.cssText =
        "margin:15px auto; padding:8px 18px; border-radius:20px; border:1px solid var(--main-color); background:none; color:white; cursor:pointer;";
      backBtnContainer.appendChild(btn);
      btn.onclick = () => {
        document.querySelectorAll(".beat-card").forEach(c => c.style.display="flex");
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
      card.style.display = card.querySelector(".btn-fav").classList.contains("active") ? "flex" : "none";
    });
    menuDropdown.style.display = "none";
    showBackBtn();
  };

  // BUSCA
  document.getElementById("searchInput").addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll(".beat-card").forEach(card => {
      card.style.display = card.dataset.name.includes(v) ? "flex" : "none";
    });
  });

  // FAVORITOS
  let favs = JSON.parse(localStorage.getItem("k3vin_favs")) || [];
  document.querySelectorAll(".beat-card").forEach(card => {
    const name = card.dataset.name;
    const btn = card.querySelector(".btn-fav");
    if (favs.includes(name)) btn.classList.add("active");

    btn.onclick = () => {
      btn.classList.toggle("active");
      if (btn.classList.contains("active")) favs.push(name);
      else favs = favs.filter(f => f !== name);
      localStorage.setItem("k3vin_favs", JSON.stringify(favs));
    };
  });

  // PLAYER
  let currentAudio = null;

  document.querySelectorAll(".player").forEach(player => {
    const audio = new Audio(player.dataset.audio);
    const playBtn = player.querySelector(".play-btn");
    const bar = player.querySelector(".progress-bar");
    const dot = player.querySelector(".progress-dot");
    const cur = player.querySelector(".current");
    const dur = player.querySelector(".duration");

    playBtn.onclick = () => {
      if (currentAudio && currentAudio !== audio) currentAudio.pause();
      currentAudio = audio;
      audio.paused ? audio.play() : audio.pause();
      playBtn.innerHTML = audio.paused ? '<i class="fa-solid fa-play"></i>' : '<i class="fa-solid fa-pause"></i>';
    };

    audio.ontimeupdate = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      bar.style.setProperty("--p", percent + "%");
      bar.firstElementChild.style.width = percent + "%";
      dot.style.left = percent + "%";
      cur.innerText = format(audio.currentTime);
      dur.innerText = format(audio.duration);
    };

    bar.onclick = e => {
      const x = e.offsetX / bar.clientWidth;
      audio.currentTime = x * audio.duration;
    };
  });

  function format(t) {
    if (!t) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60).toString().padStart(2,"0");
    return `${m}:${s}`;
  }
});

// TEMA
function changeTheme(t) {
  document.body.className = t === "default" ? "" : t;
}
