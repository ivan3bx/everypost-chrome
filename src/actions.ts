export async function fetchPageData() {
    if (chrome.storage) {
        return chrome.storage.local.get({ pageData: {} }).then((data) => {
            return data.pageData;
        });
    } else {
        return {
            url: "http://localhost:8080/test",
            iconURL: "/favicon.ico",
            title: "sample title",
            description: "sample description",
        };
    }
}

// fetchLinks returns a set of links from local storage
export async function fetchLinks() {
    if (chrome.storage) {
        return chrome.storage.local.get({ links: [] }).then((data) => {
            return data.links;
        });
    } else {
        // debug mode
        return [
            {
                publishDate: "2022-08-21T08:00:00Z",
                title: "Blog Title Optimizer Uses AI, But How Well Does It Work?",
                site: "Hackaday",
                url: "https://hackaday.com/2022/08/21/blog-title-optimizer-uses-ai-but-how-well-does-it-work/",
            },
            {
                publishDate: "2022-06-28T23:21:20Z",
                title: "Why you should turn your conference talk into a blog post",
                site: "Herbert Lui",
                url: "https://herbertlui.net/conference-talk-blog-post-transcribe/",
            },
            {
                publishDate: "2022-06-05T08:35:04Z",
                title: "Thinking beyond privacy: the risks of big tech’s entry into public sectors",
                site: "Site with long name so long I can't imagine how long it must be",
                url: "https://news.ycombinator.com/item?id=31629082",
            },
            {
                publishDate: "2021-04-15T11:00:00Z",
                title: "Hello Simplon",
                site: "Sample Site (Substack)",
                url: "https://kerkour.com/hello-simplon-2021",
            },
            {
                publishDate: "2020-04-15T00:00:00Z",
                title: "Open Source Weekly #8 - Content curation | Long title that I have to truncate",
                site: "NY Times",
                url: "https://kerkour.com/open-source-weekly/8",
            },
        ];
    }
}
