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


</script>

<template>
    <li
        class="flex gap-4 justify-between items-center flex-wrap border border-gray-200 dark:border-gray-700 p-2 rounded-md">
        <div class="flex flex-col gap-2">
            <p>{{ question.question.display }}</p>
            <p class="text-gray-500 dark:text-gray-400">{{ question.question.promptPicture }}</p>
        </div>
        <transition name="scale-in-center" mode="out-in">

            <nuxt-img @click="uploadFile" v-if="question.question.picture" class="h-48"
                :src="question.question.picture" />
            <u-button :loading="isLoadingImage" v-else @click="uploadFile">Ajouter une image</u-button>
        </transition>
    </li>
</template>
