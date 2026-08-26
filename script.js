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

const HIDE_BOTTOMBAR_VIEWS = ['login', 'signup'];

/* ==========================================================
   SMART HISTORY NAVIGATION
   - Step-by-step back button support.
   - When reaching root 'home' and pressing back again,
     the browser cleanly exits the website.
   ========================================================== */
let currentState = { view: 'home', search: false, menu: false };

function renderState(state) {
  // Switch Views
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + state.view));
  tabBtns.forEach(b => b.classList.toggle('active', b.dataset.view === state.view));

  // Search box state
  searchBox.classList.toggle('open', state.search);
  if (!state.search) searchInput.value = '';

  // Side menu state
  sideMenu.classList.toggle('open', state.menu);
  menuOverlay.classList.toggle('open', state.menu);

  // Bottom bar auto-hide
  const hideBar = state.search || HIDE_BOTTOMBAR_VIEWS.includes(state.view);
  bottombar.classList.toggle('hidden', hideBar);

  currentState = state;
}

function navigate(partial) {
  // If clicking on same active view with no open modals, avoid duplicate states
  if (
    partial.view &&
    partial.view === currentState.view &&
    !currentState.search &&
    !currentState.menu &&
    !partial.search &&
    !partial.menu
  ) {
    mainContent.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    window.scrollTo(0, 0);
    return;
  }

  const newState = { ...currentState, ...partial };
  history.pushState(newState, '');
  renderState(newState);
  mainContent.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  window.scrollTo(0, 0);
}

// Initial entry state (Replace state so initial home doesn't duplicate)
history.replaceState(currentState, '');
renderState(currentState);

// Back / Forward Browser Event
window.addEventListener('popstate', (e) => {
  if (e.state) {
    renderState(e.state);
  } else {
    // If no state exists (reached first entry), render home
    renderState({ view: 'home', search: false, menu: false });
  }
});

/* ---------- VIEW LINKS ---------- */
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
