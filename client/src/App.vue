<script lang="ts">
import TraxEditor from "./assets/components/trax/TraxEditor.vue";
import Games from "./assets/components/games/Games.vue";
import TraxPlaylist from "./assets/components/trax/TraxPlaylist.vue";
import { Services } from "@/services/Services";

export default {
    components: { TraxEditor, Games, TraxPlaylist },
    mounted() {
        Services.getInstance();
    },
};
</script>

<template>
    <div class="position-absolute">
        <template v-if="$store.state.config">
            <TraxEditor />
            <TraxPlaylist v-if="$store.state.trax.playingSong" />
            <Games />
        </template>
    </div>
</template>