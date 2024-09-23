<script setup lang="ts">
import { computed, ref,useTemplateRef } from 'vue'

import { useFloating, autoPlacement, flip, shift, hide } from '@floating-ui/vue';
const question = defineModel()

const reference = useTemplateRef('reference')
const floating = useTemplateRef('floating')


const isHidden = ref(true)

const { floatingStyles, update, placement } = useFloating(reference, floating, {
    middleware: [
        autoPlacement({

            elementContext: 'floating'
        }),

        shift({

        })

    ],
});

const hideItem = () => {
    isHidden.value = true;
}

const show = () => {
    isHidden.value = false;
}

</script>

<template>
    <div ref="reference" @blur="hideItem" @focus="show" @mouseenter="show" @mouseleave="hideItem"
        class="w-32 rounded-lg h-6 bg-gray-200 dark:bg-gray-700 cursor-pointer relative">


        <u-card class="z-10 w-96" ref="floating" :style="{
            ...floatingStyles,
            transform: `${floatingStyles.transform} translateX(-100%)`,
            display: isHidden ? 'none' : 'block',
        }">
            <div class="flex flex-col gap-2">
                <!-- <u-card>
                    <template #header>
                        <UBlogPost title="x5" description="Les questions rapportent 5x plus de points"
                            class="cursor-pointer" />
                    </template>
</u-card> -->
                <u-card>
                    <!-- <template #header>
                        <UBlogPost title="Fastpass"
                            description="3 points pour le premier, 1 pour le deuxième, 1 pour le 3ème et -1 pour les suivants."
                            class="cursor-pointer" />
                    </template> -->
                    <pre>
                    {{ floatingStyles }}
        
                    </pre>
                    <pre>
                        {{  placement  }}
                    </pre>
                </u-card>
            </div>
        </u-card>
    </div>
</template>
