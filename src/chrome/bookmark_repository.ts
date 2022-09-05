export type BookmarkModel = {
    url: string
    title: string
    description: string
    tags: string[]
}

export class BookmarkRepository {
    async save(data: BookmarkModel) {
        const token = await this.authToken()

        const headers = {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }

        const request = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data),
        }

        fetch("https://everypost.in/api/bookmarks", request)
            .then((response) => {
                console.log("saveBookmark(): response", response.status)
            })
            .catch((reason) => {
                console.warn("saveBookmark(): error ", reason)
            })
    }

    async authToken() {
        const token = await chrome.storage.local.get({ auth_token: "" }).then((data) => data.auth_token)
        return token
    }
}