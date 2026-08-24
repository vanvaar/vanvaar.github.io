document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all buttons
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
});
                          
