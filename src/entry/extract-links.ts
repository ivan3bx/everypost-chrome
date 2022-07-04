console.log("extracting links...");

class LinkSelector {
    docElement: Document
    selectedTarget: Element | null

    constructor(document: Document) {
        this.docElement = document
        this.selectedTarget = null
    }

    get target(): Element | null {
        return this.selectedTarget
    }

    set target(t: Element | null) {
        if (t == null && this.selectedTarget) {
            this.selectedTarget.classList.remove("everypost-highlight")
            this.selectedTarget = null
        } else if (t instanceof Element) {
            this.selectedTarget = t
            t.classList.add('everypost-highlight');
        }
    }

    handleMouseOver = (ev: MouseEvent) => {
        let path = Array<Element>()

        if (ev.target instanceof Element) {
            path = this.#calculatePath(ev.target)
            this.target = path[0]
        }
    }

    handleMouseOut = (ev: MouseEvent) => {
        if (!(ev.target instanceof Element)) {
            return
        }

        this.target = null
    }

    handleMouseDown = (ev: MouseEvent) => {
        ev.preventDefault()
        ev.stopPropagation()

        if (this.selectedTarget == null) {
            return
        }

        console.log("Links to be read from: " + this.#xpath(this.selectedTarget))

        const elements: NodeListOf<HTMLAnchorElement> = this.selectedTarget.querySelectorAll('a:link:not([href^=javascript])');
        const links = new Array(elements.length);
        for (let i = 0; i < elements.length; i++) {
            links[i] = {
                href: elements[i].href,
                hash: elements[i].hash,
                host: elements[i].host,
                hostname: elements[i].hostname,
                origin: elements[i].origin,
                pathname: elements[i].pathname,
                search: elements[i].search,
                text: elements[i].text,
            };
        }
        chrome.runtime.sendMessage({ links: links })
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
