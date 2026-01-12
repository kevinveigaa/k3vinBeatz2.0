document.addEventListener('DOMContentLoaded', () => {

  const menuBtn = document.getElementById('menuButton');

  const menuDropdown = document.getElementById('menuDropdown');

  const backBtnContainer = document.getElementById('backBtnContainer');

  // 1. Menu Toggle

  menuBtn.addEventListener('click', () => {

    menuDropdown.style.display = menuDropdown.style.display === 'block' ? 'none' : 'block';

  });

  // 2. Lógica de Favoritos (LocalStorage)

  let favoritos = JSON.parse(localStorage.getItem('k3vin_favs')) || [];

  document.querySelectorAll('.beat-card').forEach(card => {

    const name = card.dataset.name;

    const btn = card.querySelector('.btn-fav');

    

    if (favoritos.includes(name)) {

      btn.classList.add('active');

      btn.querySelector('i').classList.replace('fa-regular', 'fa-solid');

    }

    btn.addEventListener('click', (e) => {

      e.stopPropagation();

      btn.classList.toggle('active');

      const isFav = btn.classList.contains('active');

      btn.querySelector('i').classList.replace(isFav ? 'fa-regular' : 'fa-solid', isFav ? 'fa-solid' : 'fa-regular');

      

      if (isFav) favoritos.push(name);

      else favoritos = favoritos.filter(f => f !== name);

      

      localStorage.setItem('k3vin_favs', JSON.stringify(favoritos));

    });

  });

  // 3. Filtros (Categorias e Favoritos)

  function showBackBtn() {

    if (!document.getElementById('backBtn')) {

      const b = document.createElement('button');

      b.id = 'backBtn'; b.innerHTML = '← Ver Todos os Beats';

      b.style = "margin:10px auto; background:none; color:white; border:1px solid var(--main-color); padding:8px 15px; border-radius:20px; cursor:pointer; font-weight:600;";

      backBtnContainer.appendChild(b);

      b.onclick = () => { document.querySelectorAll('.beat-card').forEach(c => c.style.display = 'flex'); b.remove(); };

    }

  }

  document.querySelectorAll('.category-btn').forEach(btn => {

    btn.addEventListener('click', () => {

      const cat = btn.dataset.category;

      document.querySelectorAll('.beat-card').forEach(c => c.style.display = c.dataset.category === cat ? 'flex' : 'none');

      showBackBtn();

      menuDropdown.style.display = 'none';

    });

  });

  document.getElementById('btnShowFavs').addEventListener('click', () => {

    document.querySelectorAll('.beat-card').forEach(c => {

      c.style.display = c.querySelector('.btn-fav').classList.contains('active') ? 'flex' : 'none';

    });

    showBackBtn();

    menuDropdown.style.display = 'none';

  });

  // 4. Busca

  document.getElementById('searchInput').addEventListener('input', (e) => {

    const v = e.target.value.toLowerCase();

    document.querySelectorAll('.beat-card').forEach(c => c.style.display = c.dataset.name.toLowerCase().includes(v) ? 'flex' : 'none');

  });

  // 5. Skeleton

  window.addEventListener('load', () => {

    setTimeout(() => document.querySelectorAll('.skeleton').forEach(s => s.classList.remove('skeleton')), 800);

  });

});

function changeTheme(t) { document.body.className = t === 'default' ? '' : t; }

