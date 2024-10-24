<script setup lang="ts">
import { timeline } from "motion"
import { PowerType } from '~/stores/game'

const question = defineModel()
const gameStore = useGameStore()
const { user } = useUserSession()

const emits = defineEmits(['finished'])

const GameRoom = inject('GameRoom') as InstanceType<typeof Room>
const containerTheme = ref()
const labelTheme = ref()
const valueTheme = ref()
const showPowers = ref(false)
const showSelectPlayerToBlock = ref(false)
const showSelectPlayerToStealPoints = ref(false)

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
    const powerTemp = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
        method: 'POST',
        body: { power: PowerType.BLOCK, targetPlayerId: player.id },

    })
    const power = {
        ...powerTemp,
        createdAt: new Date(powerTemp.createdAt)
    }

    gameStore.usedPowers.push(power)
    GameRoom.usePower(power)
}

const stealPoints = async (player) => {
    showSelectPlayerToStealPoints.value = false
    powers.value[PowerType.STEAL_POINTS].selected = true
    const powerTemp = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
        method: 'POST',
        body: { power: PowerType.STEAL_POINTS, targetPlayerId: player.id }
    })
    const power = {
        ...powerTemp,
        createdAt: new Date(powerTemp.createdAt)
    }

    gameStore.usedPowers.push(power)
    GameRoom.usePower(power)
}

const powers = ref({
    [PowerType.FIFTY_FIFTY]: {
        display: '50/50',
        description: 'Vous enlevez 2 mauvaises réponses des choix proposés.',
        icon: 'i-noto-detective',
        click: async () => {
            const powerTemp = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
                method: 'POST',
                body: { power: PowerType.FIFTY_FIFTY }
            })
            const power = {
                ...powerTemp,
                createdAt: new Date(powerTemp.createdAt)
            }

            gameStore.usedPowers.push(power)
            GameRoom.usePower(power)
            powers.value[PowerType.FIFTY_FIFTY].selected = true
        },
        selected: false

    },
    [PowerType.STEAL_POINTS]: {
        display: 'Vol de points',
        description: 'Choisissez votre cible et volez les points optenus a la fin de la question.',
        icon: 'i-noto-ninja',
        selected: false,
        click: async () => {
            showSelectPlayerToStealPoints.value = true
        },
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
        selected: false,
        click: async () => {
            const powerTemp = await $fetch(`/api/game/${gameStore.game.id}/question/${question.value.id}/usePower`, {
                method: 'POST',
                body: { power: PowerType.DOUBLE_POINTS }
            })

            const power = {
                ...powerTemp,
                createdAt: new Date(powerTemp.createdAt)
            }

            gameStore.usedPowers.push(power)
            GameRoom.usePower(power)
            powers.value[PowerType.DOUBLE_POINTS].selected = true
        },
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
            <game-question-theme-select-player :players="gameStore.allOtherPlayers" v-if="showSelectPlayerToStealPoints"
                @close="showSelectPlayerToStealPoints = false" @selected="stealPoints" />
            <div v-else class="grid grid-cols-2 gap-4 h-full">
                <u-button v-for="(value, key) in gameStore.availablePowers" @click="powers[key].click()" :key="key"
                    :disabled="value === 0 || isOnePowerSelected"
                    class="text-xl md:text-4xl justify-center scale-in-center flex flex-col"
                    :color="powers[key].selected ? 'green' : value === 0 ? 'gray' : isOnePowerSelected ? 'gray' : undefined">
                    <span class="flex gap-4 items-center">

                        <Icon :name="powers[key].icon"/> {{ powers[key].display }}
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
