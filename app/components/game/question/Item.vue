<script setup lang="ts">
import { timeline } from "motion"
import { TransitionPresets, useTransition, executeTransition } from '@vueuse/core'
import ThemeSound from '~/assets/sounds/music-theme.mp3'

const question = defineModel()
const emits = defineEmits(['answer'])

const imageRef = ref()
const questionRef = ref()
const showAnswers = ref(false)
const output = ref(0)
const showResult = ref(false)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))


onMounted(() => {

    const sequence = [
        [imageRef.value, { opacity: [0, 1] }, { duration: 0.3 }],
        [questionRef.value, { opacity: [0, 1] }, { duration: 0.3, delay: 0.3 }]
    ]
    const audio = new Audio(ThemeSound)
    audio.loop = true

    audio.play()
    const controles = timeline(sequence, {})



    controles.finished.then(async () => {
        await sleep(question.value.questionDuration * 1000)
        showAnswers.value = true
        const duration = question.value.answerDuration * 1000
        output.value = duration
        await executeTransition(output, 100, 0, {
            duration,
            transition: TransitionPresets.linear,
        })
        showResult.value = true

        emits('answer', question.value.answers.find(item => item.selected))

        audio.pause()

    })
})

const isOneSelected = computed(() => {
    return question.value.answers.some(item => item.selected)
})

const colors = [
    'yellow',
    'blue',
    'purple',
    'orange'
]

const selectAnwser = (answer) => {
    question.value.answers.forEach(item => {
        item.selected = answer.id === item.id
    });
}


</script>

<template>
    <u-card class="h-full" :ui="{ body: { base: 'h-full' }, padding: 'px-4 py-5 sm:p-6' }">
        <div class="gap-5 flex flex-col h-full" v-auto-animate>
            <span ref="imageRef" class=" mx-auto opacity-0 max-h-[50vh]">
                <nuxt-img class="w-full h-full" :src="question.picture"></nuxt-img>
            </span>
            <p ref="questionRef" class="text-center text-5xl font-bold opacity-0">
                {{ question.display }}
            </p>
            <UProgress v-if="showAnswers" :value="output" />
            <div v-if="showAnswers" class="grid grid-cols-2 gap-4 h-full">
                <game-answer-button @select-option="selectAnwser(answer)" v-for="(answer, index) in question.answers"
                    :color="answer.selected ? 'green' : colors[index]" :answer="answer" :key="answer.id"
                    :class="isOneSelected ? { '!opacity-60': !answer.selected } : ''" />
            </div>
        </div>
    </u-card>
</template>
