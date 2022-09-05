import psl from "psl"
import LRU from "lru-cache"

export type LinksResponse = {
    links: string[]
    bookmark?: {
        uid: string
        createdAt: string
    }
}

type LinkOptions = {
    excludedDomains?: string[]
}

// LinkRepository manages querying and local caching of links
export class LinkRepository {
    private excludedHosts: Set<string>
    private linkCache: LRU<string, LinksResponse>
    private domainCache: LRU<string, boolean>

    constructor(options?: LinkOptions) {
        this.excludedHosts = new Set()

        if (options?.excludedDomains) {
            options.excludedDomains.forEach(item => this.excludedHosts.add(item))
        }

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
        const authToken = await chrome.storage.local.get({ auth_token: "" }).then((data) => {
            return data.auth_token
        })

        if (this.linkCache.has(url)) {
            console.log("cached result:", this.linkCache.get(url))
            callback(this.linkCache.get(url) || { links: [] })
            return
        }

        if (domain == null || this.excludedHosts.has(hostname)) {
            callback({ links: [] })
            return
        }

        if (this.domainCache.get(domain) == false) {
            callback({ links: [] })
            return
        }

        const headers = new Headers()
        if (authToken?.length > 0) {
            headers.set("Authorization", `Bearer ${authToken}`)
        }

        // Domain valid, or has not been accessed yet
        fetch(lookupURL, { headers: headers }).then((response) => {
            response.json().then((body) => {
                // Update domain cache
                this.domainCache.set(domain, body.domain == true)

                // Handle link results
                const rsp: LinksResponse = response.status == 200 ? body : { links: [] }
                this.linkCache.set(url, rsp)
                callback(rsp)
            })
        })
    }

    // Deletes the given URL from the link cache.
    deleteFromCache(url: string) {
        const hostname = new URL(url)?.hostname
        const domain = psl.get(hostname)
        this.linkCache.delete(url)

        if (domain) {
            this.domainCache.delete(domain)
        }
    }
}
