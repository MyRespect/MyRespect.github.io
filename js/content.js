/* jshint asi:true */
/////////////////////////content////////////////////////////
// This .js file is not used in this project currently 

generateContent()

/**
 * [generateContent description]
 */
function generateContent() {
    var contentToc = document.querySelector('#markdown-toc')


    if (contentToc === null) {
        document.querySelector('#content').style.display = 'none'
    } else {
        //using the library scroll.js for smooth scrolling;
        //add 'class=scroll' for each <a></a>
        var aTags = contentToc.querySelectorAll('a')
        for (var i = 0; i < aTags.length; i++) {
            aTags[i].setAttribute('class', 'scroll')
        }
        var contentHtml = contentToc.innerHTML
        var sideContentUl = document.querySelector('#content-side')
        sideContentUl.innerHTML = contentHtml
    }

    //finding the related papers;
    var relatedPost = document.querySelector('.related-post');
    if (relatedPost.innerHTML.trim() === '') {
        relatedPost.style.display = 'none'
    }
}

fixSidebar()

/**
 * [fixSidebar description]
 * When the scroll wheel rolls to a certain position, make 'sidebar-wrap' to 'fixed'
 */
function fixSidebar() {
    var sidebarWrap = document.querySelector('.sidebar-wrap')
    window.onscroll = function() {
        var sidebarWrapTop = sidebarWrap.getBoundingClientRect().top
        if (sidebarWrapTop < 21) {
            sidebarWrap.classList.add('fixed')
        }
        var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop)
        if (scrollTop < 78) {
            sidebarWrap.classList.remove('fixed')
        }
    }
}

controlHeight()

/**
 * [controlHeight description]
 * Control the height of sidebar
 */
function controlHeight() {
    var similarDiv = document.querySelector('.related-post')
    var contentUl = document.querySelector('.content-ul')
    var similarDivHeight = similarDiv.offsetHeight
    var windowHeight = window.innerHeight
    var contentMaxHeight = windowHeight - similarDivHeight - 77 - 60

    contentUl.style.maxHeight = contentMaxHeight + 'px'
}
