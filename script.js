// Auto-update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- VIEW SWITCHING ---------- */
const views = document.querySelectorAll('.view');
const tabBtns = document.querySelectorAll('.tab-btn');

function showView(name) {
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.view === name));
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  window.scrollTo(0, 0);
  closeMenu();
}

// Attach event listener to all elements with data-view
document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showView(el.dataset.view);
  });
});

document.getElementById('logoHome').addEventListener('click', (e) => {
  e.preventDefault();
  showView('home');
});

/* ---------- SEARCH TOGGLE ---------- */
const searchBox = document.getElementById('searchBox');
const searchToggle = document.getElementById('searchToggle');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchToggle.addEventListener('click', () => {
  searchBox.classList.add('open');
  searchInput.focus();
});
searchClose.addEventListener('click', () => {
  searchBox.classList.remove('open');
  searchInput.value = '';
});

/* ---------- SIDE MENU ---------- */
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');

function openMenu() {
  sideMenu.classList.add('open');
  menuOverlay.classList.add('open');
}
function closeMenu() {
  sideMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
}
menuToggle.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

/* ---------- TOPBAR SHADOW ON SCROLL ---------- */
const topbar = document.getElementById('topbar');
window.addEventListener('scroll', () => {
  topbar.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.4)' : 'none';
}, { passive: true });
