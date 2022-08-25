import psl from 'psl'

// LinkMapping manages lookup and local caching of link data
export class LinkMapping {
    private excludedHosts: Set<string>

    constructor(excludedDomains: Set<string>) {
        this.excludedHosts = excludedDomains
        this.setupTimers()
        this.setupStorageDebugging()
    }

    // Fetch associated links for a given URL, and executes the callback function
    // on successful result.
    //
    // Callback will not fire if URL's domain has already been checked (and deemed
    // not to have any indexed links). 
    // 
    // Callback will be invoked with empty [] results, or with cached results.
    async getLinks(url: string, callback: ((links: string[]) => void)) {
        const lookupURL = "https://everypost.in/api/links?" + new URLSearchParams({ url: url })
        const hostname = new URL(url)?.hostname
        const domain = psl.get(hostname)

        if (domain == null || this.excludedHosts.has(hostname)) {
            console.debug("hostname marked as excluded: " + hostname)
            return
        }

        const domainCache = await this.getDomainCache()

        if (domainCache[domain] != false) {
            // Domain is valid, or has not been checked yet..
            fetch(lookupURL, { mode: "no-cors" })
                .then(response => {
                    response.json().then(body => {
                        // Domain has not been checked yet..
                        console.log("Value of response:" + JSON.stringify(body))

                        // Update domain cache
                        domainCache[domain] = (body.domain == true)
                        this.setDomainCache(domainCache)

                        // Handle link results
                        const links: string[] = (response.status == 200) ? body.links : []
                        chrome.storage.local.set({ links: links }).then(() => { callback(links) })
                    })
                })
        }
    }

    private async getDomainCache(): Promise<{ [key: string]: boolean }> {
        return chrome.storage.local
            .get({ domain_cache: {} })
            .then(data => {
                console.log("EveryPost: Cache value: " + JSON.stringify(data.domain_cache))
                return data.domain_cache
            })
    }

    private setDomainCache(newValue: { [key: string]: boolean }) {
        chrome.storage.local.set({ domain_cache: newValue })
    }

    // periodic tasks related to link data / domain checks
    private setupTimers() {
        chrome.alarms.create("clear_cache", { periodInMinutes: 360 })

        chrome.alarms.onAlarm.addListener(alarm => {
            if (alarm.name == "clear_cache") {
                chrome.storage.local.set({ domain_cache: {} })
            }
        })
    }

    // configures a listener to log changes to local storage
    private setupStorageDebugging() {
        chrome.storage.onChanged.addListener((changes) => {
            for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
                const orig = JSON.stringify(oldValue)
                const updated = JSON.stringify(newValue)
                console.log(`Storage key "${key}" changed. Old: "${orig}" New: "${updated}"`)
            }
        })
    }
}