// import psl from 'psl'
import { LinkMapping } from './link_mapping'

const linkMap = new LinkMapping(
    // excluded hostnames
    new Set(["localhost", "127.0.0.1", "mail.google.com"])
)

// Message dispatch
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.action) {
        case "check_access":
            console.debug("onMessage: checking sign-in state")
            updateStatus()
            callback({ success: true })
            break;
        case "check_url":
            console.debug("onMessage: checking URL")
            linkMap.getLinks(message.url, (links) => {
                setBadgeText(links.length)
            })
            break
        default:
            console.debug("onMessage: unrecognized action", message.action)
            break;
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

function updateStatus() {
    console.log("updating status..")
    fetch("https://everypost.in/users/access_check")
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

// Highlight a counter as badge text
// eslint-disable-next-line
function setBadgeText(count: number) {
    const tag = (count > 8) ? "9+" : `${count}`
    chrome.action.setBadgeText({ text: (count > 0) ? tag : "" })
    chrome.action.setBadgeBackgroundColor({ color: '#e62e00' });
}


console.log('hello world background todo something~')
