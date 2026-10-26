(function () {
    'use strict';

    var sidebar = document.querySelector('.page > .right');
    var anchorButton = document.querySelector('.page > .anchor');
    if (!sidebar || !anchorButton) return;

    var sidebarWrap = sidebar.querySelector('.wrap');
    var contentList = sidebar.querySelector('.content-ul');
    if (!sidebarWrap || !contentList) return;

    var mobile = window.matchMedia('(max-width: 770px)');
    var footer = document.querySelector('.site-footer');
    var toc = document.querySelector('#markdown-toc');

    // Preserve explicitly rendered direction/category links when a page also has a TOC.
    if (toc && !contentList.querySelector('a')) {
        contentList.innerHTML = toc.innerHTML;
        contentList.querySelectorAll('a').forEach(function (link) {
            link.classList.add('scroll');
        });
    }

    function setOpen(open) {
        sidebar.classList.toggle('right-show', open);
        anchorButton.classList.toggle('anchor-hide', open);
        anchorButton.setAttribute('aria-expanded', String(open));
    }

    function updatePosition() {
        var top = mobile.matches && window.scrollY <= 50 ? 76 : 20;
        // Reserve room for the portrait, heading, and margins before limiting the list.
        var sidebarChrome = sidebarWrap.offsetHeight - contentList.offsetHeight;
        contentList.style.maxHeight = Math.max(0, window.innerHeight - top - 20 - sidebarChrome) + 'px';

        if (mobile.matches) {
            anchorButton.style.top = top + 'px';
            sidebar.style.top = top + 'px';
            return;
        }

        var fixed = window.scrollY >= 53;
        sidebarWrap.classList.toggle('fixed', fixed);
        if (fixed && footer) {
            top = Math.min(top, footer.getBoundingClientRect().top - sidebarWrap.offsetHeight - 20);
        }
        sidebarWrap.style.top = fixed ? top + 'px' : '';
    }

    function updateLayout() {
        setOpen(false);
        sidebarWrap.classList.remove('fixed', 'scroll-bottom');
        sidebarWrap.style.width = '';
        sidebarWrap.style.top = '';
        sidebar.style.top = '';
        anchorButton.style.top = '';

        if (!mobile.matches) {
            var style = window.getComputedStyle(sidebar);
            var width = sidebar.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
            sidebarWrap.style.width = width + 'px';
        }
        updatePosition();
    }

    anchorButton.addEventListener('click', function (event) {
        if (!mobile.matches) return;
        event.stopPropagation();
        setOpen(anchorButton.getAttribute('aria-expanded') !== 'true');
    });

    document.addEventListener('click', function (event) {
        if (!sidebar.contains(event.target) || event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && anchorButton.getAttribute('aria-expanded') === 'true') {
            setOpen(false);
            anchorButton.focus();
        }
    });

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updateLayout);
    updateLayout();
}());
