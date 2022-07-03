let active = false;

console.log('hello world background todo something~')

function makeOrange(color:string) {
    console.log("making color: " + color)
    document.body.style.backgroundColor = color
}

chrome.action.onClicked.addListener((tab) => {
    console.log("added listener..")
    active = !active;
    const color = active ? 'orange' : 'white'
    chrome.scripting.executeScript({
        target: {tabId: tab.id ? tab.id : -1},
        func: makeOrange,
        args: [color]
    }).then()
})

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
                    target: {tabId: result.id ? result.id : -1},
                    files: ["styles.css"],
                },
                () => {
                    // do nothing
                }
            )

            chrome.scripting.executeScript(
                {
                    target: {tabId: result.id ? result.id : -1},
                    files: ["extract-links.js"],
                },
                () => {
                    // do nothing
                }
            )
        })
    }
})