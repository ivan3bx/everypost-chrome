import psl from "psl"
import LRU from "lru-cache"

export type LinksResponse = {
    links: string[]
    bookmark?: {
        externalID: string
        createdAt: string
    }
}

// LinkMapping manages lookup and local caching of link data
export class LinkMapping {
    private excludedHosts: Set<string>
    private linkCache: LRU<string, LinksResponse>
    private domainCache: LRU<string, boolean>

    constructor(excludedDomains: Set<string>) {
        this.excludedHosts = excludedDomains
        this.installDebugHooks()

        this.domainCache = new LRU({
            max: 100, // 100 domains
            ttl: 1000 * 60 * 4, // 8 hour TTL
        })
        this.linkCache = new LRU({
            max: 50, // 50 entries
            ttl: 1000 * 60 * 30, // 30 minute TTL
        })
    }


    // Fetch associated links for a given URL, and executes the callback function
    // on successful result.
    //
    // Callback will not fire if URL's domain has already been checked (and deemed
    // not to have any indexed links).
    //
    // Callback will be invoked with empty [] results, or with cached results.
    async getLinks(url: string, callback: (links: LinksResponse) => void) {
        const lookupURL = "https://everypost.in/api/links?" + new URLSearchParams({ url: url })
        const hostname = new URL(url)?.hostname
        const domain = psl.get(hostname)

        if (this.linkCache.has(url)) {
            console.debug("cached result for", this.linkCache.get(url))
            callback(this.linkCache.get(url) || {links: []})
            return
        }

        if (domain == null || this.excludedHosts.has(hostname)) {
            console.debug("hostname excluded: " + hostname)
            callback({links: []})
            return
        }

        if (this.domainCache.get(domain) == false) {
            console.debug("domain marked as not present")
            callback({links: []})
            return
        }

        // Domain valid, or has not been accessed yet
        fetch(lookupURL, { mode: "no-cors" }).then((response) => {
            response.json().then((body) => {
                console.debug("API response")
                // Update domain cache
                this.domainCache.set(domain, body.domain == true)

                // Handle link results
                const rsp: LinksResponse = response.status == 200 ? body : {links: []}
                this.linkCache.set(url, rsp)
                callback(rsp)
            })
        })
    }

    // configures a listener to log changes to local storage
    private installDebugHooks() {
        // chrome.storage.onChanged.addListener((changes) => {
        //     for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        //         const orig = JSON.stringify(oldValue)
        //         const updated = JSON.stringify(newValue)
        //         console.log(`Storage key "${key}" changed. Old: "${orig}" New: "${updated}"`)
        //     }
        // })
    }
}
