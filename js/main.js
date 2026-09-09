/* Aktuální rok v patičce; v HTML zůstává statická hodnota jako fallback bez JS. */
(function () {
  var rok = document.querySelector('[data-rok]');
  if (rok) rok.textContent = new Date().getFullYear();
})();

/* Mobilní menu – jediné chování, které stránka potřebuje v JS. */
(function () {
  var nav = document.querySelector('[data-nav]');
  if (!nav) return;

  var toggle = nav.querySelector('.nav__toggle');
  var list = nav.querySelector('.nav__list');

  function setOpen(open) {
    nav.dataset.open = open ? 'true' : 'false';
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggle.addEventListener('click', function () {
    setOpen(nav.dataset.open !== 'true');
  });

  list.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.dataset.open === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });

  // Po přechodu na širší displej menu zavřeme, ať nezůstane zamčené scrollování.
  window.matchMedia('(min-width: 901px)').addEventListener('change', function (e) {
    if (e.matches) setOpen(false);
  });
})();
