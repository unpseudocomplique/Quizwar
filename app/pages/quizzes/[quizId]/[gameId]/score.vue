<script setup lang="ts">
const route = useRoute()

const gameId = route.params.gameId as string
</script>

<template>
    <UDashboardPage>
        <UDashboardPanel grow>
            <UDashboardNavbar title="Résultats de la partie">
            </UDashboardNavbar>
            <UDashboardPanelContent>
                <game-score :game-id="gameId" />
            </UDashboardPanelContent>
        </UDashboardPanel>
    </UDashboardPage>
</template>
