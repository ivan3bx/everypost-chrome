import { LinkRepository } from "./link_repository"
import { BookmarkRepository } from "./bookmark_repository"
import { parseMetadata } from "./page_processing"

const linksRepo = new LinkRepository({
    excludedDomains: [
        // domains to never check
        "localhost", "127.0.0.1", "mail.google.com"
    ]
})
const bookmarks = new BookmarkRepository()

function updateWithTab(tab?: chrome.tabs.Tab) {
    const isChrome = tab?.url?.startsWith("chrome://") || tab?.pendingUrl?.startsWith("chrome://") || tab?.url?.startsWith("https://chrome.google.com")
    const tabId = tab?.id

    if (tabId == null || isChrome) {
        console.debug("tab has no content")
        setBadgeText(0, tabId)
        chrome.storage.local.set({ pageData: { url: "" }, links: [] })
        return
    }

    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            func: parseMetadata,
        },
        (results) => {
            if (results?.length > 0) {
                const data = results[0].result
                chrome.storage.local.set({ pageData: data })

                linksRepo.getLinks(data.url, (rsp) => {
                    setActionIcon(rsp.bookmark != null)
                    setBadgeText(rsp.links.length, tabId)
                    chrome.storage.local.set({ linkRsp: rsp })
                })
            } else {
                chrome.storage.local.set({ pageData: { url: "" }, linkRsp: { links: [] } })
            }
        }
    )
}

// Message dispatch
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.action) {
        case "check_access":
            updateStatus()
            callback({ success: true })
            break
        case "save":
            bookmarks.save(message.bookmark).then(() => {
                linksRepo.deleteFromCache(message.bookmark.url)
                callback({ success: true })
            })
            break
        case "logout":
            setLoginStatus(false)
            break
        default:
            console.warn("message listener: unrecognized action", message.action)
            break
    }
})

// Handle cases where sites push state via XHR (youtube, etc..)
chrome.webNavigation.onHistoryStateUpdated.addListener((message) => {
    console.debug("history state update")
    chrome.tabs.get(message.tabId, (tab) => {
        updateWithTab(tab)
    })
})

// Handle window activation events
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId == chrome.windows.WINDOW_ID_NONE) {
        // all windows lost focus
        return
    } else {
        chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
            updateWithTab(tabs[0])
        })
    }
})

// Handle tab activation events
chrome.tabs.onActivated.addListener((info) => {
    console.debug("tab activated:", info.tabId)
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        updateWithTab(tabs[0])
    })
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    // check 'status' to filter unrealted updates (eg. iframes, as seen on youtube)
    if (changeInfo.status == "complete") {
        console.debug("tab updated")
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
            updateWithTab(tabs[0])
        })
    }
})

// Triggering access check on window creation is better than 'onStartup' given
// that Chrome may exist in the background, meaning 'onStartup' never invoked.
//
// Creating a window happens both on startup as well as when user activates
// background app.
chrome.windows.onCreated.addListener(() => {
    chrome.windows.getAll((windows) => {
        // TODO: enable in prod
        if (windows.length == 1) {
            updateStatus()
        }
    })
})

function setLoginStatus(logged_in: boolean, token?: string) {

    if (logged_in) {
        chrome.action.setPopup({ popup: "logged_in.html" })
        chrome.storage.local.set({ logged_in: true, auth_token: token })
    } else {
        chrome.action.setPopup({ popup: "logged_out.html" })
        chrome.storage.local.set({ logged_in: false, auth_token: "" })
    }
}

function updateStatus() {
    console.debug("updateStatus()")
    fetch("https://everypost.in/users/access_check")
        .then(async (response) => {
            if (response.status == 200) {
                const token = await response.json().then(data => { return data.auth_token })
                setLoginStatus(true, token)
            } else {
                setLoginStatus(false)
            }
        })
        .catch(() => {
            setLoginStatus(false)
            console.warn("updateStatus() - access check error")
        })
}


// Highlight a counter as badge text
 
function setBadgeText(count: number, tabId?: number) {
    const tag = count > 8 ? "9+" : `${count}`
    chrome.action.setBadgeText({ text: count > 0 ? tag : "", tabId: tabId })
    chrome.action.setBadgeBackgroundColor({ color: "#e62e00" })
}

function setActionIcon(active: boolean) {
    if (active) {
        chrome.action.setIcon({
            path: {
                "32": "logo_active_32.png",
                "128": "logo_active_128.png"
            }
        })
    } else {
        chrome.action.setIcon({
            path: {
                "32": "logo_32.png",
                "128": "logo_128.png"
            }
        })
    }
}

// initialization
updateStatus()
