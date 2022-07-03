console.log("extracting links...");

window.addEventListener('mouseover',function(e) {

    // is this part of a div that contains some content?
    if (e.target instanceof Element) {
        var el = e.target

        while (el.tagName != "DIV") {
            let parent = el.parentElement
            if (parent instanceof Element) {
                el = parent
            } 
            
        }
    }

    if (e.target instanceof Element && e.target.tagName == "DIV") {
        e.target.classList.add('highlighted');
    }
});

window.addEventListener('mouseout',function(e) {
    if (e.target instanceof Element) {
        e.target.classList.remove('highlighted');
    }
});
