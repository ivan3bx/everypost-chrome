async function getCurrentTab() {
    const queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    const [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command invoked: ${command}'`)

    if (command == "extract-links") {
        getCurrentTab().then((result) => {

            chrome.scripting.insertCSS(
                {
                    target: { tabId: result.id ? result.id : -1 },
                    files: ["styles.css"],
                },
                () => {
                    // do nothing
                }
            )

            chrome.scripting.executeScript(
                {
                    target: { tabId: result.id ? result.id : -1 },
                    files: ["extract-links.js"],
                },
                () => {
                    // do nothing
                }
            )
        })
    }
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Extracts links
    if (message.links !== undefined) {
        message.links.forEach((link: any) => {
            console.log("HREF: " + link.href)
        });
    }
    console.log("Got the message:" + message)
    sendResponse({ farewell: "goodbye" });
})