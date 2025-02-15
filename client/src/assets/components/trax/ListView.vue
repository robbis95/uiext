<script>
import { CommunicationManager } from "@/communication/CommunicationManager";
import {
    TogglePlaylistComposer,
    ModifyPlaylistComposer,
    RequestCollectionsComposer,
    RequestPlaylistComposer,
    DeleteSongComposer,
    BurnSongComposer,
    RequestSongsComposer,
} from "@/communication/outgoing";
export default {
    props: ["tuned", "timeInSeconds"],
    data() {
        return {
            songs: null,
            changed: false,
            selected: {
                name: "The Habhop",
                length: "817",
            },
        };
    },
    mounted() {
        CommunicationManager.getInstance().sendMessage(
            new RequestSongsComposer()
        );
        CommunicationManager.getInstance().sendMessage(
            new RequestCollectionsComposer()
        );
        CommunicationManager.getInstance().sendMessage(
            new RequestPlaylistComposer()
        );
        this.$store.state.trax.editing = null;
    },
    unmounted() {
        this.$emit("stop");
    },
    methods: {
        create() {
            this.$emit("toggleEditor");
        },
        burn() {
            if (!this.selected.id) return;
            CommunicationManager.getInstance().sendMessage(
                new BurnSongComposer(this.selected.id)
            );
        },
        editSong() {
            if (!this.selected.id) return;
            this.$store.state.trax.editing = this.selected;
            this.$emit("toggleEditor");
        },
        deleteSong() {
            if (!this.selected.id) return;
            CommunicationManager.getInstance().sendMessage(
                new DeleteSongComposer(this.selected.id)
            );
            this.selected = {
                name: "The Habhop",
                length: "817",
            };
            this.changed = false;
        },
        preview() {
            if (this.tuned) this.$emit("stop");
            else this.$emit("play", this.selected.track);
        },
        addToPlaylist(id) {
            CommunicationManager.getInstance().sendMessage(
                new ModifyPlaylistComposer(id)
            );
        },
        removeFromPlaylist(id) {
            CommunicationManager.getInstance().sendMessage(
                new ModifyPlaylistComposer(id, true)
            );
        },
        toggleJukebox() {
            CommunicationManager.getInstance().sendMessage(
                new TogglePlaylistComposer()
            );
        },
        selectSong(select) {
            this.selected = select;
            this.changed = true;
            this.$emit("preload", select.track);
        },
    },
};
</script>

<template>
    <div class="d-flex flex-row h-100">
        <div class="w-100 me-1 h-100 d-flex flex-column">
            <div
                class="h-100 overflow-y-scroll pe-1 mb-1"
                v-if="$store.state.trax.songs && $store.state.trax.songs.length"
            >
                <div
                    class="d-flex flex-row w-100 mb-1"
                    v-for="(r, i) in $store.state.trax.songs"
                    :key="i"
                >
                    <UIExtButton
                        class="w-100"
                        :class="{'isburneddisc':r.disc}"
                        :theme="$store.state.config.trax.lists"
                        :caption="r.name"
                        @clicked="selectSong(r)"
                    />
                    <UIExtButton
                        :theme="$store.state.config.trax.buttons"
                        caption="<i class='fas fa-angle-double-right'></i>"
                        @clicked="addToPlaylist(r.id)"
                        colour="success"
                        class="ms-1 px-1"
                    />
                </div>
            </div>
            <div class="w-100 me-1 h-100 mb-1" v-else>{{$filters.translate('trax.window.no_songs')}}</div>
            <UIExtButton
                :theme="$store.state.config.trax.buttons"
                :caption="$filters.translate('trax.window.create')"
                @clicked="create()"
                colour="dark"
            />
            <UIExtButton
                :theme="$store.state.config.trax.buttons"
                :caption="$store.state.trax.playlist.playing ? $filters.translate('trax.window.stopPlaylist') : $filters.translate('trax.window.playPlaylist')"
                @clicked="toggleJukebox()"
                :colour="$store.state.trax.playlist.playing ? 'danger' : 'success'"
                class="mt-1"
            />
        </div>
        <div class="uiExtSplitter-ver" />
        <div class="w-100 align-self-center h-100 d-flex flex-column">
            <div class="h-100 overflow-y-scroll pe-1" v-if="$store.state.trax.playlist.songs">
                <div
                    class="d-flex flex-row w-100 mb-1"
                    v-for="(r, i) in $store.state.trax.playlist.songs"
                    :key="i"
                >
                    <UIExtButton
                        class="me-1"
                        :class="{'isburneddisc':r.disc}"
                        :theme="$store.state.config.trax.buttons"
                        caption="<i class='fas fa-angle-double-left'></i>"
                        @clicked="removeFromPlaylist(r.id)"
                        colour="danger"
                    />
                    <UIExtButton
                        class="w-100 text-truncate"
                        :theme="$store.state.config.trax.lists"
                        :caption="r.song.name"
                        @clicked="selectSong(r.song)"
                    />
                </div>
            </div>
            <div class="uiExtSplitter-hor" />
            <UIExtBorder
                :theme="$store.state.config.trax.borders"
                class="p-1 text-center mb-1"
                ref="tracker"
            >
                <b class="d-block">{{ selected.name }}</b>
                {{ $filters.secondsDuration(tuned ? timeInSeconds : selected.length) }}
                <div class="d-flex flex-row">
                    <UIExtButton
                        :theme="$store.state.config.trax.buttons"
                        :caption="$filters.translate('trax.window.preview')"
                        @clicked="preview()"
                        colour="success"
                        v-if="!tuned"
                        :class="{'uiExt-button-disabled':!changed}"
                        class="w-100"
                    />
                    <UIExtButton
                        :theme="$store.state.config.trax.buttons"
                        :caption="$filters.translate('trax.window.stop')"
                        @clicked="preview()"
                        colour="danger"
                        class="w-100"
                        v-else
                    />
                </div>
            </UIExtBorder>
            <div class="d-flex flex-row justify-content-between" v-if="!selected.disc">
                <UIExtButton
                    :class="{'uiExt-button-disabled':!changed}"
                    :theme="$store.state.config.trax.buttons"
                    caption="<i class='far fa-trash-alt'></i>"
                    @clicked="deleteSong()"
                    colour="danger"
                    class="w-100"
                />
                <UIExtButton
                    :class="{'uiExt-button-disabled':!changed}"
                    :theme="$store.state.config.trax.buttons"
                    caption="<i class='fas fa-edit'></i>"
                    @clicked="editSong()"
                    colour="warning"
                    class="w-100 mx-1"
                />
                <UIExtButton
                    :class="{'uiExt-button-disabled':!changed}"
                    :theme="$store.state.config.trax.buttons"
                    caption="<i class='fas fa-compact-disc'></i>"
                    @clicked="burn()"
                    colour="success"
                    class="w-100"
                />
            </div>
        </div>
    </div>
</template>