let currentAudio = null;
let currentButton = null;

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.beat-card');
    const audio = card.querySelector('audio');
    const progress = card.querySelector('.progress-fill');

    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentButton.innerHTML = '▶';
    }

    if (audio.paused) {
      audio.play();
      btn.innerHTML = '⏸';
      currentAudio = audio;
      currentButton = btn;
    } else {
      audio.pause();
      btn.innerHTML = '▶';
    }

    audio.ontimeupdate = () => {
      const percent = (audio.currentTime / audio.duration) * 100;
      progress.style.width = percent + '%';
    };
  });
});

document.querySelectorAll('.progress-bar').forEach(bar => {
  bar.addEventListener('click', e => {
    const audio = bar.closest('.beat-card').querySelector('audio');
    const rect = bar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * audio.duration;
  });
});

document.querySelectorAll('.btn-fav').forEach(btn => {
  btn.addEventListener('click', e => {
    btn.classList.toggle('active');
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      p.textContent = '❤';
      p.style.setProperty('--x', Math.random() * 2 - 1);
      p.style.setProperty('--y', Math.random() * 2);
      btn.appendChild(p);
      setTimeout(() => p.remove(), 800);
    }
  });
});

document.querySelectorAll('.dot-btn').forEach(dot => {
  dot.addEventListener('click', () => {
    document.body.className = dot.dataset.theme;
  });
});
