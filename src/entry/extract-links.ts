console.log("extracting links...");


let currentHighlight: Element

window.addEventListener('mouseover', function (e) {
    let path = Array<Element>()

    // is this part of a div that contains some content?
    if (e.target instanceof Element) {
        path = calculatePath(this.document, e.target)
    }

    if (path.length > 0 && path[0] instanceof Element) {
        currentHighlight = path[0]
        path[0].classList.add('highlighted');
    }
});

window.addEventListener('mouseout', function (e) {
    if (e.target instanceof Element) {
        const path = calculatePath(this.document, e.target)
        if (path[0] == currentHighlight) {
            console.log("Removing")
            currentHighlight.classList.remove("highlighted")
        } else {
            console.log("Not removing")
        }
    }
});

function calculatePath(document: Document, el?: Element): Array<Element> {
    const path = [el as Element]

    while (el != null) {
        if (el.tagName == "DIV" && el.textContent != null && el.textContent.length > 0) {
            console.log(`Breaking: ${path.map((element) => `[${element.tagName}] > `)}`)
            break
        } else if (el.parentElement && el.parentElement != document.documentElement) {
            path.unshift(el.parentElement)
            console.log(`Appended: ${path.map((element) => `[${element.tagName}] > `)}`)
        } else {
            console.log(`Else..: ${path.map((element) => `[${element.tagName}] > `)}`)
            break
        }

        el = el.parentElement
    }

    return path
}