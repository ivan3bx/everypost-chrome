<template>
  <div class="py-2">
    <ul class="px-6 list-disc text-sm marker:text-gray-600" v-for="link in links" :key="link.publishDate">
      <li>
        <a v-bind:href="link.url" target="_blank" v-bind:title="`${link.title} - ${link.site}`" class="group">
          <div class="flex flex-col pb-2">
            <div
              class="text-sm font-normal line-clamp-1 leading-tight group-hover:underline group-hover:decoration-slate-400 group-hover:underline-offset-2">
              {{ link.title }}
            </div>
            <div class="text-sm font-medium text-gray-500 line-clamp-1">
              {{ link.site }} &nbsp;
              <span class="text-gray-400">{{ formatDate(link.publishDate) }}</span>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "linksView",
  props: ["links"],
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
      } else if (Math.round(-deltaDays) > 0) {
        return formatter.format(Math.round(-deltaDays), "days");
      } else {
        return "Today"
      }
    },
  },
};
</script>
