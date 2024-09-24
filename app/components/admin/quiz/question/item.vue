<script setup lang="ts">
import { computed, ref } from 'vue'

const question = defineModel<{
    questionId: string,
    quizId: string
    question: {
        id: string,
        display: string,
        picture: string,
    }
}>()

const editQuestionDisplay = ref(false)

const emits = defineEmits(['updatePicture'])

const file = ref<File | null>(null)

const isLoadingImage = ref(false)

const uploadFile = async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    isLoadingImage.value = true
    input.multiple = false
    input.click()
    input.onchange = async (e) => {
        file.value = e.target.files[0]
        const formData = new FormData()
        formData.append('files', file.value)
        const response = await $fetch(`/api/quiz/${question.value.quizId}/question/${question.value.questionId}/uploadPicture`, {
            method: 'POST',
            body: formData
        })
        emits('updatePicture', response.question.picture)
        isLoadingImage.value = false
    }
}


const editQuestion = async () => {
    const response = await $fetch(`/api/quiz/${question.value.quizId}/question/${question.value.questionId}`, {
        method: 'PATCH',
        body: {
            display: question.value.question.display
        }
    })
    editQuestionDisplay.value = false
}

</script>

<template>
    <li
        class="flex gap-4 justify-between items-center flex-wrap border border-gray-200 dark:border-gray-700 p-2 rounded-md">
        <div class="flex flex-col gap-2 grow">
            <p v-if="!editQuestionDisplay" @click="editQuestionDisplay = true">{{ question.question.display }}</p>
            <form v-else @submit.prevent="editQuestion" class="flex gap-2 flex-wrap grow">

                <u-input class="grow" v-model="question.question.display" placeholder="Question" size="xl"
                    @keyup.enter="editQuestion" />
                <u-button type="submit" color="black" label="Save" />
                <u-button @click="editQuestionDisplay = false" color="white" label="Cancel" />
            </form>
            <p class="text-gray-500 dark:text-gray-400">{{ question.question.promptPicture }}</p>
        </div>
        <transition name="scale-in-center" mode="out-in">

            <nuxt-img @click="uploadFile" v-if="question.question.picture" class="h-48"
                :src="question.question.picture" />
            <u-button :loading="isLoadingImage" v-else @click="uploadFile">Ajouter une image</u-button>
        </transition>
    </li>
</template>
