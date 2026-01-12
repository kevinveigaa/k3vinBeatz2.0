console.log("Beats carregados 🎧🔥");

/* MENU */
const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

menuBtn.onclick = () => menu.classList.toggle("active");

/* FILTRO */
const filterBtns = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".beat-card");

filterBtns.forEach(btn => {
  btn.onclick = () => {
    const filter = btn.dataset.filter;
    cards.forEach(card => {
      card.style.display =
        filter === "all" || card.dataset.category === filter
        ? "block"
        : "none";
    });
  };
});

/* BUSCA */
document.getElementById("searchInput").addEventListener("input", e => {
  const value = e.target.value.toLowerCase();
  cards.forEach(card => {
    card.style.display = card.dataset.name.includes(value) ? "block" : "none";
  });
});

/* TILT 3D */
cards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = -(y - r.height / 2) / 20;
    const ry = (x - r.width / 2) / 20;
    card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale(1)";
  });
});