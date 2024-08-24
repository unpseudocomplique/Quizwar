<script setup lang="ts">
import { timeline, stagger } from "motion"
const gameStore = useGameStore()
const listItems = ref()

const score = computed(() => {
    const table = gameStore.scorePerPlayer.map(player => {
        return {
            username: player.player.username,
            score: player.score.correct
        }
    })
    table.sort((a, b) => b.score - a.score)
    return table
})

// console.log('table', score.value)

// const score = [
//     {
//         "username": "mathnewph",
//         "score": 10
//     },
//     {
//         "username": "mathnewph",
//         "score": 8
//     },
//     {
//         "username": "mathnewph",
//         "score": 5
//     }
// ]


onMounted(() => {
    const sequence = [
        [listItems.value, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.3, delay: stagger(0.1) }]
    ]
    timeline(sequence, {})

})
</script>

<template>
    <div class="flex flex-col w-full">
        <div class="flex p-4 w-full border border-gray-300 opacity-0 dark:border-gray-800 rounded-lg justify-between items-center"
            v-for="(player, index) in score" ref="listItems" :class="{ 'bg-green-600': index === 0 }">
            <icon v-if="index === 0" class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl"
                name="i-emojione-crown" />
            <p class="ml-8">
                {{ player.username }} :

            </p>
            <p class="text-2xl">
                {{ player.score }}
            </p>
        </div>
    </div>
</template>