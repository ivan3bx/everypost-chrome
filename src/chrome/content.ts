chrome.runtime.onMessage.addListener((msg, sender, callback) => {
    if (sender.id == chrome.runtime.id && msg == "check_page") {
        const descQuery = "meta[name='twitter:description'],[property='og:description'],[name='description']"
        const urlQuery = "link[rel='canonical']"
        const iconQuery = "link[rel*='icon']"
        const titleQuery = "meta[name='twitter:title'],[property='og:title']"

        const canonicalURL = document.querySelector(urlQuery)?.getAttribute("href")
        const favIcon = document.querySelector(iconQuery)?.getAttribute("href")
        const title = document.querySelector(titleQuery)?.getAttribute("content")
        const desc = document.querySelector(descQuery)?.getAttribute("content")

        callback({
            url: canonicalURL || window.location.href,
            iconURL: new URL(favIcon || "/favicon.ico", window.location.origin).href,
            title: title || document.querySelector("title")?.text || document.querySelector("title")?.text,
            description: desc || "",
        })
    }
})
