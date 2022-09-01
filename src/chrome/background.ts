// import psl from 'psl'
import { LinkMapping } from "./link_mapping"

const linkMap = new LinkMapping(
    // excluded hostnames
    new Set(["localhost", "127.0.0.1", "mail.google.com"])
)

function updateWithTab(tab?: chrome.tabs.Tab) {
    if (tab == null) {
        console.warn("updateTab() : null tab")
        return
    }
    const tabId = tab.id

    if (tabId) {
        chrome.tabs.sendMessage(tabId, "check_page", (data) => {
            if (!data) {
                // content script did not send data; fallback to URL only
                const pageURL = tab.url?.startsWith("chrome://") ? "" : tab.url
                chrome.storage.local.set({ pageData: { url: pageURL }, links: [] })
                return
            }

            linkMap.getLinks(data.url, (links) => {
                setBadgeText(links.length, tabId)
                chrome.storage.local.set({ links: links, pageData: data })
            })
        })
    } else {
        setBadgeText(0, tabId)
        chrome.storage.local.set({ pageData: {}, links: [] })
    }
}

// Message dispatch
chrome.runtime.onMessage.addListener((message, sender, callback) => {
    switch (message.action) {
        case "check_access":
            updateStatus()
            callback({ success: true })
            break
        case "save":
            saveBookmark(message.bookmark).then(() => {
                callback({ success: true })
            })
            break
        case "logout":
            setLoginStatus(false)
            break
        case "check_url":
            updateWithTab(sender.tab)
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
        // all windows lost focus ; no-op
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

// Triggering access check on window creation is better than 'onStartup' given that Chrome
// may exist in the background, meaning 'onStartup' never invoked.
// Creating a window happens both on startup as well as when user activates background app.
chrome.windows.onCreated.addListener(() => {
    chrome.windows.getAll((windows) => {
        // TODO: enable in prod
        if (windows.length == 1) {
            updateStatus()
        }
    })
})

function setLoginStatus(logged_in: boolean) {
    chrome.storage.local.set({ logged_in: logged_in })

    if (logged_in) {
        chrome.action.setPopup({ popup: "logged_in.html" })
    } else {
        chrome.action.setPopup({ popup: "logged_out.html" })
    }
}

function updateStatus() {
    console.debug("updateStatus()")
    fetch("https://everypost.in/users/access_check")
        .then((response) => {
            if (response.status == 200) {
                response.json().then((value) => {
                    chrome.storage.local.set({ auth_token: value.auth_token })
                })
            }
            setLoginStatus(response.status == 200)
        })
        .catch(() => {
            setLoginStatus(false)
            console.warn("updateStatus() - access check error")
        })
}

async function saveBookmark(data: object) {
    const token = await chrome.storage.local.get({ auth_token: "" }).then((data) => {
        return data.auth_token
    })

    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    }

    const reqData = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
    }

    fetch("https://everypost.in/api/bookmarks", reqData)
        .then((response) => {
            console.log("saveBookmark(): response", response.status)
        })
        .catch((reason) => {
            console.warn("saveBookmark(): error ", reason)
        })
}

// Highlight a counter as badge text
// eslint-disable-next-line
function setBadgeText(count: number, tabId?: number) {
    const tag = count > 8 ? "9+" : `${count}`
    chrome.action.setBadgeText({ text: count > 0 ? tag : "", tabId: tabId })
    chrome.action.setBadgeBackgroundColor({ color: "#e62e00" })
}

// initialization
updateStatus()
