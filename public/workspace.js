/* Presentation interactions only. No requests, polling or transaction handlers. */
'use strict';
(() => {
  const menus = [...document.querySelectorAll('.account-menu, .action-menu')];
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => { if (other !== menu) other.open = false; });
  }));
  document.addEventListener('click', event => {
    menus.forEach(menu => { if (!menu.contains(event.target)) menu.open = false; });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const focused = menus.find(menu => menu.open && menu.contains(document.activeElement));
    menus.forEach(menu => { menu.open = false; });
    focused?.querySelector('summary')?.focus();
    const sidebar = document.getElementById('appSidebar');
    if (sidebar?.classList.contains('is-open')) {
      document.getElementById('mobileMenuToggle')?.click();
      document.getElementById('mobileMenuToggle')?.focus();
    }
  });
  // Keep the active navigation item in view on shorter shop displays.
  const activeLink = document.querySelector('.sidebar nav a[aria-current="page"]');
  const navigation = activeLink?.closest('nav');
  if (navigation && activeLink) {
    const linkBox = activeLink.getBoundingClientRect();
    const navBox = navigation.getBoundingClientRect();
    if (linkBox.bottom > navBox.bottom) navigation.scrollTop += linkBox.bottom - navBox.bottom + 12;
  }

})();
