<template>
    <div class="md:border-2 md:border-black md:m-2 main_app px-2 bg-white" style="width: 450px">
        <div class="w-full overflow-hidden">
            <div class="block">
                <div class="border-b border-gray-200">
                    <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
                    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
                        <a
                            v-for="(tab, index) in tabs"
                            :key="tab.name"
                            v-on:click="activateTab(index)"
                            v-bind:id="`tab-${index}`"
                            href="#"
                            :class="[
                                tab.current
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200',
                                'whitespace-nowrap flex pt-4 pb-2 px-1 border-b-2 font-medium text-sm',
                            ]"
                            :aria-current="tab.current ? 'page' : undefined">
                            {{ tab.name }}
                            <span
                                v-if="tab.count"
                                :class="[
                                    tab.current ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900',
                                    'ml-2 py-0.5 px-2 rounded-full text-xs font-medium inline-block',
                                ]"
                                >{{ tab.count }}</span
                            >
                        </a>
                    </nav>
                </div>
            </div>
        </div>

        <div v-if="activeTab == 0">
            <div class="min-h-full flex items-center justify-center">
                <div class="w-full">
                    <form ref="form" accept-charset="UTF-8" method="post">
                        <input name="source_url" autocomplete="off" type="hidden" v-bind:value="url" id="b_url" />
                        <div>
                            <div class="overflow-hidden">
                                <div class="flex space-x-2 px-4 pt-5 pb-3 sm:py-5 sm:px-6">
                                    <div id="image-holder" class="flex-shrink-0">
                                        <PhotoIcon class="text-gray-300 h-10 w-10 border border-gray-300" />
                                    </div>
                                    <div class="w-full flex-col space-y-1">
                                        <input
                                            id="b_title"
                                            v-model="title"
                                            placeholder="Enter a title..."
                                            autocomplete="off"
                                            autofocus="autofocus"
                                            class="resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm tracking-tight leading-5 text-gray-900 border-gray-300 rounded-md"
                                            type="text" />
                                        <input
                                            id="b_url"
                                            tabindex="-1"
                                            readonly="readonly"
                                            v-bind:value="url"
                                            class="focus:ring-0 focus:outline-none py-0 w-full border-none line-clamp-1 italic px-2 break-all text-gray-400 text-xs"
                                            type="text" />
                                    </div>
                                </div>
                                <div class="border-t border-gray-200 px-4 py-3 sm:p-0">
                                    <dl class="sm:divide-y sm:divide-gray-200">
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                <label for="b_description">Description</label>
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 italic sm:mt-0 sm:col-span-3">
                                                <textarea
                                                    id="b_description"
                                                    v-model="description"
                                                    rows="3"
                                                    autocomplete="off"
                                                    class="resize-none shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full text-sm border border-gray-300 rounded-md"
                                                    onfocus="this.select();" />
                                            </dd>
                                        </div>
                                        <div class="py-4 sm:py-5 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                            <dt class="text-sm font-medium text-gray-500">
                                                <label for="b_tag_list">Tags</label>
                                            </dt>
                                            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">
                                                <input
                                                    placeholder="enter tag list.."
                                                    id="tag-editor-field"
                                                    v-bind:value="tagList"
                                                    class="hidden my-3 shadow-sm focus:ring-blue-500 focus:border-blue-500 w-full sm:text-sm border-gray-300 rounded-md"
                                                    autocomplete="off"
                                                    autocapitalize="off"
                                                    autocorrect="off"
                                                    type="text"
                                                    name="b[tag_list]" />
                                                <div id="tag-editor-box" class="w-full text-left sm:w-full">
                                                    <div class="relative sm:text-left">
                                                        <input
                                                            ref="tag-editor"
                                                            v-on:input="parseTags"
                                                            type="search"
                                                            name="new-tag"
                                                            id="new-tag"
                                                            placeholder="+ add tag.."
                                                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                                            autocomplete="off"
                                                            autocapitalize="off"
                                                            autocorrect="off" />
                                                        <div class="absolute w-full bg-white z-10 mb-3"></div>
                                                        <div id="tag-list" class="overflow-hidden w-full py-4">
                                                            <ul class="flex flex-wrap"></ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </dd>
                                        </div>

                                        <div class="border-t py-4 sm:py-5 grid grid-cols-3 sm:gap-4 sm:px-6">
                                            <dd
                                                class="ml-auto flex space-x-4 mt-1 text-sm text-gray-900 sm:mt-0 col-span-3">
                                                <button
                                                    v-on:click="submit"
                                                    name="button"
                                                    type="submit"
                                                    class="inline-flex items-center shadow-sm px-6 py-1.5 border border-blue-600 text-sm leading-5 font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                                    Save
                                                </button>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="py-4" v-if="activeTab == 1">
            <Links class="px-2" :links="links" :collapsed="true" />
        </div>
    </div>
</template>

<script>
import { fetchLinks, fetchPageData } from "../actions"
import { PhotoIcon } from "@heroicons/vue/24/outline"
import Links from "./links.vue"

export default {
    name: "loggedInView",
    components: {
        Links,
        PhotoIcon,
    },
    data() {
        return {
            activeTab: 0,
            tabs: [
                { name: "Add Bookmark", href: "#", active: true, current: true },
                { name: "Related Links", href: "#", active: true, count: "", current: false },
            ],
            links: [],
            title: "Untitled",
            url: "",
            description: "",
            site_icon: "",
            tagList: "",
        }
    },
    methods: {
        activateTab: function (newIndex) {
            this.activeTab = newIndex
            for (let i = 0; i < this.tabs.length; i++) {
                const t = this.tabs[i]
                t.current = i == newIndex
            }
        },
        refreshContent: function () {
            fetchPageData().then((data) => {
                const page = data
                console.log("Setting page data:", page)
                this.url = page.url
                this.site_icon = page.iconURL
                this.title = page.title
                this.description = page.description
            })
        },
        refreshIcon: function () {
            const imageHolder = document.querySelector("#image-holder")
            if (this.site_icon) {
                const elem = document.createElement("img")
                elem.setAttribute("src", this.site_icon)
                elem.classList = "h-10 w-10"
                imageHolder.replaceChildren(elem)
                console.log("replaced icon with image:", imageHolder.innerHTML)
            }
        },
        parseTags: function (e) {
            e.preventDefault()
            const newValue = this.$refs["tag-editor"].value
            this.tagList = newValue
        },
        submit: function (e) {
            console.log("submitting bookmark ", this.$refs.form)
            e.preventDefault()

            const tags = this.tagList.split(",").map((val) => val.trim().replace(/\s+/g, "-"))

            const bookmarkModel = {
                url: this.url,
                title: this.title,
                description: this.description,
                tags: tags.filter((val) => val != ""),
            }

            if (chrome.runtime) {
                chrome.runtime.sendMessage({ action: "save", bookmark: bookmarkModel }).then(() => {
                    window.close()
                })
            } else {
                console.log("submit bookmark: ", bookmarkModel)
            }
        },
    },
    beforeMount() {
        this.refreshContent()

        // Fetch links
        fetchLinks().then((data) => {
            this.links = data
            this.tabs[1].active = this.links.length > 0
            this.tabs[1].count = this.links.length > 0 ? this.links.length : ""

            if (this.links.length == 0) {
                document.querySelector("#tab-1").classList.add("pointer-events-none", "cursor-default")
            } else {
                document.querySelector("#tab-1").classList.remove("pointer-events-none", "cursor-default")
            }
        })
    },
    updated() {
        if (this.activeTab == 0) {
            this.refreshIcon()
        }
    },
    mounted() {
        // initial focus on title
        const t_title = document.querySelector("#b_title")
        t_title.select()

        // lazy-loading of icon, to prevent long delay in first render
        setTimeout(() => {
            this.refreshIcon()
        }, 100)
    },
}
</script>

<style>
.main_app {
    font-family: Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
