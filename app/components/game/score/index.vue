<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    gameId: string
}>()
const { loggedIn, user, session, fetch, clear } = useUserSession()

onMounted(async () => {
    $fetch(`/api/game/${props.gameId}/${user.value.id}/endPlayerGame`, { method: 'PATCH' })
})

const { data: gameScore } = await useFetch(`/api/game/${props.gameId}/score`)


const { isPending, start, stop } = useTimeoutFn(async () => {
    const isGameOver = await $fetch(`/api/game/${props.gameId}/closeGame`, { method: 'PATCH' })

    if (!isGameOver.success) {
        start
    }
}, 1500)

</script>

<template>
    <div class="flex flex-col gap-4 h-full">
        {{ gameScore.isActive }}
        <u-card v-for="score in gameScore.scores" :key="score.player.id"
            class="flex flex-col items-center justify-center gap-4 h-full">
            <p class="text-2xl">Score : {{ score.score }}</p>
            <p class="text-4xl font-bold uppercase">
                {{ score.player.username }}
            </p>
            <game-score-question v-for="answer in score.answers" :key="answer.id" :answer="answer" />
        </u-card>
    </div>
</template>
