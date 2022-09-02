<template>
    <div class="max-w-7xl mx-auto pt-4 pb-2">
        <p class="font-semibold text-base text-black tracking-tight">Sign up for full access:</p>
        <dl class="space-y-1 my-2">
            <div v-for="feature in features" :key="feature.name" class="relative">
                <dt>
                    <CheckIcon class="absolute h-5 w-5 text-emerald-500" />
                    <p class="ml-8 text-sm font-medium text-gray-900">
                        {{ feature.name }}
                    </p>
                </dt>
            </div>
        </dl>
    </div>
</template>
<script>
import { CheckIcon } from "@heroicons/vue/24/solid"

export default {
    components: {
        CheckIcon,
    },
    name: "featuresView",
    data() {
        return {
            features: [
                {
                    name: "Personal library of saved links",
                },
                {
                    name: "Notified as sites mention your links",
                },
                {
                    name: "Twitter integration and more",
                },
            ],
        }
    },
}
</script>
