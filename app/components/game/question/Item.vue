<script setup lang="ts">
import { timeline } from "motion"
import { TransitionPresets, useTransition, executeTransition } from '@vueuse/core'
import ThemeSound from '~/assets/sounds/music-theme.mp3'

const question = defineModel()
const emits = defineEmits(['answer'])

const showQuestion = ref(false)
const imageRef = ref()
const questionRef = ref()
const showAnswers = ref(false)
const output = ref(0)
const showResult = ref(false)

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))



const onThemeFinished = async () => {
    await sleep(3000)
        showQuestion.value = true
        await nextTick()
        const sequence = [
            [imageRef.value, { opacity: [0, 1] }, { duration: 0.3 }],
            [questionRef.value, { opacity: [0, 1] }, { duration: 0.3, delay: 0.3 }]
        ]
        const controles = timeline(sequence, {})

        console.log('new question : ', question.value)

    controles.finished.then(async () => {
            await sleep(question.value.questionDuration * 1000)
            showAnswers.value = true
            await nextTick()
            const duration = question.value.answerDuration * 1000
            output.value = duration
            await executeTransition(output, 100, 0, {
                duration,
                transition: TransitionPresets.linear,
            })
            showResult.value = true

            await sleep(200)

            emits('answer', question.value.answers.filter(item => item.selected))

            // audio.pause()

        })
}

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
    <div class="gap-5 flex flex-col flex-1">
        <game-question-theme @finished="onThemeFinished" v-if="!showQuestion" v-model="question" />
        <template v-else>

            <span ref="imageRef" class=" mx-auto opacity-0 max-h-[40vh]">
                <nuxt-img v-if="question.picture" class="w-full h-full" :src="question.picture"></nuxt-img>
            </span>
            <p ref="questionRef" class="text-center text-xl md:text-5xl font-bold opacity-0">
                {{ question.display }}
            </p>
            <UProgress v-if="showAnswers" :value="output" />
            <div v-if="showAnswers" class="grid grid-cols-2 gap-4 h-full">
                <game-answer-button @select-option="selectAnwser(answer)" v-for="(answer, index) in question.answers"
                    :color="answer.selected ? 'green' : colors[index]" :answer="answer" :key="answer.id"
                    :class="isOneSelected ? { '!opacity-60': !answer.selected } : ''" />
            </div>
        </template>
    </div>
</template>
