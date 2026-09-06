// Auto-update copyright year
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- ELEMENT REFERENCES ---------- */
const views = document.querySelectorAll('.view');
const tabBtns = document.querySelectorAll('.tab-btn');
const searchBox = document.getElementById('searchBox');
const searchToggle = document.getElementById('searchToggle');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const bottombar = document.getElementById('bottombar');
const topbar = document.getElementById('topbar');
const mainContent = document.getElementById('mainContent');

// Views जिन पर bottom bar का कोई काम नहीं है
const HIDE_BOTTOMBAR_VIEWS = ['login', 'signup'];

/* ==========================================================
   HISTORY-BASED NAVIGATION — back button एक बार में एक ही
   step पीछे जाता है, site कभी बंद नहीं होती।
   ========================================================== */
let currentState = { view: 'home', search: false, menu: false };

function renderState(state) {
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + state.view));
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.view === state.view));

  searchBox.classList.toggle('open', state.search);
  if (!state.search) searchInput.value = '';

  sideMenu.classList.toggle('open', state.menu);
  menuOverlay.classList.toggle('open', state.menu);

  const hideBar = state.search || HIDE_BOTTOMBAR_VIEWS.includes(state.view);
  bottombar.classList.toggle('hidden', hideBar);

  currentState = state;
}

function navigate(partial) {
  const newState = { ...currentState, ...partial };
  history.pushState(newState, '');
  renderState(newState);
  mainContent.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  window.scrollTo(0, 0);
}

history.replaceState(currentState, '');
renderState(currentState);

window.addEventListener('popstate', (e) => {
  const state = e.state || { view: 'home', search: false, menu: false };
  renderState(state);
});

/* ---------- VIEW LINKS (menu items, see-all, bottom tabs) ---------- */
document.querySelectorAll('[data-view]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigate({ view: el.dataset.view, search: false, menu: false });
  });
});

document.getElementById('logoHome').addEventListener('click', (e) => {
  e.preventDefault();
  navigate({ view: 'home', search: false, menu: false });
});

/* ---------- BOTTOM NAV CLICK-POP ANIMATION ---------- */
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    btn.classList.remove('pop');
    // force reflow so the animation can restart on repeated clicks
    void btn.offsetWidth;
    btn.classList.add('pop');
  });
  btn.addEventListener('animationend', () => btn.classList.remove('pop'));
});

/* ---------- SEARCH TOGGLE ---------- */
searchToggle.addEventListener('click', () => {
  navigate({ search: true });
  searchInput.focus();
});
searchClose.addEventListener('click', () => {
  history.back();
});

/* ---------- SIDE MENU ---------- */
menuToggle.addEventListener('click', () => {
  navigate({ menu: true });
});
menuClose.addEventListener('click', () => {
  history.back();
});
menuOverlay.addEventListener('click', () => {
  history.back();
});

/* ---------- TOPBAR SHADOW ON SCROLL ---------- */
window.addEventListener('scroll', () => {
  topbar.style.boxShadow = window.scrollY > 10 ? '0 4px 0 rgba(13,13,13,0.08)' : 'none';
}, { passive: true });
