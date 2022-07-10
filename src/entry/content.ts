// EveryPost content script

function onSignOut() {
    chrome.storage.local.set({ logged_in: false })
}

function onSignIn() {
    chrome.runtime.sendMessage({ action: "check_access" })
}

document.querySelectorAll('form[action="/users/sign_out"] > button').forEach(el => {
    console.log("Adding listener")
    el.addEventListener("click", onSignOut)

    chrome.storage.local.get({ logged_in: false })
        .then(data => {
            if (!data.logged_in) {
                // 1. presence of sign-out link suggests user is currently logged in.
                // 2. If logged_in is false, we should check for access
                onSignIn()
            }
        })
})