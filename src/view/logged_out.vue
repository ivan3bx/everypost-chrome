<template>
  <div
    class="main_app py-6 bg-gradient-to-br from-white to-sky-200 via-white"
    style="width: 390px"
  >
    <div class="min-h-full flex items-center justify-center py-2 px-6">
      <div class="max-w-md w-full">
        <div class="">
          <h2 class="text-xl font-bold text-gray-900">
            EveryPost <span class="text-sm">(for chrome)</span>
          </h2>
        </div>

        <div class="py-4" v-if="links.length > 0">
          <p class="mb-1 text-base font-semibold text-gray-600">
            Related links..
          </p>

          <ul
            class="px-4 list-disc text-sm marker:text-gray-600"
            v-for="link in links"
            :key="link.publishDate">
            <li class="pb-2">
              <a v-bind:href="link.url" target="_blank" v-bind:title="link.title">
                <div class="flex flex-col">
                  <div class="text-sm font-medium line-clamp-1 leading-tight">
                    {{ link.title }}
                  </div>
                  <div class="text-sm font-medium text-gray-500 line-clamp-1">
                    {{ link.site }} &nbsp; <span class="text-gray-400">{{ formatDate(link.publishDate) }}</span>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <div class="max-w-7xl mx-auto py-4 px-4" v-if="links.length == 0">
          <p class="font-semibold text-base text-black">
            Sign up to unlock the following
          </p>
          <dl class="space-y-1 my-2">
            <div
              v-for="feature in features"
              :key="feature.name"
              class="relative"
            >
              <dt>
                <CheckIcon
                  class="absolute h-6 w-6 text-green-500"
                  aria-hidden="true"
                />
                <p class="ml-9 text-sm font-medium text-gray-900">
                  {{ feature.name }}
                </p>
              </dt>
            </div>
          </dl>
        </div>


        <div
          class="my-2 px-3 py-2 bg-blue-100 border-blue-300 border flex space-x-4 shadow-sm rounded-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-blue-600 h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="text-sm text-gray-600">
            <p>
              EveryPost is active, but bookmarking features are currently <span
              class="font-semibold">disabled</span>.
            </p>
          </div>
        </div>

        <a
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="authenticate"
          href="https://everypost.in/users/sign_in?extension=true"
        >
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: solid/lock-closed -->
            <svg
              class="h-5 w-5 text-blue-500 group-hover:text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          Sign In
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { CheckIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    CheckIcon,
  },
  name: "loggedOutView",
  methods: {
    formatDate: (value) => {
      const target = new Date(Date.parse(value));
      const deltaDays = (Date.now() - target) / (1000 * 3600 * 24);
      const formatter = new Intl.RelativeTimeFormat();

      if (deltaDays > 365) {
        return formatter.format(Math.round(-deltaDays / 365), "years");
      } else if (deltaDays > 60) {
        return formatter.format(Math.round(-deltaDays / 30), "months");
      } else if (deltaDays > 7) {
        return formatter.format(Math.round(-deltaDays / 7), "weeks");
      } else {
        return formatter.format(Math.round(-deltaDays), "days");
      }
    },
    authenticate: () => {
      chrome.tabs.create({
        url: "https://everypost.in/users/sign_in?extension=true",
      });
    },
  },
  data() {
    return {
      links: [],
      features: [
        {
          name: "Personal library for your saved links",
        },
        {
          name: "View links to your saved articles over time",
        },
        {
          name: "Notifications, Twitter integration and more",
        },
      ],
      msg: "EveryPost",
    };
  },
  beforeMount() {
    if (chrome.storage) {
      chrome.storage.local.get({ links: [] }).then((data) => {
        console.log("Fetched data for ", this, "data:", data.links);
        this.links = data.links;
      });
    } else {
      // debug mode
      this.links = [
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
          title:
            "Thinking beyond privacy: the risks of big tech’s entry into public sectors",
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
  },
};
</script>

<style>
.main_app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
