// Tab switching logic for Bottom Navigation
function openTab(tabId, element) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active-tab');
    }

    if (element) {
        const navItems = document.querySelectorAll('.bottom-nav .nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        element.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    
                 }
