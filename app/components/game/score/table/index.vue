<script setup lang="ts">
import { timeline, stagger } from "motion"
const gameStore = useGameStore()
const listItems = ref()


// scorePerPlayer(store) {
//             console.log(store.players)
//             return store.players.reduce((acc, player) => {
//                 const { answers } = player
//                 const score = answers.reduce((acc, answer) => {
//                     if (answer.isCorrect) {
//                         acc.correct += 1
//                     } else {
//                         acc.wrong += 1
//                     }
//                     return acc
//                 }, { correct: 0, wrong: 0 })
//                 acc.push({
//                     player: player.player,
//                     score
//                 })
//                 return acc
//             }, [])
//         }

const score = computed(() => {
    const table = gameStore.players.map(player => {
        const score = player.answers.reduce((acc, answer, index) => {
            if (index > gameStore.currentQuestionIndex) {
                return acc
            }
            if (answer.isCorrect) {
                acc += 1
            }
            return acc
        }, 0)

        return {
            player: player.player,
            score
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
                {{ player.player.username }} :

            </p>
            <p class="text-2xl">
                {{ player.score }}
            </p>
        </div>
    </div>
</template>