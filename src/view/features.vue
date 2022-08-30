<template>
  <div class="max-w-7xl mx-auto pt-4 pb-2">
    <p class="font-semibold text-base text-black">Sign up to unlock the following</p>
    <dl class="space-y-1 my-2">
      <div v-for="feature in features" :key="feature.name" class="relative">
        <dt>
          <CheckIcon class="absolute h-6 w-6 text-green-500" />
          <p class="ml-9 text-sm font-medium text-gray-900">
            {{ feature.name }}
          </p>
        </dt>
      </div>
    </dl>
  </div>
</template>
<script>
import { CheckIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    CheckIcon,
  },
  name: "featuresView",
  data() {
    return {
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
    };
  },
};
</script>
