<script setup lang="ts">
import { computed, ref } from 'vue'
import { timeline, stagger } from "motion"
import type { TGameScore } from '~~/types/game';
import confetti from "canvas-confetti";

const listItems = ref()

const props = defineProps<{
    gameId: string
}>()
const { loggedIn, user, session, fetch, clear } = useUserSession()


const { data: gameScore } = await useFetch<TGameScore>(`/api/game/${props.gameId}/score`, {
    transform: (data) => {
        return data.map((item, index) => {
            return {
                ...item,
                winner: index === 0
            }
        })
    }
})


onMounted(async () => {
    $fetch(`/api/game/${props.gameId}/${user.value.id}/endPlayerGame`, { method: 'PATCH' })
    const winner = gameScore.value.find(item => item.winner)
    if (winner.playerId === user.value.id) {
        const duration = 5 * 1000; // 5 seconds
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        // Helper function to get a random value between a range
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = window.setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            // Confetti from left side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            });

            // Confetti from right side
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            });
        }, 250);
    }
})


const { isPending, start, stop } = useTimeoutFn(async () => {
    const isGameOver = await $fetch(`/api/game/${props.gameId}/closeGame`, { method: 'PATCH' })

    if (!isGameOver.success) {
        start()
    }
}, 1500)


onMounted(() => {
    const sequence = [
        [listItems.value, { opacity: [0, 1], scale: [0.8, 1] }, { duration: 0.3, delay: stagger(0.1) }]
    ]
    timeline(sequence, {})

})

</script>

<template>
    <div class="flex flex-col gap-4 h-full overflow-auto w-full">

        <UAccordion :items="gameScore" multiple>
            <template #default="{ item }">
                <div ref="listItems"
                    class="flex justify-between items-center flex-wrap gap-4 py-2 px-4 rounded-md cursor-pointer"
                    :class="[item.winner ? 'bg-green-100 dark:bg-green-700/70' : 'bg-gray-100 dark:bg-gray-800/50']">
                    <p class="text-xl font-bold uppercase select-none w-72 max-w-full line-clamp-1">
                        <icon v-if="item.winner" class="text-2xl translate-y-1" name="i-emojione-crown" /> {{
                        item.player.username }}
                    </p>

                    <u-badge variant="soft" class="select-none">Voir le détail</u-badge>
                    <p class="text-4xl">Score : {{ item.gameScore }}</p>
                </div>
            </template>
            <template #item="{ item, open }">

                <game-score-list v-if="open" :game-id="gameId" :player-id="item.player.id" />
            </template>
        </UAccordion>
    </div>
</template>
