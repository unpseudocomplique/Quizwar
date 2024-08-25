<script setup lang="ts">
import { computed, ref } from 'vue'

withDefaults(defineProps<{
    answer: {
        id: string,
        display: string,
        selected: boolean
    },
    color?: string
    disabled?: boolean
}>(), {
    color: 'blue',
    disabled: false
})

defineEmits(['selectOption'])

</script>

<template>
    <UButton :disabled="disabled" @click="$emit('selectOption')"
        class="text-xl md:text-4xl flex justify-center scale-in-center" :color="color">
        {{ answer.display }}
    </UButton>
</template>
