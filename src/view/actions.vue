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
            <p>You are signed in!</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "actionsView",
  data() {
    return {
      msg: "Do stuff..",
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
