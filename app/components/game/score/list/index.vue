<script setup lang="ts">
import { } from 'vue'

const props = defineProps<{
    gameId: string,
    playerId: string
}>()

const { data: gameScore, status } = useFetch(`/api/game/${props.gameId}/${props.playerId}/answsers`)

</script>

<template>
    <div class="p-1 flex flex-col gap-1" v-if="status === 'success'">
        <game-score-list-question :display="answer.question.display" v-for="answer in gameScore" :key="answer.id"
            :answer="answer" />
    </div>
    <div v-else>
        <icon name="svg-spinners:pulse-3" class="text-5xl text-primary-500" />
    </div>
</template>
