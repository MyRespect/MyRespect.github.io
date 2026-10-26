(function () {
    'use strict';

    var menuButton = document.querySelector('#headerMenu');
    var nav = document.querySelector('#headerNav');
    if (!menuButton || !nav) return;

    function setOpen(open) {
        menuButton.classList.toggle('active', open);
        nav.classList.toggle('nav-show', open);
        menuButton.setAttribute('aria-expanded', String(open));
    }

    // Bind once at every viewport width; CSS controls when the button is visible.
    menuButton.addEventListener('click', function (event) {
        event.stopPropagation();
        setOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', function (event) {
        if (!nav.contains(event.target) || event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            menuButton.focus();
        }
    });

    window.matchMedia('(max-width: 770px)').addEventListener('change', function () {
        setOpen(false);
    });
}());

(function () {
    'use strict';

    var backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;

    function updateBackToTop() {
        backToTop.classList.toggle('back-to-top-show', window.scrollY > 200);
    }

    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
}());

(function () {
    'use strict';

    // Suppress the context menu on the portrait so "Save image as" is not one
    // click away. The file is still listed in the page source and served at a
    // public URL, so this deters casual copying rather than preventing it.
    // Scoped to the portrait: blocking right-click page-wide would break
    // copying text and opening links in new tabs.
    var portraits = document.querySelectorAll('.sidebar-portrait img');
    if (!portraits.length) return;

    Array.prototype.forEach.call(portraits, function (portrait) {
        portrait.addEventListener('contextmenu', function (event) {
            event.preventDefault();
        });
    });
}());
