<template>
    <transition name="slide-down">
        <CustomHeader
            v-if="!isLoading"
        >
            Мои плейлисты
        </CustomHeader>
    </transition>
    <main
        :style="isLoading ? {
            'margin-top': '15px'
        } : {}"
    >
        <transition name="slide-right">
            <SidebarComponent
                v-if="!isLoading"
            />
        </transition>
        <section class="main">
            <div class="container">
                <transition-group name="opacity">
                    <h3
                        v-if="!isLoading"
                        class="playlists_title"
                    >
                        Мои плейлисты
                    </h3>
                    <ul
                        v-if="!isLoading"
                        class="playlists__list"
                    >
                        <li class="playlists__list__item__add">
                            <div
                                @click.prevent.stop="$router.push({ path: '/create-playlist' })"
                                @mouseover="isHoveredAddPlaylist = true"
                                @mouseleave="isHoveredAddPlaylist = false"
                                class="playlists__list__item__add__img"
                            >
                                <img
                                    :src="isHoveredAddPlaylist ? addPlaylistIconHover : addPlaylist"
                                    alt="img"
                                >
                            </div>
                        </li>
                        <li
                            v-for="playlist in playlists"
                            :key="playlist.id"
                            @click.prevent.stop="$router.push({ path: `/playlist/${playlist.id}` })"
                            class="playlists__list__item"
                        >
                            <div class="playlists__list__item__img">
                                <img
                                    :src="playlistImg(playlist)"
                                    class="img"
                                    alt="img"
                                >
                                <img
                                    @click.prevent.stop="fetchDelete(playlist.id)"
                                    class="delete"
                                    src="@/assets/img/delete_red.svg"
                                    alt="удалить"
                                >
                            </div>
                            <div class="playlists__list__item__title">
                                {{ playlist.title }}
                            </div>
                            <div class="playlists__list__item__count">
                                {{ playlist.songCount }} трека
                            </div>
                        </li>
                    </ul>
                </transition-group>
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </section>
    </main>
    <!-- <transition name="slide-up">
        <BottomPlayer v-if="getCurrentSong" />
    </transition> -->
</template>

<script>
import { mapGetters } from 'vuex';
import addPlaylistIconHover from '@/assets/img/add_circle_white.svg';
import addPlaylist from '@/assets/img/add_circle.svg';

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'getCurrentSong']),
    },
    data() {
        return {
            isLoading: true,
            isHoveredAddPlaylist: false,
            playlists: null,
            addPlaylistIconHover,
            addPlaylist,
        }
    },
    methods: {
        playlistImg(playlist) {
            return playlist.firstSingerId && playlist.firstSongId
                ? this.getFullApiUrl(`uploads/${playlist.firstSingerId}/${playlist.firstSongId}/photo.png`)
                : '/src/assets/img/default.png';
        },
        async fetchDelete(playlistId) {
            try {
                let currentValue = this.playlists;
                this.playlists = this.playlists.filter(playlist => playlist.id !== playlistId);

                const response = await fetch(this.getFullApiUrl(`api/user/playlists/${playlistId}`), {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.playlists = this.playlists.filter(playlist => playlist.id !== playlistId);
                }

                if (response.status > 399) {
                    this.playlists = currentValue;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchUserPlaylists() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/user/playlists`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.playlists = data.playlists;
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = this.playlists === null;
            }
        },
    },
    mounted() {
        this.fetchUserPlaylists();
    }
}
</script>

<style scoped>
main {
    overflow: hidden;
    transition: .5s;
}

.main {
    flex-grow: 1;
    align-self: stretch;
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #121212;

    .container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        width: 100%;
        border-radius: 0px 20px 20px 0px;
        padding-inline: 30px;

        .playlists_title {
            padding-top: 50px;
            padding-bottom: 30px;
            font-size: 30px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
        }

        .playlists__list {
            padding-block: 10px;
            display: flex;
            gap: 30px;
            flex-wrap: wrap;

            .playlists__list__item {
                cursor: pointer;

                .playlists__list__item__img {
                    width: 200px;
                    height: 200px;
                    margin-bottom: 20px;
                    position: relative;

                    img.img {
                        border-radius: 10px;
                        transition: .2s;
                        position: relative;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }

                    .delete {
                        position: absolute;
                        top: 5px;
                        right: 10px;
                        padding: 5px;
                        border-radius: 5px;
                        background-color: #DF9D9B;
                        transition: .2s;
                        opacity: 0;
                    }
                }

                &:hover>.playlists__list__item__img img.img {
                    bottom: 5px;
                    box-shadow: 0 10px 10px -1px rgba(0, 0, 0, 0.3);
                }

                &:hover>.playlists__list__item__img .delete {
                    opacity: 1;
                }

                .playlists__list__item__title {
                    font-size: 15px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;
                    margin-bottom: 10px;
                }

                .playlists__list__item__count {
                    font-size: 12px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                }
            }

            .playlists__list__item__add {
                cursor: pointer;
                align-self: flex-start;
                border: 3px dashed #9e9e9e;
                border-radius: 10px;
                transition: .2s;

                &:hover {
                    border: 3px solid #e0e0e0;
                }

                .playlists__list__item__add__img {
                    width: 200px;
                    height: 200px;
                    padding: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    img {
                        width: 50%;
                        height: 50%;
                    }
                }
            }
        }
    }
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #121212;
    flex-grow: 1;
}

.loader {
    width: 80px;
    height: 80px;
    border: 10px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    animation: rotation 1s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all .5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: all .5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translatex(-10%);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all .5s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

.opacity-enter-active,
.opacity-leave-active {
    transition: all .5s ease;
}

.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
}

.playlist-enter-active,
.playlist-leave-active {
    transition: all .5s ease;
}

.playlist-enter-from,
.playlist-leave-to {
    opacity: 0;
    transform: translateY(15%);
}
</style>
