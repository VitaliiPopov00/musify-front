<template>
    <CustomHeader>
        любимые треки
    </CustomHeader>
    <main>
        <SidebarComponent />
        <section class="main">
            <div class="container">
                <div class="playlist__header">
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
                <div class="playlist__tools">
                    <button class="playlist__tools__start">
                        <img src="@/assets/img/play_without_circle_black.svg" alt="">
                        Слушать
                    </button>
                    <form class="playlist__tools__search" action="#">
                        <div class="form__field">
                            <label for="title" class="form__field__label">
                                Поиск трека
                            </label>
                            <input id="title" type="text" class="form__field__input">
                        </div>
                    </form>
                </div>
                <transition name="playlist">
                    <ul v-if="!isLoading" class="playlist">
                        <li v-for="song in favoriteSongs" class="playlist__item" @click="playSong(song)">
                            <div class="playlist__item__track__info">
                                <div class="playlist__item__track__info__img">
                                    <img class="playlist__item__track__info__img__track"
                                        :src="getFullApiUrl(`uploads/${song.singers[0].id}/${song.id}/photo.png`)"
                                        alt="">
                                    <img class="playlist__item__track__info__img__play"
                                        src="@/assets/img/play_without_circle.svg" alt="">
                                </div>
                                <div class="playlist__item__track__info__title">
                                    <a href="#" class="playlist__item__track__info__title__song">
                                        {{ song.title }}
                                    </a>
                                    <div class="playlist__item__track__info__title__artist">
                                        <a v-for="singer in song.singers" :key="singer.id" href="#">
                                            {{ singer.name }}{{ singer === song.singers[song.singers.length - 1] ? '' :
                                                ', ' }}
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="playlist__item__track__tools">
                                <div class="playlist__item__track__tools__favorite" @click.stop="fetchFavorite(song)">
                                    <img :src="song.isFavorite ? favoriteIcon : notFavoriteIcon" alt="">
                                </div>
                                <div class="playlist__item__track__tools__time">
                                    {{ formatTime(song.duration) }}
                                </div>
                                <div class="playlist__item__track__tools__more">
                                    <img src="@/assets/img/more_gray.svg" alt="">
                                </div>
                            </div>
                        </li>
                    </ul>
                </transition>
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </section>
    </main>
    <transition name="slide-up">
        <BottomPlayer v-if="currentSong" :song="currentSong" />
    </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import favoriteIcon from '@/assets/img/heart_fill_gray.svg';
import notFavoriteIcon from '@/assets/img/heart_gray.svg';

export default {
    name: 'FavoriteSongView',
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken'])
    },
    data() {
        return {
            favoriteSongs: [],
            currentSong: null,
            isLoading: true,
            favoriteIcon,
            notFavoriteIcon
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
        async fetchFavorite(song) {
            try {
                const response = await fetch(this.getFullApiUrl(`api/song/${song.id}/favorite`), {
                    method: song.isFavorite ? 'DELETE' : 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    song.isFavorite = !song.isFavorite;
                    if (!song.isFavorite) {
                        this.favoriteSongs = this.favoriteSongs.filter(s => s.id !== song.id);
                    }
                    console.log(data);
                }

                if (response.status > 399) {
                    console.log(data);
                }

            } catch (error) {
                throw error;
            }
        },
        playSong(song) {
            this.currentSong = song;
        },
        formatTime(seconds) {
            if (!seconds) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
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
}

main {
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
}

.main {
    flex-grow: 1;
    align-self: stretch;

    .container {
        height: 100%;
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: -1;
            filter: blur(15px);
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

    .playlist {
        border-radius: 0px 0px 20px 0px;
        padding-top: 20px;
        height: 100%;
        background-color: #121212;

        .playlist__item {
            padding: 10px 0px;
            padding-left: 30px;
            padding-right: 30px;
            transition: .2s;
            display: flex;
            align-items: center;
            justify-content: space-between;

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
                    width: 23px;
                    height: 23px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }
            }
        }
    }
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
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
</style>
