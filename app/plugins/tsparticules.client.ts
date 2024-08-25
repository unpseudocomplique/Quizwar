import { defineNuxtPlugin } from '#app';
import Particles from '@tsparticles/vue3';
import { loadFull } from "tsparticles";

import { loadStarsPreset } from '@tsparticles/preset-stars';

export default defineNuxtPlugin(async (nuxtApp) => {
    nuxtApp.vueApp.use(Particles, {
        init: async (engine) => {
            await loadFull(engine);
            await loadStarsPreset(engine);
        },
    });
});