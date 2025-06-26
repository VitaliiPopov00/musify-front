<template>
    <transition name="slide-down">
        <CustomHeader
            v-if="!isLoading"
        >
            любимые треки
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
                        <img class="playlist__header__background" src="@/assets/img/favorite_playlist_icon.jpg" alt="">
                        <div class="playlist__header__icon">
                            <img src="@/assets/img/favorite_playlist_icon.jpg" alt="">
                        </div>
                        <div class="playlist__header__info">
                            <p class="playlist__header__info__type">
                                Плейлист
                            </p>
                            <h1 class="playlist__header__info__title">
                                Мои любимые треки
                            </h1>
                            <p class="playlist__header__info__count">
                                783 трека
                            </p>
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
                                <input v-model="searchQuery" id="title" type="text" class="form__field__input">
                            </div>
                        </form>
                    </div>
                </transition>
                <transition name="playlist">
                    <Tracklist
                        v-if="!isLoading"
                        :songs="filteredSongs"
                        :toolsBtns="toolsBtns"
                        :showIndexTrack="true"
                        :showEmodziIfEmpty="true"
                        :messageIfEmpty="'Здесь пока ничего нет'"
                        @openSong="playSong"
                        @toogleFavorite="$event => favoriteSongs = favoriteSongs.filter(song => song.id !== $event.id)"
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
import { mapGetters } from 'vuex'
import favoriteIcon from '@/assets/img/heart_fill_gray.svg';
import notFavoriteIcon from '@/assets/img/heart_gray.svg';

export default {
    name: 'FavoriteSongView',
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'getCurrentSong']),
        filteredSongs() {
            if (!this.favoriteSongs) return [];
            if (!this.searchQuery) return this.favoriteSongs;

            return this.favoriteSongs.filter(song =>
                song.title.toLowerCase().includes(this.searchQuery.toLowerCase())
            );
        },
    },
    data() {
        return {
            favoriteSongs: [],
            searchQuery: '',
            isLoading: true,
            favoriteIcon,
            notFavoriteIcon,
            toolsBtns: [
                'link_to_release',
                'favorite_togle',
                'link_to_singers',
                'add_in_playlist',
            ],
        }
    },
    methods: {
        async fetchFavoriteSongs() {
            try {
                const response = await fetch(this.getFullApiUrl('api/song/user/favorite'), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    }
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.favoriteSongs = data.data.songs;
                }

                if (response.status > 399) {
                    console.log(data);
                }

            } catch (error) {
                throw error;
            } finally {
                this.isLoading = false;
            }
        },
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
    },
    mounted() {
        this.fetchFavoriteSongs();
    }
}
</script>


<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
    transition: all .5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(100%);
}

.playlist-enter-active,
.playlist-leave-active {
    transition: all .5s ease;
}

.playlist-enter-from,
.playlist-leave-to {
    opacity: 0;
    transform: translateY(10%);
}

body {
    background-color: black;
    position: relative;
    max-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

main {
    margin: 0px 20px 10px 20px;
    display: flex;
    flex: 1;
    overflow: hidden;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: .5s all ease;
    min-height: 0;
}

.main {
    flex: 1;
    min-width: 0;

    .container {
        width: 100%;
        min-height: 100%;
        background-color: #121212;
        margin-right: 30px;
        border-radius: 0px 20px 20px 0px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        justify-content: center;
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            filter: blur(15px);
        }

        .playlist__header__icon {
            max-width: 250px;
            max-height: 250px;
            position: relative;
            z-index: 2;

            img {
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 10px;
            }
        }

        .playlist__header__info {
            align-self: flex-end;
            position: relative;
            z-index: 2;

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

            .playlist__header__info__count {
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                color: #9e9e9e;
                font-size: 13px;
                letter-spacing: 1px;
                margin-bottom: 20px;
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
            font-family: 'UnboundedBold',
            sans-serif;
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
                        outline: 2px solid #78A75A;
                    }

                    &.form__field__input__invalid {
                        outline: 2px solid #BB271A;
                    }
                }

                .form__field__message {
                    color: #BB271A;
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
    height: 100%;
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
