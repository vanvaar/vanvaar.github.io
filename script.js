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
