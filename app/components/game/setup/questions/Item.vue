<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import type { TGame } from '~/../types/game'

import { useFloating, autoPlacement, flip, shift, hide, size } from '@floating-ui/vue';
const question = defineModel<TGame['quiz']['questions'][number]>()
const { index } = defineProps<{
    index: number
}>()

const gameStore = useGameStore()

const reference = useTemplateRef('reference')
const floating = useTemplateRef('floating')


const sizeElem = computed(() => gameStore.game.parameters.length)
const foundGameMode = computed(() => {
    return gameStore.game.parameters.find(parameter => index >= parameter.rangeStart && index <= parameter.rangeEnd)
})


const isHidden = ref(true)

const { floatingStyles, update, placement } = useFloating(reference, floating, {
    middleware: [
        shift({
        }),
        autoPlacement({
            alignment: 'end',
            padding: 10,
        }),

    ],
    strategy: 'fixed',
    placement: 'bottom'
});

const hideItem = () => {
    isHidden.value = true;
}

const show = () => {
    isHidden.value = false;
}

onClickOutside(reference, () => hideItem())


const addGameMode = async (gameMode: ParameterGameMode) => {
    const gameParameter = await $fetch(`/api/quiz/${gameStore.game.quizId}/addGameMode`, {
        method: 'POST',
        body: {
            gameId: gameStore.game.id,
            gameMode,
            rangeStart: index,
            rangeEnd: index
        }
    })

    gameStore.game.parameters.push(gameParameter.value)
    console.log(gameStore.game.parameters)
}


const gameModes = [
    { label: 'x5', descriptiion: 'Les questions rapportent 5x plus de points', value: ParameterGameMode.POINTS_X5, function: () => addGameMode(ParameterGameMode.POINTS_X5) },
    { label: 'Fastpass', descriptiion: '3 points pour le premier, 1 pour le deuxième, 1 pour le 3ème et -1 pour les suivants.', value: ParameterGameMode.FASTER_RESPONSE_MORE_POINTS, function: () => addGameMode(ParameterGameMode.FASTER_RESPONSE_MORE_POINTS) },
]

</script>

<template>
    <div ref="reference" @blur="hideItem" @focus="show" @click="show"
        :class="{ 'border-2 border-primary-700': !isHidden, 'border-2 border-orange-700': foundGameMode }"
        class="w-32 rounded-lg h-6 bg-gray-200 dark:bg-gray-700 cursor-pointer relative group">
        <span
            class="absolute top-1/2 left-1/2 -translate-y-1/3 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
            <Icon name="i-ph:stack-plus" class=""></Icon>
        </span>
        <transition name="fade-in" mode="out-in">

            <u-card class="z-50 w-96" ref="floating" v-show="!isHidden" :style="{
                ...floatingStyles,
                transform: `${floatingStyles.transform} translateX(-100%)`,
                display: isHidden ? 'none' : 'block',
            }">
                <template #header>
                    <p class="subtitle">Add a game mode on questions</p>
                </template>
                <div class="flex flex-col gap-2 max-h-72 overflow-y-auto p-2">
                    <u-card v-for="gameMode in gameModes" :key="gameMode.value" @click="gameMode.function">
                        <template #header>
                            <UBlogPost :title="gameMode.label" :description="gameMode.descriptiion"
                                class="cursor-pointer" />
                        </template>
                    </u-card>
                </div>
            </u-card>
        </transition>
    </div>
</template>

<style scoped>
.fade-in-enter-active,
.fade-in-leave-active {
    transition: opacity 0.0s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
    opacity: 0;
}
</style>
