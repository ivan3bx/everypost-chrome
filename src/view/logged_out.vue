<template>
  <div class="main_app py-4 bg-gradient-to-br from-white to-sky-200 via-white" style="width: 372px">
    <div class="min-h-full flex items-center justify-center px-6">
      <div class="max-w-md w-full">
        <div class="">
          <h2 class="text-xl font-bold text-gray-900">EveryPost <span class="text-sm">(for chrome)</span></h2>
        </div>

        <div v-if="links.length > 0">
          <p class="pt-4 text-base font-semibold text-gray-600">Related links..</p>
          <Links :links="links" v-if="links.length > 0" />
        </div>

        <div class="my-2 px-3 py-2 bg-blue-100 border-blue-300 border flex space-x-4 shadow-sm rounded-sm">
          <InformationCircleIcon class="text-blue-600 h-8 w-8" />
          <div class="text-sm text-gray-600">
            <p>
              EveryPost is active, but bookmarking features currently
              <span class="font-semibold">disabled</span>.
            </p>
          </div>
        </div>

        <Features v-if="links.length == 0" />

        <div class="flex flex-col space-y-2">
          <a
            class="w-max group relative py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            href="https://everypost.in/features/?utm_source=extension+chrome"
            target="_blank">
            Sign Up
          </a>
          <div class="my-1 font-medium text-sm text-gray-700">
            Already have an account?
            <a
              class="font-medium text-blue-600 underline-offset-1 underline"
              @click="authenticate"
              href="https://everypost.in/users/sign_in?utm_source=extension+chrome&extension=true">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { InformationCircleIcon } from "@heroicons/vue/24/outline";
import { fetchLinks } from "../actions";
import Links from "./links.vue";
import Features from "./features.vue";

export default {
  components: {
    InformationCircleIcon,
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
