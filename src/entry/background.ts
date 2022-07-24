import psl from 'psl'

const EXCLUDED_DOMAINS = new Set(["localhost", "127.0.0.1", "mail.google.com"])

console.log('hello world background todo something~')

// Debugging..
chrome.storage.onChanged.addListener((changes) => {
    for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
        console.log(`Storage key "${key}" changed. Old: "${JSON.stringify(oldValue)}" New: "${JSON.stringify(newValue)}"`)
    }
})


// Message dispatch
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.action) {
        case "check_access":
            updateStatus()
            callback({ success: true })
            break;
        case "check_url":
            console.log("EveryPost: onMessage received")
            checkURL(message.url)
            break
        default:
            console.log("EveryPost: unrecognized action: ", message.action)
            break;
    }
})

// Periodic tasks
chrome.alarms.create("clear_cache", { periodInMinutes: 360 })
chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name == "clear_cache") {
        chrome.storage.local.set({ domain_cache: {} })
    }
})

// Triggering access check on window creation is better than 'onStartup' given that Chrome
// may exist in the background, meaning 'onStartup' never invoked.
// Creating a window happens both on startup as well as when user activates background app.
chrome.windows.onCreated.addListener(() => {
    chrome.windows.getAll(windows => {
        // TODO: enable in prod
        if (windows.length == 1) {
            updateStatus()
        }
    })
})

async function checkURL(url: string) {
    const hostname = new URL(url)?.hostname
    const domain = psl.get(hostname)

    if (domain == null || EXCLUDED_DOMAINS.has(domain)) {
        console.log("skipping domain: " + domain)
        return
    }

    await chrome.storage.local.get({ domain_cache: {} })
        .then(data => {
            console.log("EveryPost: Cache value: " + JSON.stringify(data.domain_cache))

            if (data.domain_cache[domain] == false) {
                // Domain is not valid ; do not check with server
                console.log("EveryPost: cache domain is false")
                return
            }

            // Domain is valid, or has not been checked yet..
            fetch("https://api.everypost.in/links?" + new URLSearchParams({ url: url }))
                .then(response => {
                    response.json().then(body => {
                        if (body[domain] == null) {
                            // Domain has not been checked yet..
                            console.log("Value of response:" + JSON.stringify(body))
                            console.log("Value of item.." + body.domain)
                            data.domain_cache[domain] = (body.domain == true)
                            chrome.storage.local.set({ domain_cache: data.domain_cache })
                        }

                        if (response.status == 200) {
                            console.log("EveryPost: -> Checked server, results " + response.status)
                        } else {
                            console.log("EveryPost: -> Checked server, results " + response.status)
                        }
                    })
                })
        })
}

function updateStatus() {
    console.log("updating status..")
    fetch("https://everypost.in/api/access_check")
        .then(response => {
            if (response.status == 200) {
                console.log("EveryPost - logged in")
                chrome.storage.local.set({ logged_in: true })
            } else {
                console.log("EveryPost - logged out")
                chrome.storage.local.set({ logged_in: false })
            }
        })
        .catch(() => {
            // user is logged out
            chrome.storage.local.set({ logged_in: false })
            console.log("EveryPost - access check error")
        })
}
