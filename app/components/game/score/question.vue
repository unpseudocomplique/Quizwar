<script setup lang="ts">
import { computed, ref } from 'vue'

const { data: gameScore } = useFetch(`/api/game/fakeId/score`, { immediate: false })

const props = defineProps<{
    answer: typeof gameScore.value['scores'][0]['answers'][0]
    display: string
}>()

const correctAnswer = computed(() => {
    return props.answer.question.answers.filter(answer => answer.isCorrect)
})

const responded = computed(() => {
    return props.answer.question.answers.filter(answerItem => props.answer.answerIds.includes(answerItem.id))
})

</script>

<template>
    <u-card>
        <p>Question : {{ display }}</p>
        <div class="flex gap-4">
            <p>Correction: </p>
            <p v-for="toAnswer in correctAnswer">{{ toAnswer.display }}</p>
        </div>
        <div class="flex gap-4">
            <p>you responded: </p>
            <p v-for="toAnswer in responded" :class="[toAnswer.isCorrect ? 'text-green-500' : 'text-red-500']">{{
                toAnswer.display }}</p>
        </div>
    </u-card>
</template>
