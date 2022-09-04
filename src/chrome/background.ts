// import psl from 'psl'
import { LinkRepository } from "./link_repository"
import { parseMetadata } from "./page_processing"

const linkMap = new LinkRepository(
    // excluded hostnames
    new Set(["localhost", "127.0.0.1", "mail.google.com"])
)

type BookmarkModel = {
    url: string
    title: string
    description: string
    tags: string[]
}

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

                linkMap.getLinks(data.url, (rsp) => {
                    setActionIcon(rsp.bookmark != null)
                    setBadgeText(rsp.links.length, tabId)
                    chrome.storage.local.set({ linkRsp: rsp })
                })
            } else {
                chrome.storage.local.set({ pageData: { url: "" }, links: [] })
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
            saveBookmark(message.bookmark).then(() => {
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

async function saveBookmark(data: BookmarkModel) {
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
            // invalidate cache
            linkMap.deleteFromCache(data.url)
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

function setActionIcon(active: boolean) {
    if (active) {
        chrome.action.setIcon({
            path: {
                "32": "./logo_active_32.png",
                "128": "./logo_active_128.png"
            }
        })
    } else {
        chrome.action.setIcon({
            path: {
                "32": "./logo_32.png",
                "128": "./logo_128.png"
            }
        })
    }
}

// initialization
updateStatus()
