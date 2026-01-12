console.log("K3VIN BEATZ carregado 🎧🔥");

document.addEventListener('DOMContentLoaded', () => {
  // TILT 3D
  document.querySelectorAll('.beat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const xRotation = -((y - rect.height / 2) / 20);
      const yRotation = (x - rect.width / 2) / 20;
      card.style.transform = `perspective(1000px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });

  // MENU CATEGORIAS
  const menuBtn = document.getElementById('menuButton');
  const menuDropdown = document.getElementById('menuDropdown');
  menuBtn.addEventListener('click', () => {
    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';
  });

  // FILTRO POR CATEGORIA
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');
      document.querySelectorAll('.beat-card').forEach(card => {
        card.style.display = card.dataset.category === category ? 'flex' : 'none';
      });
      if (!document.getElementById('backBtn')) {
        const back = document.createElement('button');
        back.textContent = 'Voltar para todos os beats';
        back.id = 'backBtn';
        back.style.margin = '20px';
        back.style.padding = '10px 20px';
        back.style.cursor = 'pointer';
        back.onclick = () => location.reload();
        document.querySelector('.lista-beats').prepend(back);
      }
    });
  });

  // BUSCA POR NOME
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll('.beat-card').forEach(card => {
      const name = card.dataset.name.toLowerCase();
      card.style.display = name.includes(value) ? 'flex' : 'none';
    });
  });
});