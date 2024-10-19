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

const gameModeId = ref(null)

const sizeElem = computed(() => gameStore.game.parameters.length)
const gameModeIndex = computed(() => gameStore.game.parameters.findIndex(parameter => parameter.id === gameModeId.value))
const foundGameModeIndex = computed(() => gameStore.game.parameters.findIndex(parameter => index >= parameter.rangeStart && index <= parameter.rangeEnd))
const foundGameMode = computed({
    get() {
        return gameStore.game.parameters[gameModeIndex.value]
    },
    set(value) {
        gameStore.game.parameters[gameModeIndex.value] = value
    }
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
    $fetch(`/api/quiz/${gameStore.game.quizId}/updateGameMode`, {
        method: 'PATCH',
        body: foundGameMode.value
    })
    isHidden.value = true;
    gameModeId.value = null
}


const show = () => {
    gameModeId.value = gameStore.game.parameters[foundGameModeIndex.value]?.id

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

    gameStore.game.parameters.push(gameParameter)
    hideItem()
}


const gameModes = [
    { label: 'x5', descriptiion: 'Les questions rapportent 5x plus de points', value: ParameterGameMode.POINTS_X5, function: () => addGameMode(ParameterGameMode.POINTS_X5) },
    { label: 'Fastpass', descriptiion: '3 points pour le premier, 1 pour le deuxième, 1 pour le 3ème et -1 pour les suivants.', value: ParameterGameMode.FASTER_RESPONSE_MORE_POINTS, function: () => addGameMode(ParameterGameMode.FASTER_RESPONSE_MORE_POINTS) },
]

const availableGameModeRange = computed(() => {
    if (!foundGameMode.value) return [1, 1]

    const sortedGameMode = gameStore.game.parameters.toSorted((a, b) => a.rangeStart - b.rangeStart)
    const gameModeItemIndex = sortedGameMode.findIndex(parameter => parameter.id === foundGameMode.value.id)
    const minStart = (sortedGameMode[gameModeItemIndex - 1] ? sortedGameMode[gameModeItemIndex - 1]?.rangeEnd : -1) + 1 
    const maxEnd = (sortedGameMode[gameModeItemIndex + 1]?.rangeStart || gameStore.game.quiz.questions.length) -1
    return [minStart + 1, maxEnd + 1]

})

const startGameModeRange = computed({
    get() {
        return foundGameMode.value?.rangeStart + 1
    },
    set(value) {
        if (value < availableGameModeRange.value[0] || endGameModeRange.value < value) return foundGameMode.value.rangeStart
        foundGameMode.value.rangeStart = value - 1
    }
})

const endGameModeRange = computed({
    get() {
        return foundGameMode.value?.rangeEnd + 1
    },
    set(value) {
        const shouldNotBeHigherThan = availableGameModeRange.value[1]
        if (value > shouldNotBeHigherThan && startGameModeRange.value < value) return
        foundGameMode.value.rangeEnd = value - 1
    }
})

</script>

<template>
    <div ref="reference">
        <div  @click="show"
        :class="{ 'border-2 border-primary-700': !isHidden, 'border-2 border-orange-700': foundGameModeIndex > -1 }"
        class="w-32 rounded-lg h-6 bg-gray-200 dark:bg-gray-700 cursor-pointer relative group">
            <span
            class="absolute top-1/2 left-1/2 -translate-y-1/3 -translate-x-1/2 transition-all" :class="{'opacity-0 group-hover:opacity-100': !gameStore.game.parameters[foundGameModeIndex]}">
                <Icon v-if="!gameStore.game.parameters[foundGameModeIndex]" name="i-ph:stack-plus" class=""></Icon>
                <p v-if="gameStore.game.parameters[foundGameModeIndex]?.parameter === 'POINTS_X5'">x5</p>
                <p v-if="gameStore.game.parameters[foundGameModeIndex]?.parameter === 'FASTER_RESPONSE_MORE_POINTS'">Fastpass</p>
            </span>
            
    </div>
        <transition name="fade-in" mode="out-in">

            <u-card class="z-50 w-96" ref="floating" v-if="!isHidden" :style="{
                ...floatingStyles,
                // transform: `${floatingStyles.transform} translateX(-100%)`,
                display: isHidden ? 'none' : 'block',
            }">
                <template #header>
                    <p class="subtitle" v-if="!foundGameMode">Add a game mode on questions</p>
                    <p class="subtitle" v-else>{{ foundGameMode.parameter }}</p>
                </template>
                <div class="flex flex-col gap-2 max-h-72 overflow-y-auto p-2" v-if="!foundGameMode">
                    <u-card v-for="gameMode in gameModes" :key="gameMode.value" @click="gameMode.function">
                        <template #header>
                            <UBlogPost :title="gameMode.label" :description="gameMode.descriptiion"
                                class="cursor-pointer" />
                        </template>
                    </u-card>
                </div>
                <div class="flex flex-col gap-2 max-h-72 overflow-y-auto p-2" v-else>
                    <div class="flex gap-2 flex-wrap">
                        <input type="number" v-model="startGameModeRange" class="grow" :min="availableGameModeRange[0]"
                            :max="Math.min(availableGameModeRange[1], endGameModeRange)" />
                        <span class="text-gray-500 dark:text-gray-400">to</span>
                        <input type="number" v-model="endGameModeRange" class="grow"
                            :min="Math.max(availableGameModeRange[0], startGameModeRange)"
                            :max="availableGameModeRange[1]" />
                    </div>
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
