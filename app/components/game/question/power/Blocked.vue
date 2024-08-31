<script setup lang="ts">
import { } from 'vue'
import { timeline, spring } from "motion"

defineProps<{
    message: string
}>()

const container = ref()
const icon = ref()



onMounted(async () => {
    const sequence = [
        [container.value, { opacity: [0, 1], scale: [0.8, 1]}, { duration: 0.3, easing: spring() }],
        [icon.value, { opacity: [0, 1] }, { duration: 0.5 }],
        [icon.value, { rotate: [0, 360] }, { duration: 0.7, easing: spring() }],
        [icon.value, { scale: [1, 2] }, { duration: 0.5, easing: spring() }],
    ]
    const controles = timeline(sequence, {})
})


</script>

<template>
    <div class="absolute transform-gpu top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-50">

        <div class="flex flex-col opacity-0 items-center shadow-lg justify-center gap-10 rounded-xl bg-white/50 backdrop-filter backdrop-blur-lg p-4 " ref="container">
            <p class="text-5xl text-center">{{message}}</p>
            <span class="text-5xl" ref="icon">
                <Icon name="i-noto-kiss-mark"/>
            </span>
        </div>
    </div>
</template>
