<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TGamePlayerAnswers } from '~~/types/game';

const { user } = useUserSession()

const props = defineProps<{
    answer: TGamePlayerAnswers[0]
    display: string
}>()

const usedDouble = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.DOUBLE_POINTS && power.originPlayerId === user.value.id)
})

const stolePoint = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.STEAL_POINTS && power.originPlayerId === user.value.id)
})

const stolenPoints = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.STEAL_POINTS && power.targetPlayerId === user.value.id)
})

const usedFiftyFifty = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.FIFTY_FIFTY && power.originPlayerId === user.value.id)
})

const hasBeenBlocked = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.BLOCK && power.targetPlayerId === user.value.id)
})

const blockedSomeone = computed(() => {
    return props.answer.question.UsedPower.filter(power => power.power === PowerType.BLOCK && power.originPlayerId === user.value.id)
})

const correctAnswer = computed(() => {
    return props.answer.question.answers.filter(answer => answer.isCorrect)
})

const responded = computed(() => {
    return props.answer.question.answers.filter(answerItem => props.answer.answerIds.includes(answerItem.id))
})

</script>

<template>
    <u-card>
        <div class="flex justify-between items-center">
            <div class="flex flex-col gap-2">

                <p>Question : {{ answer.question.display }}</p>
                <div class="flex gap-4">
                    <p>Correction: </p>
                    <p v-for="toAnswer in correctAnswer">{{ toAnswer.display }}</p>
                </div>
                <div class="flex gap-4">
                    <p>you responded: </p>
                    <p v-for="toAnswer in responded" :class="[toAnswer.isCorrect ? 'text-green-500' : 'text-red-500']">
                        {{
                            toAnswer.display }}</p>
                </div>
            </div>
            <div>
                <UBadge v-if="usedDouble.length" variant="soft" class="select-none">
                    Doublé bebew 🤑
                </UBadge>
                <UBadge v-if="stolePoint.length" variant="soft" class="select-none">
                    J'ai volé de points 💰 (peut être)
                </UBadge>
                <u-badge v-if="stolenPoints.length" variant="soft" class="select-none">
                    Je me suis fait voler de points 😭
                    <template v-if="stolenPoints.length > 1">
                        ({{ stolenPoints.length }} fois)
                    </template>
                </u-badge>

                <UBadge v-if="usedFiftyFifty.length" variant="soft" class="select-none">
                    50/50 🔎
                </UBadge>
                <UBadge v-if="hasBeenBlocked.length" variant="soft" class="select-none">
                    Je me suis fait bloqué 🛑
                </UBadge>
                <UBadge v-if="blockedSomeone.length" variant="soft" class="select-none">
                    J'ai bloqué quelqu'un 👿
                </UBadge>
            </div>
        </div>
    </u-card>
</template>
