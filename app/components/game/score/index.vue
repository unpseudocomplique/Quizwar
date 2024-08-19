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
    <div class="flex flex-col gap-4 h-full overflow-auto">

        <UAccordion :items="gameScore.scores" multiple>
            <template #default="{ item }">
                <div
                    class="flex justify-between items-center gap-4 bg-primary-100 dark:bg-primary-900/50 py-2 px-4  rounded-md cursor-pointer">
                    <p class="text-2xl font-bold uppercase select-none">
                        {{ item.player.username }}
                    </p>
                    <u-badge variant="soft" class="select-none">Voir le détail</u-badge>
                    <p class="text-4xl">Score : {{ item.score }}</p>
                </div>
            </template>
            <template #item="{ item }">
                <div class="p-1 flex flex-col gap-1">
                    <game-score-question :display="item.display" v-for="answer in item.answers" :key="answer.id"
                        :answer="answer" />
                </div>
            </template>
        </UAccordion>
        <!-- <u-card v-for="score in gameScore.scores" :key="score.player.id"
            class="flex flex-col items-center justify-center gap-4 h-full">
            <p class="text-2xl">Score : {{ score.score }}</p>
            <p class="text-4xl font-bold uppercase">
                {{ score.player.username }}
            </p>
            <game-score-question v-for="answer in score.answers" :key="answer.id" :answer="answer" />
        </u-card> -->
    </div>
</template>
