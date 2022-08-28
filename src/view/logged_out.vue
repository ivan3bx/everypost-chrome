<template>
  <div class="main_app py-6 bg-gradient-to-br from-white to-sky-200 via-white" style="width: 350px;">
    <div class="min-h-full flex items-center justify-center py-2 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full">
        <div class="px-4">
          <h2 class="text-xl font-bold text-gray-900">EveryPost <span class="text-sm">(for chrome)</span></h2>
        </div>
        <div class="my-2 px-3 py-2 bg-blue-100 border-blue-300 border flex space-x-4 shadow-sm rounded-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600 h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-gray-600">
            <p>EveryPost is active, but major features are <span class="font-semibold">not active</span>.</p>
          </div>
        </div>

        <div class="max-w-7xl mx-auto py-4 px-4">
          <p class="font-semibold text-base text-black">
            Sign up now to unlock the following
          </p>
          <dl class="space-y-1 my-2">
            <div v-for="feature in features" :key="feature.name" class="relative">
              <dt>
                <CheckIcon class="absolute h-6 w-6 text-green-500" aria-hidden="true" />
                <p class="ml-9 text-sm font-medium text-gray-900">{{ feature.name }}</p>
              </dt>
            </div>
          </dl>
        </div>

        <a class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" @click="authenticate" href="https://everypost.in/users/sign_in?extension=true">
          <span class="absolute left-0 inset-y-0 flex items-center pl-3">
            <!-- Heroicon name: solid/lock-closed -->
            <svg class="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
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
    authenticate: () => {
      chrome.tabs.create({
        url: "https://everypost.in/users/sign_in?extension=true",
      });
    },
  },
  data() {
    return {
      features: [
        {
          name: "Personal bookmarks library",
        },
        {
          name: "Tools to stay organized",
        },
        {
          name: "Get notified when links get mentioned",
        },
      ],
      msg: "EveryPost",
    };
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
