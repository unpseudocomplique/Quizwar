import Tracker from '@openreplay/tracker';

export default defineNuxtPlugin((nuxtApp) => {
    let config = useRuntimeConfig().public


    const tracker = new Tracker({
        projectKey: config.openreplayProjectKey as string, // Remplacez par votre clé de projet OpenReplay
    });

    tracker.start();

    // Injection du tracker dans l'application Nuxt
    nuxtApp.provide('tracker', tracker);
});