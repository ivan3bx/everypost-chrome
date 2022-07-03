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

chrome.commands.onCommand.addListener((command) => {
    console.log(`Command invoked: ${command}'`)
})