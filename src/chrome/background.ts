// import psl from 'psl'
import { LinkMapping } from './link_mapping'

const linkMap = new LinkMapping(
    // excluded hostnames
    new Set(["localhost", "127.0.0.1", "mail.google.com"])
)

function updateWithTab(tab?: chrome.tabs.Tab) {
    if (tab == null) {
        console.warn("update passed a null tab instance ; ignoring")
        return
    }
    const url = tab.url
    const tabId = tab.id

    if (url && url.length > 0) {
        console.log("onFocusChanged: getting links and setting text for url:", url);
        linkMap.getLinks(url, (links) => { setBadgeText(links.length, tabId) })
    } else {
        console.log("onFocusChanged: setting badge text to zero");
        setBadgeText(0, tabId)
    }

}

// Message dispatch
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.action) {
        case "check_access":
            console.debug("onMessage: checking sign-in state")
            updateStatus()
            callback({ success: true })
            break;
        case "logout":
            setLoginStatus(false)
            break
        case "check_url":
            console.debug("onMessage: checking URL")
            updateWithTab(sender.tab)
            break
        default:
            console.debug("onMessage: unrecognized action", message.action)
            break;
    }
})

// Handle cases where sites push state via XHR (youtube, etc..)
chrome.webNavigation.onHistoryStateUpdated.addListener((message) => {
    console.debug("webNavigation history state updated")
    chrome.tabs.get(message.tabId, (tab) => { updateWithTab(tab) })
})

// Handle window activation events
chrome.windows.onFocusChanged.addListener(windowId => {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        // all windows lost focus ; no-op
    } else {
        chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
            updateWithTab(tabs[0])
        })
    }
})

// Handle tab activation events
chrome.tabs.onActivated.addListener((info) => {
    console.debug("Tab activated..")
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        updateWithTab(tabs[0])
        console.log("Tab activated: id:", info.tabId, "windowID:", info.windowId, "URL:", tabs[0].url)
    })
});


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

function setLoginStatus(logged_in: boolean) {
    chrome.storage.local.set({ logged_in: logged_in })

    if (logged_in) {
        console.log("EveryPost - logged in")
        chrome.action.setPopup({ popup: "logged_in.html" })
    } else {
        console.log("EveryPost - logged out")
        chrome.action.setPopup({ popup: "logged_out.html" })
    }
}

function updateStatus() {
    console.log("updating status..")
    fetch("https://everypost.in/users/access_check")
        .then(response => {
            setLoginStatus(response.status == 200)
        })
        .catch(() => {
            setLoginStatus(false)
            console.log("EveryPost - access check error")
        })
}

// Highlight a counter as badge text
// eslint-disable-next-line
function setBadgeText(count: number, tabId?: number) {
    const tag = (count > 8) ? "9+" : `${count}`
    chrome.action.setBadgeText({ text: (count > 0) ? tag : "", tabId: tabId })
    chrome.action.setBadgeBackgroundColor({ color: '#e62e00' });
}


console.log('EveryPost says hi!')

updateStatus()