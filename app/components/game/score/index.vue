<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
    gameId: string
}>()

const { data: gameScore } = await useFetch(`/api/game/${props.gameId}/score`)

</script>

<template>
    <div class="flex flex-col gap-4 h-full">
        <u-card v-for="score in gameScore.scores" :key="score.player.id"
            class="flex flex-col items-center justify-center gap-4 h-full">
            <p class="text-2xl">Score : {{ score.score }}</p>
            <p class="text-4xl font-bold uppercase">
                {{ score.player.username }}
            </p>

        </u-card>
    </div>
</template>
