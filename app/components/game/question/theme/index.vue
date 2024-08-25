<script setup lang="ts">
import { timeline } from "motion"
import { TransitionPresets, useTransition, executeTransition } from '@vueuse/core'
import { PowerType } from '~/stores/game'

const question = defineModel()
const gameStore = useGameStore()
const { user } = useUserSession()

const emits = defineEmits(['finished'])
const sendGameInformation = inject('sendGameInformation') as (message: string) => void

const containerTheme = ref()
const labelTheme = ref()
const valueTheme = ref()
const showPowers = ref(false)

onMounted(async () => {

    const themeSequence = [
        [containerTheme.value, { opacity: [0, 1] }, { duration: 0.3 }],
        [labelTheme.value, { opacity: [0, 1] }, { duration: 0.3, delay: 0.3 }],
        [valueTheme.value, { opacity: [0, 1] }, { duration: 0.3, delay: 0.3 }]

    ]
    // const audio = new Audio(ThemeSound)
    // audio.loop = true

    // audio.play()

    const controlesTheme = timeline(themeSequence, {})
    controlesTheme.finished.then(async () => {
        showPowers.value = true
        await nextTick()
        await sleep(5000)
        emits('finished')
    })
})

const powers = {
    [PowerType.FIFTY_FIFTY]: {
        display: '50/50',
        description: 'Vous enlevez 2 mauvaises réponses des choix proposés.',
        icon: 'i-noto-detective',
        click: async () => {
            const power = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
                method: 'POST',
                body: { power: PowerType.FIFTY_FIFTY }
            })

            gameStore.usedPowers.push(power)
            sendGameInformation(JSON.stringify({ type: 'powerUsed', room: gameStore.game.id, power }))
        }

    },
    [PowerType.STEAL_POINTS]: {
        display: 'Vol de points',
        description: 'Choisissez votre cible et volez les points optenus a la fin de la question.',
        icon: 'i-noto-ninja'
    },
    [PowerType.BLOCK]: {
        display: 'Bloquer',
        description: 'Choisissez votre cible et empêchez-la de répondre.',
        icon: 'i-noto-no-entry'
    },
    [PowerType.DOUBLE_POINTS]: {
        display: 'Double points',
        description: 'Doublez les points obtenus à cette question.',
        icon: 'i-noto-money-mouth-face'
    }
}

</script>

<template>
    <div class="flex flex-col h-full" v-auto-animate>

        <div ref="containerTheme" class="flex flex-col h-full items-center justify-center opacity-0">
            <p ref="labelTheme" class="opacity-0">Theme</p>
            <p ref="valueTheme" class="text-center text-xl md:text-5xl font-bold opacity-0">
                {{ question.theme }}
            </p>
        </div>
        <div v-if="showPowers" class="grid grid-cols-2 gap-4 h-full">
            <u-button v-for="(value, key) in gameStore.availablePowers" @click="powers[key].click()" :key="key"
                :disabled="value === 0" class="text-xl md:text-4xl justify-center scale-in-center flex flex-col">
                <span class="flex gap-4 items-center">

                    <icon :name="powers[key].icon"></icon> {{ powers[key].display }}
                </span>
                <span class="text-5xl">{{ value }}</span>
            </u-button>
        </div>
    </div>
</template>
