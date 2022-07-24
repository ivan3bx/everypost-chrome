const url = document.querySelector("link[rel='canonical']")?.getAttribute("href")

if (url) {
    console.log("EveryPost: Using canonical URL")
    chrome.runtime.sendMessage({ action: "check_url", url: url })
} else {
    console.log("EveryPost: Using browser URL")
    chrome.runtime.sendMessage({ action: "check_url", url: window.location.href })
}