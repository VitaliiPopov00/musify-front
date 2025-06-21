<template>
    <ul class="playlist">
        <transition-group name="opacity">
            <li
                v-if="(messageIfEmpty || showEmodziIfEmpty) && songs.length < 1"
                class="not__found"
            >
                <span
                    v-if="showEmodziIfEmpty"
                    class="not__found__emodzi"
                >
                    {{ randomEmodzi }}
                </span>
                <span v-if="messageIfEmpty" class="not__found__message">
                    {{ messageIfEmpty }}
                </span>
            </li>
            <li
                v-for="(song, index) in songs"
                :key="song.id"
                @click="openSong(song)"
                class="playlist__item"
            >
                <div class="playlist__item__track__info">
                    <div
                        v-if="showIndexTrack"
                        class="playlist__item__track__info__index"
                    >
                        #{{ (index + 1) }}
                    </div>
                    <div class="playlist__item__track__info__img">
                        <img
                            :src="getFullApiUrl(`uploads/${song.singers[0].id}/${song.id}/photo.png`)"
                            class="playlist__item__track__info__img__track"
                            alt="">
                        <img class="playlist__item__track__info__img__play"
                            src="@/assets/img/play_without_circle.svg" alt="">
                    </div>
                    <div class="playlist__item__track__info__title">
                        <a href="#" class="playlist__item__track__info__title__song">
                            {{ song.title }}
                        </a>
                        <div class="playlist__item__track__info__title__artist">
                            <a
                                v-for="singer in song.singers"
                                :key="singer.id"
                                href="#"
                            >
                                {{ singer.name }}{{ singer === song.singers[song.singers.length - 1] ? '' : ', ' }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="playlist__item__track__extra">
                    <router-link
                        v-if="releaseInfoShow"
                        :to="{
                            path: `/release/${song.release.id}`
                        }"
                        class="playlist__item__track__extra__release"
                    >
                        {{ song.release.title }}
                    </router-link>
                    <div class="playlist__item__track__count">
                        {{ song.playCount }}
                    </div>
                </div>
                <div class="playlist__item__track__tools">
                    <div
                        @click.stop="fetchFavorite(song)"
                        class="playlist__item__track__tools__favorite"
                    >
                        <img
                            :src="song.isFavorite ? favoriteIcon : notFavoriteIcon"
                            alt=""
                        >
                    </div>
                    <div class="playlist__item__track__tools__time">
                        {{ formatTime(song.duration) }}
                    </div>
                    <div
                        @click.prevent.stop="toggleMoreMenu(song)"
                        :class="{
                            'active': activeSongId === song.id
                        }"
                        class="playlist__item__track__tools__more"
                    >
                        <div class="playlist__item__track__tools__more__img">
                            <img src="@/assets/img/more_gray.svg" alt="">
                        </div>
                        <ul class="playlist__item__track__tools__more__list">
                            <li
                                v-if="toolsBtns.includes('favorite_togle')"
                                @click.prevent.stop="fetchFavorite(song)"
                                class="playlist__item__track__tools__more__list__item"
                            >
                                <img
                                    :src="song.isFavorite ? deleteFavoriteIcon : addFavoriteIcon"
                                    alt=""
                                >
                                <span>{{ song.isFavorite ? 'Удалить из любимых' : 'Добавить в любимые' }}</span>
                            </li>
                            <li
                                v-if="toolsBtns.includes('link_to_release')"
                                @click.prevent.stop="$router.push({path: `/release/${song.release.id}`})"
                                class="playlist__item__track__tools__more__list__item"
                            >
                                <img src="@/assets/img/link_grey.svg" alt="">
                                <span>Перейти к релизу</span>
                            </li>
                            <li
                                v-if="toolsBtns.includes('delete_from_playlist')"
                                @click.prevent.stop="$event => {
                                    activeSongId = null;
                                    this.$emit('deleteFromPlaylist', song.id)
                                }"
                                class="playlist__item__track__tools__more__list__item"
                            >
                                <img src="@/assets/img/playlist_remove_grey.svg" alt="">
                                <span>Удалить из этого плейлиста</span>
                            </li>
                            <li
                                v-if="toolsBtns.includes('link_to_singers')"
                                class="playlist__item__track__tools__more__list__item"
                            >
                                <img src="@/assets/img/artists_grey.svg" alt="">
                                <span>Перейти к исполнителям</span>
                                <ul class="playlist__more__sublist hover__open">
                                    <li
                                        v-for="singer in song.singers"
                                        :key="singer.id"
                                        @click.prevent.stop="$router.push({ path: `/artist/${singer.id}` })"
                                        class="playlist__more__sublist__item"
                                    >
                                        <div class="playlist__more__sublist__item__img">
                                            <img src="@/assets/img/artist_white.svg" alt="">
                                        </div>
                                        <span>{{ singer.name }}</span>
                                    </li>
                                </ul>
                            </li>
                            <li
                                v-if="toolsBtns.includes('add_in_playlist')"
                                @click.prevent.stop="handleClickAddInPlaylist"
                                @mouseenter="handleClickAddInPlaylist"
                                class="playlist__item__track__tools__more__list__item"
                            >
                                <img src="@/assets/img/playlist_add_grey.svg" alt="">
                                <span>Добавить в плейлист</span>
                                <ul class="playlist__more__sublist hover__open">
                                    <li class="playlist__more__sublist__item">
                                        <input
                                            v-model="searchUserPlaylistsQuery"
                                            type="text"
                                            placeholder="Поиск плейлиста"
                                        >
                                    </li>
                                    <li
                                        v-if="isLoadingPlaylists"
                                        class="playlist__more__sublist__item loader-container"
                                    >
                                        <div class="loader">
                                        </div>
                                    </li>
                                    <li
                                        v-for="userPlaylist in filteredPlaylists"
                                        :key="userPlaylist.id"
                                        @click.prevent.stop="fetchAddInPlaylist(userPlaylist.id, song.id)"
                                        :class="{
                                            'success__added': songsAddedInPlaylist.includes(userPlaylist.id),
                                            'error__added': songsNotAddedInPlaylist.includes(userPlaylist.id),
                                        }"
                                        class="playlist__more__sublist__item"
                                    >
                                        <div class="playlist__more__sublist__item__img">
                                            <img
                                                :src="playlistImg(userPlaylist)"
                                                alt=""
                                            >
                                        </div>
                                        <span>{{ userPlaylist.title }}</span>
                                        <transition name="slide-up">
                                            <div
                                                v-if="songsAddedInPlaylist.includes(userPlaylist.id)"
                                                class="playlist__more__sublist__item__img__success"
                                            >
                                                <img src="@/assets/img/success_green.svg" alt="aa">
                                            </div>
                                        </transition>
                                        <transition name="opacity">
                                            <div
                                                v-if="songsNotAddedInPlaylist.includes(userPlaylist.id)"
                                                class="playlist__more__sublist__item__img__error"
                                            >
                                                <img src="@/assets/img/error_red.svg" alt="aa">
                                            </div>
                                        </transition>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </li>
        </transition-group>
        <transition-group name="opacity">
            <li
            v-for="singer in singers"
            :key="singer.id"
            @click="$router.push({path: `/artist/${singer.id}`})"
            class="playlist__singer__item"
        >
            <div class="playlist__singer__item__info">
                <div class="playlist__singer__item__info__img">
                    <img src="@/assets/img/artist_white.svg" alt="singer">
                </div>
                <div class="playlist__singer__item__info__name">
                    <span class="subname">
                        Исполнитель
                    </span>
                    <span class="name">
                        {{ singer.name }}
                    </span>
                </div>
            </div>
        </li>
        </transition-group>
        <transition-group name="opacity">
            <li
            v-for="release in releases"
            :key="release.id"
            @click.prevent.stop="$router.push({ path: `/release/${release.id}` })"
            class="playlist__release__item"
        >
            <div class="playlist__release__item__info">
                <div class="playlist__release__item__info__img">
                    <img
                        :src="getFullApiUrl(`uploads/${release.firstSingerId}/${release.firstSongId}/photo.png`)"
                        alt="img"
                    >
                </div>
                <div class="playlist__release__item__info__summary">
                    <span class="subtitle">
                        Релиз
                    </span>
                    <p class="title">
                        <span class="title__release">{{ release.title }}</span>
                        <span class="singer">{{ release.firstSingerTitle }}</span>
                    </p>
                </div>
            </div>
        </li>
        </transition-group>
    </ul>
</template>

<script>
import { mapGetters } from 'vuex';
import favoriteIcon from '@/assets/img/heart_fill_gray.svg';
import notFavoriteIcon from '@/assets/img/heart_gray.svg';
import deleteFavoriteIcon from '@/assets/img/heart_minus_grey.svg';
import addFavoriteIcon from '@/assets/img/heart_plus_grey.svg';

export default {
    name: 'Tracklist',
    props: {
        showEmodziIfEmpty: {
            type: Boolean,
            required: false,
            default: false,
        },
        messageIfEmpty: {
            type: String,
            required: false,
            default: null,
        },
        toolsBtns: {
            type: Array,
            required: false,
            default: [],
        },
        songs: {
            type: Array,
            required: true
        },
        singers: {
            type: Array,
            required: false,
            default: [],
        },
        releases: {
            type: Array,
            required: false,
            default: [],
        },
        releaseInfoShow: {
            type: Boolean,
            required: false,
            default: false,
        },
        showIndexTrack: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken']),
        filteredPlaylists() {
            if (!this.userPlaylists) return [];
            if (!this.searchUserPlaylistsQuery) return this.userPlaylists;

            return this.userPlaylists.filter(song =>
                song.title.toLowerCase().includes(this.searchUserPlaylistsQuery.toLowerCase())
            );
        },
        randomEmodzi() {
            const randomIndex = Math.floor(Math.random() * this.emodzi.length);
            return this.emodzi[randomIndex];
        },
    },
    data() {
        return {
            deleteFavoriteIcon,
            addFavoriteIcon,
            favoriteIcon,
            notFavoriteIcon,
            activeSongId: null,
            showPlaylistTools: false,
            userPlaylists: null,
            searchUserPlaylistsQuery: '',
            isLoadingPlaylists: true,
            songsAddedInPlaylist: [],
            songsNotAddedInPlaylist: [],
            emodzi: [
                '(´• ω •`)ﾉ',
                '(╯°□°）╯︵ ┻━┻',
                '(；一_一)',
                '¯_(ツ)_/¯',
                '(ಠ_ಠ)',
                'ヽ(。_°)ノ',
                '(￣ω￣;)',
                '(´･_･`)',
                '(๑•́ ₃ •̀๑)',
                '(；￣Д￣)',
            ],
        }
    },
    methods: {
        openSong(song) {
            this.$emit('openSong', song);
        },
        formatTime(seconds) {
            if (!seconds) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        toggleMoreMenu(song) {
            this.activeSongId = this.activeSongId === song.id ? null : song.id;
            this.showPlaylistTools = false;
            this.songsAddedInPlaylist = [];
            this.songsNotAddedInPlaylist = [];
        },
        handleClickAddInPlaylist() {
            if (this.userPlaylists === null) {
                this.fetchUserPlaylists();
            }
        },
        playlistImg(playlist) {
            return playlist.firstSingerId && playlist.firstSongId
                ? this.getFullApiUrl(`uploads/${playlist.firstSingerId}/${playlist.firstSongId}/photo.png`)
                : '/src/assets/img/default.png';
        },
        async fetchAddInPlaylist(playlistId, songId) {
            if (this.songsAddedInPlaylist.includes(playlistId)) {
                return;
            }

            try {
                this.songsNotAddedInPlaylist = this.songsNotAddedInPlaylist.filter(id => id !== playlistId)
                this.songsAddedInPlaylist.push(playlistId);

                const response = await fetch(this.getFullApiUrl(`api/user/playlists/${playlistId}/songs`), {
                    body: JSON.stringify({'songId': songId}),
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                this.songsNotAddedInPlaylist.push(playlistId);
                this.songsAddedInPlaylist = this.songsAddedInPlaylist.filter(id => id !== playlistId);
                console.log(error);
            }
        },
        async fetchFavorite(song) {
            try {
                this.$emit('toogleFavorite', song);
                let currentValue = song.isFavorite;
                song.isFavorite = !currentValue;

                const response = await fetch(this.getFullApiUrl(`api/song/${song.id}/favorite`), {
                    method: currentValue ? 'DELETE' : 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    song.isFavorite = currentValue;
                    throw new Error(JSON.stringify(data));
                }

            } catch (error) {
                throw error;
            }
        },
        async fetchUserPlaylists() {
            if (this.userPlaylists !== null) {
                return;
            }

            try {
                this.isLoadingPlaylists = true;

                const response = await fetch(this.getFullApiUrl(`api/user/playlists`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.userPlaylists = data.playlists;
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoadingPlaylists = this.userPlaylists === null;
            }
        },
    }
}
</script>


<style scoped>
.playlist {
    border-radius: 0px 0px 20px 0px;
    padding-top: 20px;
    background-color: #121212;
    flex-grow: 1;

    .playlist__item {
        padding: 10px 0px;
        padding-left: 30px;
        padding-right: 30px;
        transition: .2s;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;

        &:hover {
            background-color: #2c2c2c;
            cursor: pointer;

            .playlist__item__track__info__img__track {
                filter: blur(1px);
            }

            .playlist__item__track__info__img__play {
                opacity: 1 !important;
            }
        }

        .playlist__item__track__info {
            display: flex;
            align-items: center;
            gap: 15px;

            .playlist__item__track__info__index {
                font-size: 15px;
                font-family: 'UnboundedBold', sans-serif;
                color: #9e9e9e;
                width: 30px;

            }

            .playlist__item__track__info__img {
                width: 45px;
                height: 45px;
                position: relative;

                .playlist__item__track__info__img__track {
                    border-radius: 5px;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: .1s;
                }

                .playlist__item__track__info__img__play {
                    position: absolute;
                    width: 30px;
                    height: 30px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0;
                    transition: .1s;
                }
            }

            .playlist__item__track__info__title {
                .playlist__item__track__info__title__song {
                    font-size: 15px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;
                    margin-bottom: 5px;
                }

                .playlist__item__track__info__title__artist {
                    display: flex;
                    font-size: 12px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;

                    a {
                        font-size: 12px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        color: #9e9e9e;
                        margin-left: 5px;

                        &:first-child {
                            margin-left: 0;
                        }
                    }
                }
            }
        }

        .playlist__item__track__extra {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 30px;

            .playlist__item__track__extra__release {
                font-size: 13px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                color: #e0e0e0;
            }

            .playlist__item__track__count {
                font-size: 13px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                color: #9e9e9e;
                letter-spacing: 1.5px;
            }
        }

        .playlist__item__track__tools {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 30px;
            max-width: 150px;
            width: 100%;

            .playlist__item__track__tools__favorite {
                width: 23px;
                height: 23px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .playlist__item__track__tools__time {
                font-size: 13px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                color: #9e9e9e;
                letter-spacing: 1.5px;
            }

            .playlist__item__track__tools__more {
                position: relative;

                .playlist__item__track__tools__more__img {
                    width: 23px;
                    height: 23px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                .playlist__item__track__tools__more__list {
                    position: absolute;
                    top: 30px;
                    right: 0;
                    display: none;
                    flex-direction: column;
                    z-index: 999;
                    width: fit-content;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
                    border-radius: 10px;

                    .playlist__item__track__tools__more__list__item {
                        padding: 7px 15px 7px 10px;
                        border-bottom: 1px solid rgba(255, 255, 255, .1);
                        transition: .2s;
                        background-color: #2c2c2c;
                        position: relative;
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        img {
                            width: 25px;
                            height: 25px;
                        }

                        span {
                            font-size: 13px;
                            font-family: 'BoundedVariable', sans-serif;
                            font-weight: 400;
                            color: #e0e0e0;
                            letter-spacing: 1.5px;
                            text-align: left;
                            white-space: nowrap;
                            text-overflow: ellipsis;
                        }

                        &:hover {
                            background-color: #5b5b5b;
                        }

                        &:first-child {
                            border-radius: 10px 10px 0px 0px;
                        }

                        &:last-child {
                            border-bottom: none;
                            border-radius: 0px 0px 10px 10px;
                        }

                        .playlist__more__sublist {
                            position: absolute;
                            top: 0px;
                            right: 100%;
                            display: flex;
                            flex-direction: column;
                            z-index: 1000;
                            width: fit-content;
                            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
                            border-radius: 10px;
                            max-height: 250px;
                            overflow-y: scroll;
                            overflow-x: hidden;

                            &.hover__open {
                                display: none;
                            }

                            .playlist__more__sublist__item {
                                font-size: 13px;
                                font-family: 'BoundedVariable', sans-serif;
                                font-weight: 400;
                                color: #e0e0e0;
                                letter-spacing: 1.5px;
                                padding: 7px 7px;
                                border-bottom: 1px solid rgba(255, 255, 255, .1);
                                text-align: left;
                                transition: .2s;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                background-color: #2c2c2c;
                                position: relative;
                                display: flex;
                                align-items: center;
                                justify-content: flex-start;
                                gap: 10px;

                                .playlist__more__sublist__item__img {
                                    width: 25px;
                                    height: 25px;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                        overflow: hidden;
                                        border-radius: 5px;
                                    }
                                }

                                &:hover {
                                    background-color: #5b5b5b;
                                }

                                &:first-child {
                                    border-radius: 10px 10px 0px 0px;
                                }

                                &:last-child {
                                    border-bottom: none;
                                    border-radius: 0px 0px 10px 10px;
                                }

                                .playlist__more__sublist__item__img__success {
                                    display: none;
                                    margin-left: auto;
                                    height: 25px;
                                    aspect-ratio: 1 / 1;
                                    align-items: center;
                                    justify-content: center;
                                    z-index: 999;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;
                                    }
                                }

                                .playlist__more__sublist__item__img__error {
                                    display: none;
                                    margin-left: auto;
                                    height: 25px;
                                    aspect-ratio: 1 / 1;
                                    align-items: center;
                                    justify-content: center;
                                    z-index: 999;

                                    img {
                                        width: 100%;
                                        height: 100%;
                                        object-fit: cover;
                                    }
                                }

                                &.success__added {
                                    .playlist__more__sublist__item__img__success {
                                        display: block;
                                    }
                                }

                                &.error__added {
                                    .playlist__more__sublist__item__img__error {
                                        display: block;
                                    }
                                }

                                &:has(input) {
                                    input {
                                        font-family: 'BoundedVariable', sans-serif;
                                        font-weight: 400;
                                        font-size: 13px;
                                        color: #e0e0e0;
                                        padding: 7px 7px;
                                        transition: all 0.2s;
                                        border: 1px solid rgba(255, 255, 255, .1);
                                        border-radius: 3px;
                                    }
                                }

                                &.loader-container {
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    background-color: #2c2c2c;

                                    .loader {
                                        width: 20px;
                                        height: 20px;
                                        border: 3px solid #9e9e9e;
                                        border-bottom-color: transparent;
                                        border-radius: 50%;
                                        animation: rotation 1s linear infinite;
                                    }
                                }
                            }
                        }

                        &:hover {
                            .hover__open {
                                display: block;
                            }
                        }
                    }
                }

                &.active {
                    .playlist__item__track__tools__more__list {
                        display: flex;
                    }
                }
            }
        }
    }

    .playlist__singer__item {
        padding: 10px 30px;
        transition: .2s;

        &:hover {
            background-color: #2c2c2c;
            cursor: pointer;
        }

        .playlist__singer__item__info {
            display: flex;
            align-items: center;
            gap: 15px;
            .playlist__singer__item__info__img {
                width: 40px;
                height: 40px;

                img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .playlist__singer__item__info__name {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;

                .subname {
                    font-size: 12px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                }

                .name {
                    font-size: 20px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;
                }
            }
        }
    }

    .playlist__release__item {
        padding: 10px 30px;
        transition: .2s;

        &:hover {
            background-color: #2c2c2c;
            cursor: pointer;
        }

        .playlist__release__item__info {
            display: flex;
            align-items: center;
            gap: 15px;

            .playlist__release__item__info__img {
                width: 45px;
                height: 45px;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                    object-fit: cover;
                }
            }

            .playlist__release__item__info__summary {
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 5px;

                .subtitle {
                    font-size: 12px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                }

                .title {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;

                    .title__release {
                        font-size: 20px;
                        font-family: 'UnboundedBold', sans-serif;
                        color: #e0e0e0;
                    }

                    .singer {
                        font-size: 12px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        color: #9e9e9e;
                    }
                }
            }
        }
    }
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.not__found {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .not__found__emodzi {
        font-size: 120px;
        font-family: 'UnboundedBold', sans-serif;
        color: #9e9e9e;
        margin-bottom: 50px;
    }

    .not__found__message {
        font-family: 'BoundedVariable', sans-serif;
        font-size: 15px;
        color: #9e9e9e;
        margin-bottom: 20px;
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all .3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(10%);
}

.opacity-enter-active,
.opacity-leave-active {
    transition: all .5s ease;
}

.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
}
</style>
