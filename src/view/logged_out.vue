<template>
  <div class="main_app py-6 bg-gradient-to-br from-white to-sky-200 via-white" style="width: 390px">
    <div class="min-h-full flex items-center justify-center py-2 px-6">
      <div class="max-w-md w-full">
        <div class="">
          <h2 class="text-xl font-bold text-gray-900">EveryPost <span class="text-sm">(for chrome)</span></h2>
        </div>

        <Links :links="links" v-if="links.length > 0" />
        <Features v-else />

        <div class="my-2 px-3 py-2 bg-blue-100 border-blue-300 border flex space-x-4 shadow-sm rounded-sm">
          <InformationCircleIcon class="text-blue-600 h-8 w-8" />
          <div class="text-sm text-gray-600">
            <p>
              EveryPost is active, but bookmarking features are currently
              <span class="font-semibold">disabled</span>.
            </p>
          </div>
        </div>

        <a
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="authenticate"
          href="https://everypost.in/users/sign_in?extension=true">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <LockClosedIcon class="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
          </span>
          Sign In
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import { LockClosedIcon } from "@heroicons/vue/24/solid";
import { fetchLinks } from "../actions";
import Links from "./links.vue";
import Features from "./features.vue";

export default {
  components: {
    InformationCircleIcon,
    LockClosedIcon,
    Links,
    Features,
  },
  name: "loggedOutView",
  methods: {
    authenticate: () => {
      chrome.tabs.create({
        url: "https://everypost.in/users/sign_in?extension=true",
      });
    },
  },
  data() {
    return {
      links: [],
    };
  },
  beforeMount() {
    fetchLinks().then((data) => {
      this.links = data;
    });
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
