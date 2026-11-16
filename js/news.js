// Turns the plain Markdown news list (tagged `{: .news}` in page/0main.md)
// into a filterable timeline. Each item keeps the "- [MM/DD/YYYY] text"
// format, so adding news is still a one-line Markdown edit. Without
// JavaScript the list renders as an ordinary bulleted list.
(function () {
    'use strict';

    var list = document.querySelector('ul.news');
    if (!list) return;

    var VISIBLE = 8;          // items shown before "Show all"
    var NEW_DAYS = 60;        // items newer than this get a "New" badge
    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // First match wins, so funding beats "accepted" and talks beat service.
    var TYPES = [
        { id: 'award', label: 'Awards', icon: 'trophy', test: /fund|award|grant|prize|fellowship/i },
        { id: 'paper', label: 'Papers', icon: 'file-text-o', test: /accepted|released|published/i },
        { id: 'talk', label: 'Talks', icon: 'microphone', test: /lecture|talk|keynote|seminar|defended/i },
        { id: 'service', label: 'Service', icon: 'users', test: /./ }
    ];

    var items = Array.prototype.slice.call(list.children);
    var now = Date.now();
    var counts = {};

    items.forEach(function (li) {
        // The date sits in the first text node, possibly inside a <p>.
        var host = li.firstElementChild && li.firstElementChild.tagName === 'P' ? li.firstElementChild : li;
        var node = host.firstChild;
        if (!node || node.nodeType !== 3) return;
        var m = node.nodeValue.match(/^\s*\[(\d{1,2})\/(\d{1,2})\/(\d{4})\]\s*/);
        if (!m) return;
        node.nodeValue = node.nodeValue.slice(m[0].length);

        var month = +m[1], day = +m[2], year = +m[3];
        var date = new Date(year, month - 1, day);

        var time = document.createElement('time');
        time.className = 'news-date';
        time.dateTime = year + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
        time.textContent = MONTHS[month - 1] + ' ' + day + ', ' + year;

        var type = TYPES.filter(function (t) { return t.test.test(li.textContent); })[0];
        li.classList.add('news-item', 'news-' + type.id);
        li.dataset.type = type.id;
        counts[type.id] = (counts[type.id] || 0) + 1;

        var body = document.createElement('div');
        body.className = 'news-body';
        while (host.firstChild) body.appendChild(host.firstChild);
        if (host !== li) li.removeChild(host);

        var meta = document.createElement('div');
        meta.className = 'news-meta';
        var icon = document.createElement('i');
        icon.className = 'news-icon fa fa-' + type.icon;
        icon.setAttribute('aria-hidden', 'true');
        meta.appendChild(icon);
        meta.appendChild(time);
        if ((now - date.getTime()) / 864e5 <= NEW_DAYS) {
            var badge = document.createElement('span');
            badge.className = 'news-new';
            badge.textContent = 'New';
            meta.appendChild(badge);
        }

        li.appendChild(meta);
        li.appendChild(body);
    });

    list.classList.add('news-timeline');

    // Filter chips
    var filters = document.createElement('div');
    filters.className = 'news-filters';
    filters.setAttribute('role', 'group');
    filters.setAttribute('aria-label', 'Filter news');
    var current = 'all';
    var expanded = false;

    function chip(id, label, count) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'news-chip' + (id === 'all' ? ' is-active' : '');
        b.dataset.filter = id;
        b.setAttribute('aria-pressed', String(id === 'all'));
        b.innerHTML = label + ' <span>' + count + '</span>';
        b.addEventListener('click', function () {
            current = id;
            filters.querySelectorAll('.news-chip').forEach(function (c) {
                var on = c === b;
                c.classList.toggle('is-active', on);
                c.setAttribute('aria-pressed', String(on));
            });
            render();
        });
        filters.appendChild(b);
    }
    chip('all', 'All', items.length);
    // Chips run from most to fewest items. Sort a copy: TYPES' own order
    // decides classification (first match wins) and must not change.
    TYPES.slice()
        .filter(function (t) { return counts[t.id]; })
        .sort(function (a, b) { return counts[b.id] - counts[a.id]; })
        .forEach(function (t) { chip(t.id, t.label, counts[t.id]); });
    list.parentNode.insertBefore(filters, list);

    // Collapse toggle
    var more = document.createElement('button');
    more.type = 'button';
    more.className = 'news-more';
    more.addEventListener('click', function () {
        expanded = !expanded;
        render();
        if (!expanded) list.scrollIntoView({ block: 'start', behavior: 'smooth' });
    });
    list.parentNode.insertBefore(more, list.nextSibling);

    function render() {
        var shown = 0;
        items.forEach(function (li) {
            var match = current === 'all' || li.dataset.type === current;
            var hide = !match || (current === 'all' && !expanded && shown >= VISIBLE);
            li.hidden = hide;
            if (match) shown++;
        });
        var collapsible = current === 'all' && items.length > VISIBLE;
        more.hidden = !collapsible;
        more.setAttribute('aria-expanded', String(expanded));
        more.innerHTML = expanded
            ? 'Show fewer <i class="fa fa-angle-up" aria-hidden="true"></i>'
            : 'Show all ' + items.length + ' updates <i class="fa fa-angle-down" aria-hidden="true"></i>';
    }
    render();
}());
