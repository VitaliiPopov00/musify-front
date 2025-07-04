<template>
    <transition name="slide-down">
        <CustomHeader
            v-if="!isLoading"
        >
            {{ artist.name }}
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
                <transition name="opacity">
                    <div
                        v-if="!isLoading"
                        class="playlist__header"
                    >
                        <div class="playlist__header__background"></div>
                        <div class="playlist__header__info">
                            <p class="playlist__header__info__type">
                                Треки исполнителя
                            </p>
                            <h1 class="playlist__header__info__title">
                                {{ artist.name }}
                            </h1>
                            <div class="playlist__header__info__summary">
                                <router-link
                                    :to="{ path: `/artist/${artist.id}` }"
                                    class="playlist__header__info__summary__artist"
                                >
                                    <div class="playlist__header__info__summary__artist__img">
                                        <img src="@/assets/img/artist_white.svg" alt="artist">
                                    </div>
                                    <span href="#">{{ artist.name }}</span>
                                </router-link>
                                <p class="playlist__header__info__summary__count">
                                    | {{ artistSongs.length }} трека |
                                </p>
                                <p class="playlist__header__info__summary__count">
                                    {{ totalDuration }}
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
                <transition name="opacity">
                    <div
                        v-if="!isLoading"
                        class="playlist__tools"
                    >
                        <button 
                            @click="playAll"
                            class="playlist__tools__start"
                        >
                            <img src="@/assets/img/play_without_circle_black.svg" alt="">
                            Слушать
                        </button>
                        <form class="playlist__tools__search" action="#">
                            <div class="form__field">
                                <label for="title" class="form__field__label">
                                    Поиск трека
                                </label>
                                <input
                                    v-model.trim="searchQuery"
                                    id="title"
                                    type="text"
                                    class="form__field__input"
                                >
                            </div>
                        </form>
                    </div>
                </transition>
                <transition name="playlist">
                    <Tracklist
                        v-if="!isLoading"
                        :songs="filteredSongs"
                        :toolsBtns="toolsBtns"
                        :showEmodziIfEmpty="true"
                        :messageIfEmpty="'Здесь пока ничего нет'"
                        @openSong="playSong"
                    />
                </transition>
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
import favoriteIcon from '@/assets/img/heart_fill_gray.svg';
import notFavoriteIcon from '@/assets/img/heart_gray.svg';

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'getCurrentSong', 'getSingerId']),
        filteredSongs() {
            if (!this.artistSongs) return [];
            if (!this.searchQuery) return this.artistSongs;

            return this.artistSongs.filter(song =>
                song.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
        randomGradient() {
            const randomIndex = Math.floor(Math.random() * this.gradients.length);
            return this.gradients[randomIndex];
        },
        totalDuration() {
            if (!this.artistSongs) return '0:00';

            const totalSeconds = this.artistSongs.reduce((acc, song) => acc + song.duration, 0);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;

            return `${minutes} минут ${seconds.toString().padStart(2, '0')} секунд`;
        },
        artistIsUserArtist() {
            return this.getSingerId === parseInt(this.$route.params.id);
        },
        toolsBtns() {
            const baseBtns = [
                'link_to_release',
                'favorite_togle',
                'link_to_singers',
                'add_in_playlist',
            ];
            
            if (this.artistIsUserArtist) {
                baseBtns.push('delete_song');
            }
            
            return baseBtns;
        },
    },
    data() {
        return {
            artist: null,
            artistSongs: null,
            isLoading: true,
            favoriteIcon,
            notFavoriteIcon,
            searchQuery: '',
            gradients: [
                'linear-gradient(45deg, #2d1b4d, #4a2b7a, #2d1b4d)',
                'linear-gradient(45deg, #1a1f3d, #2a3b6a, #1a1f3d)',
                'linear-gradient(45deg, #2d1a1a, #4a2b2b, #2d1a1a)',
                'linear-gradient(45deg, #1a2d1a, #2d4a2d, #1a2d1a)',
                'linear-gradient(45deg, #2d2d1a, #4a4a2b, #2d2d1a)',
                'linear-gradient(45deg, #1a2d2d, #2d4a4a, #1a2d2d)',
                'linear-gradient(45deg, #2d1a2d, #4a2b4a, #2d1a2d)',
                'linear-gradient(45deg, #1a2d3d, #2d4a6a, #1a2d3d)',
                'linear-gradient(45deg, #2d1a1f, #4a2b3d, #2d1a1f)',
                'linear-gradient(45deg, #1a2d2b, #2d4a47, #1a2d2b)'
            ]
        }
    },
    methods: {
        playSong(song) {
            this.$store.dispatch('setCurrentSong', song);
        },
        playAll() {
            if (this.filteredSongs.length > 0) {
                this.$store.dispatch('clearPreviousSongs');
                this.$store.dispatch('setSongsQueue', this.filteredSongs.slice(1));
                this.$store.dispatch('setCurrentSong', this.filteredSongs[0]);
            }
        },
        async fetchArtistSongs() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/singer/${this.$route.params.id}/songs`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.artistSongs = data.data.songs;
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = this.artistSongs === null || this.artist === null;
            }
        },
        async fetchArtistInfo() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/singer/${this.$route.params.id}`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.artist = data.data;
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = this.artistSongs === null || this.artist === null;
            }
        },
    },
    mounted() {
        this.fetchArtistInfo();
        this.fetchArtistSongs();
    },
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
    overflow: scroll;
    background-color: #121212;

    .container {
        display: flex;
        flex-direction: column;
        min-height: 100%;
        width: 100%;
        border-radius: 0px 20px 20px 0px;
    }

    .playlist__header {
        border-radius: 0px 20px 0px 0px;
        overflow: hidden;
        padding: 50px 0px 30px 30px;
        display: flex;
        gap: 40px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        background-color: transparent;
        overflow: hidden;

        .playlist__header__background {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            background: v-bind(randomGradient);
        }

        .playlist__header__icon {
            max-width: 250px;
            max-height: 250px;

            img {
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }
        }

        .playlist__header__info {
            z-index: 2;
            align-self: flex-end;

            .playlist__header__info__type {
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                color: #e0e0e0;
                font-size: 16px;
                margin-bottom: 20px;
            }

            .playlist__header__info__title {
                margin: 0;

                font-size: 60px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 700;
                color: #e0e0e0;
                letter-spacing: 1px;
                margin-bottom: 20px;
            }

            .playlist__header__info__summary {
                display: flex;
                align-items: center;
                gap: 7px;

                .playlist__header__info__summary__artist {
                    display: flex;
                    align-items: center;
                    gap: 7px;

                    .playlist__header__info__summary__artist__img {
                        width: 30px;
                        height: 30px;
                        overflow: hidden;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }

                    span {
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        color: #e0e0e0;
                        font-size: 13px;
                        letter-spacing: 1px;
                    }
                }

                .playlist__header__info__summary__count {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                    font-size: 13px;
                    letter-spacing: 1px;
                }
            }
        }
    }

    .playlist__tools {
        padding-left: 30px;
        background-color: #121212;
        padding-top: 20px;
        padding-bottom: 20px;

        display: flex;
        gap: 40px;
        align-items: center;

        .playlist__tools__start {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            border: none;

            img {
                width: 30px;
                height: 30px;
            }

            font-size: 14px;
            font-family: 'UnboundedBold', sans-serif;
            font-weight: 400;
            color: #333333;
            padding: 10px 15px;
            border-radius: 9999px;
        }

        .playlist__tools__search {
            display: flex;
            flex-direction: column;
            gap: 35px;
            width: 100%;
            max-width: 350px;

            .form__field {
                display: flex;
                flex-direction: column;
                position: relative;

                &:has(input:focus) {
                    .form__field__label {
                        display: none;
                    }
                }

                .form__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                    font-size: 16px;
                    margin-bottom: 5px;
                    letter-spacing: 1px;
                    position: absolute;
                    top: 50%;
                    left: 15px;
                    transform: translate(0, -50%);
                }

                .form__field__input {
                    box-sizing: border-box;
                    outline: 1px solid #e0e0e0;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    border-radius: 10px;
                    transition: all 0.2s;

                    &:hover {
                        outline: 2px solid #e0e0e0;
                    }

                    &:focus {
                        outline: 2px solid #e0e0e0;
                    }

                    &.form__field__input__success {
                        outline: 2px solid rgba(0, 128, 0, 0.45);
                    }

                    &.form__field__input__invalid {
                        outline: 2px solid rgba(255, 69, 58, 0.75);
                    }
                }

                .form__field__message {
                    color: rgba(255, 69, 58, 0.75);
                    font-size: 13px;
                    margin-top: 10px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                }
            }

            .form__button {
                margin-top: 15px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                background-color: #e0e0e0;
                border: none;
                padding: 20px;
                letter-spacing: 1px;
                border-radius: 15px;
                transition: .2s;
                color: #333333;

                &:hover {
                    border-radius: 10px;
                }
            }

            .line {
                height: 1px;
                background-color: #5b5b5b;
                margin-top: 10px;
                width: 120%;
                align-self: center;
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
