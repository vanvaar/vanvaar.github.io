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
   HISTORY-BASED NAVIGATION
   हर click एक history entry बनाता है, ताकि phone का back
   button दबाने पर सिर्फ एक ही step पीछे जाए — सीधे home पर
   नहीं पहुंचे, और site browser से बंद भी न हो।
   ========================================================== */
let currentState = { view: 'home', search: false, menu: false };

function renderState(state) {
  // Views दिखाना/छुपाना
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + state.view));
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.view === state.view));

  // Search box
  searchBox.classList.toggle('open', state.search);
  if (!state.search) searchInput.value = '';

  // Side menu
  sideMenu.classList.toggle('open', state.menu);
  menuOverlay.classList.toggle('open', state.menu);

  // Bottom bar — search खुला हो या login/signup view हो तो छुपा दो
  const hideBar = state.search || HIDE_BOTTOMBAR_VIEWS.includes(state.view);
  bottombar.classList.toggle('hidden', hideBar);

  currentState = state;
}

// नया navigation step: history में push करो + UI update करो
function navigate(partial) {
  const newState = { ...currentState, ...partial };
  history.pushState(newState, '');
  renderState(newState);
  mainContent.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  window.scrollTo(0, 0);
}

// शुरुआती state सेट करो (yeh history में replace होगा, push नहीं)
history.replaceState(currentState, '');
renderState(currentState);

// Back/Forward button दबाने पर
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
  topbar.style.boxShadow = window.scrollY > 10 ? '0 2px 12px rgba(0,0,0,0.4)' : 'none';
}, { passive: true });
