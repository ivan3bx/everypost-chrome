// EveryPost content script

function onSignOut() {
    console.log("onSignOut() forcing logout")
    chrome.runtime.sendMessage({ action: "logout" })
}

function onSignIn() {
    console.log("onSignIn() checking access")
    chrome.runtime.sendMessage({ action: "check_access" })
}

// presence of sign-out link suggests user is already logged in
document.querySelectorAll('form[action="/users/sign_out"] > button').forEach(el => {
    el.addEventListener("click", onSignOut)
    // 2. If logged_in is false, we should check for access
    onSignIn()
})