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
const showSelectPlayerToBlock = ref(false)

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

const blockPlayer = async (player) => {
    showSelectPlayerToBlock.value = false
    powers.value[PowerType.BLOCK].selected = true
    const power = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
        method: 'POST',
        body: { power: PowerType.BLOCK, targetPlayerId: player.id }
    })

    gameStore.usedPowers.push(power)
    sendGameInformation(JSON.stringify({ type: 'powerUsed', room: gameStore.game.id, power }))
}

const powers = ref({
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
            powers.value[PowerType.FIFTY_FIFTY].selected = true
        },
        selected: false

    },
    [PowerType.STEAL_POINTS]: {
        display: 'Vol de points',
        description: 'Choisissez votre cible et volez les points optenus a la fin de la question.',
        icon: 'i-noto-ninja',
        selected: false
    },
    [PowerType.BLOCK]: {
        display: 'Bloquer',
        description: 'Choisissez votre cible et empêchez-la de répondre.',
        icon: 'i-noto-no-entry',
        click: async () => {
            showSelectPlayerToBlock.value = true
        },
        selected: false
    },
    [PowerType.DOUBLE_POINTS]: {
        display: 'Double points',
        description: 'Doublez les points obtenus à cette question.',
        icon: 'i-noto-money-mouth-face',
        selected: false
    }
})

const isOnePowerSelected = computed(() => {
    return Object.values(powers.value).some(power => power.selected)
})

</script>

<template>
    <div class="flex flex-col h-full" v-auto-animate>

        <div ref="containerTheme" class="flex flex-col h-full items-center justify-center opacity-0">
            <p ref="labelTheme" class="opacity-0">Theme</p>
            <p ref="valueTheme" class="text-center text-xl md:text-5xl font-bold opacity-0">
                {{ question.theme }}
            </p>
        </div>
        <template v-if="showPowers">
            <game-question-theme-select-player :players="gameStore.allOtherPlayers" v-if="showSelectPlayerToBlock"
                @close="showSelectPlayerToBlock = false" @selected="blockPlayer" />
            <div v-else class="grid grid-cols-2 gap-4 h-full">
                <u-button v-for="(value, key) in gameStore.availablePowers" @click="powers[key].click()" :key="key"
                    :disabled="value === 0 || isOnePowerSelected"
                    class="text-xl md:text-4xl justify-center scale-in-center flex flex-col"
                    :color="powers[key].selected ? 'green' : value === 0 ? 'gray' : isOnePowerSelected ? 'gray' : undefined">
                    <span class="flex gap-4 items-center">

                        <icon :name="powers[key].icon"></icon> {{ powers[key].display }}
                    </span>
                    <span class="text-5xl">
                        <template v-if="value === 0 && !powers[key].selected">
                            finito
                        </template>
                        <template v-else>
                            {{ value }}
                        </template>
                    </span>
                </u-button>
            </div>
        </template>
    </div>
</template>
