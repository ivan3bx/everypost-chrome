console.log("extracting links...");

class LinkSelector {
    docElement: Document
    selectedTarget: Element | null

    constructor(document: Document) {
        this.docElement = document
        this.selectedTarget = null
    }

    handleMouseOver = (ev: MouseEvent) => {
        let path = Array<Element>()

        if (ev.target instanceof Element) {
            path = this.#calculatePath(ev.target)
            this.selectedTarget = path[0]
        }

        if (this.selectedTarget instanceof Element) {
            this.selectedTarget.classList.add('everypost-highlight');
        }

    }

    handleMouseOut = (ev: MouseEvent) => {
        if (!(ev.target instanceof Element)) {
            return
        }

        if (this.selectedTarget) {
            this.selectedTarget.classList.remove("everypost-highlight")
        }
    }

    handleMouseDown = (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()

        if (this.selectedTarget == null) {
            return
        }

        console.log("Links to be read from: " + this.#xpath(this.selectedTarget))
    }

    handleClick = (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()
    }

    #calculatePath = (el?: Element): Array<Element> => {
        const path = [el as Element]

        while (el != null) {
            if (el.tagName == "DIV" && el.textContent != null && el.textContent.length > 0) {
                break
            } else if (el.parentElement && el.parentElement != this.docElement.documentElement) {
                path.unshift(el.parentElement)
            } else {
                break
            }

            el = el.parentElement
        }

        return path
    }

    #xpath = (el: Element | null): string => {
        if (typeof el == "string") return this.docElement.evaluate(el, this.docElement, null, 0, null).stringValue
        if (!el || el.nodeType != 1) return ''
        if (el.id) return "//" + el.tagName.toLowerCase() + "[@id='" + el.id + "']"

        if (el.parentNode) {
            const sames = [].filter.call(el.parentNode.children, function (x: Element) { return x.tagName == el.tagName })
            return this.#xpath(el.parentElement) + '/' + el.tagName.toLowerCase() + (sames.length > 1 ? '[' + (Array<Element>().indexOf.call(sames, el) + 1) + ']' : '')
        } else {
            return ''
        }
    }
}

const linkSelector = new LinkSelector(window.document)

window.addEventListener('mouseover', linkSelector.handleMouseOver)
window.addEventListener('mouseout', linkSelector.handleMouseOut)
window.addEventListener('mousedown', linkSelector.handleMouseDown)
window.addEventListener("click", linkSelector.handleClick)
