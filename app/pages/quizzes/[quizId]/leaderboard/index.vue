<script setup lang="ts">
import { timeline, stagger } from "motion"

const router = useRouter();
const quizId = useRoute().params.quizId as string

const listItems = ref()

const {data: bestPlayers} = await useFetch(`/api/quizzes/${quizId}/leaderboard`)


onMounted(() => {
    const sequence = [
        [listItems.value, { opacity: [0, 1], scale: [0.9, 1] }, { duration: 0.3, delay: stagger(0.1) }]
    ]
    timeline(sequence, {})

})
</script>

<template>
    <div class="flex flex-col w-full items-center">
        <h1 class="text-xl mb-5 mt-5">Leaderboard</h1>
        <div class="flex flex-col w-full">
            <div class="flex p-4 w-full border border-gray-300 opacity-0 dark:border-gray-800 rounded-lg justify-between items-center"
                v-for="(player, index) in bestPlayers" ref="listItems" :class="{ 'bg-green-600': index === 0 }">
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
    </div>

</template>