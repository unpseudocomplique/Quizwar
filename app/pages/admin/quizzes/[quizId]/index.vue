<script setup lang="ts">
import { computed, ref } from 'vue'

const route = useRoute()
const quizId = route.params.quizId as string

const { data: dataType } = useFetch(`/api/quizzes/fzfazf`, { immediate: false })

const { data } = await useFetch<typeof dataType.value>(`/api/quizzes/${quizId}`)

const quiz = ref(data.value)

const editPicture = (index: number, picture: string) => {
    quiz.value.questions[index].question.picture = picture
}

</script>

<template>
    <div class="flex flex-col gap-4 w-full p-4">
        <h1>Quiz : {{ quiz.display }}</h1>

        <ul class="flex flex-col gap-4 w-full h-full overflow-auto">
            <admin-quiz-question-item @update-picture="editPicture(index, $event)"
                v-for="(question, index) in quiz.questions" :key="question.questionId"
                v-model="quiz.questions[index]" />
        </ul>
    </div>
</template>
