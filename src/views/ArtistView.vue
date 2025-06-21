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
                    <div v-if="!isLoading" class="artist__header">
                        <div class="artist__header__background__img">
                        </div>
                        <div class="artist__header__info">
                            <div class="artist__header__info__confirmed">
                                <img src="@/assets/img/confirmed.svg" alt="">
                                <p>
                                    Подтвержденный исполнитель
                                </p>
                            </div>
                            <div class="artist__header__info__name">
                                <h2>
                                    {{ artist.name }}
                                </h2>
                            </div>
                            <div class="artist__header__info__count">
                                <p>
                                    <span>{{ artist.totalPlayCount }} слушателей за месяц</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </transition>
                <transition name="opacity">
                    <div
                        v-if="!isLoading"
                        class="artist__btns"
                    >
                        <a href="#" class="artist__btns__start">
                            <img src="@/assets/img/play_without_circle_black.svg" alt="">
                            <span>Слушать</span>
                        </a>
                        <button
                            @click.prevent.stop="fetchSubscribe"
                            :class="{
                                'artist__btns__subscribe__already': artist.isSubscribe
                            }"
                            class="artist__btns__subscribe"
                        >
                            {{ artist.isSubscribe ? 'Уже подписаны' : 'Подписаться' }}
                        </button>
                    </div>
                </transition>
                <transition-group name="playlist">
                    <div
                        v-if="!isLoading"
                        class="playlist__title"
                    >
                        <span class="playlist__title__text">
                            Популярные треки
                        </span>
                        <router-link
                            :to="{ path: `/artist/${$route.params.id}/songs` }"
                            class="playlist__title__all"
                        >
                            все
                        </router-link>
                    </div>
                    <Tracklist
                        v-if="!isLoading"
                        :songs="filteredArtistSongs"
                        :showIndexTrack="true"
                        :toolsBtns="toolsBtns"
                        :showEmodziIfEmpty="true"
                        :messageIfEmpty="'Здесь пока ничего нет'"
                        @openSong="playSong"
                    />
                    <span
                        v-if="!isLoading && filteredArtistSongs.length > 4"
                        @click.prevent.stop="isMoreArtistSongsOpen = !isMoreArtistSongsOpen"
                        class="playlist__more"
                    >
                        {{ isMoreArtistSongsOpen ? 'Скрыть' : 'Еще' }}
                    </span>
                </transition-group>
                <transition-group name="playlist">
                    <div
                        v-if="!isLoading"
                        class="last__release"
                    >
                        <span class="last__release__title">
                            Последние релизы
                        </span>
                        <ul class="last__release__list">
                            <li
                                v-for="group in groupedReleases"
                                :key="group.date"
                                class="last__release__list__item"
                            >
                                <span class="last__release__list__item__title">
                                    {{ group.date }}
                                </span>
                                <ul class="last__release__list__item__list">
                                    <li
                                        @click.prevent.stop="$router.push({path: `/release/${release.id}`})"
                                        v-for="release in group.releases"
                                        :key="release.id"
                                        class="last__release__list__item__list__item"
                                    >
                                        <div class="last__release__list__item__list__item__img">
                                            <img :src="getFullApiUrl(`uploads/${artist.id}/${release.first_song_id}/photo.png`)" :alt="release.name">
                                        </div>
                                        <p class="last__release__list__item__list__item__title">
                                            {{ release.name }}
                                        </p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div
                        v-if="
                            !isLoading
                            && !resultReleasesIsExists
                        "
                        class="not__found"
                    >
                        <span class="not__found__emodzi">
                            {{ randomEmodzi }}
                        </span>
                        <span class="not__found__message">
                            Здесь пока ничего нет
                        </span>
                    </div>
                </transition-group>
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </section>
    </main>
    <transition name="slide-up">
        <BottomPlayer
            v-if="currentSong"
            :song="currentSong"
        />
    </transition>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken']),
        randomGradient() {
            const randomIndex = Math.floor(Math.random() * this.gradients.length);
            return this.gradients[randomIndex];
        },
        filteredArtistSongs() {
            if (!this.artistSongs) return [];
            return this.isMoreArtistSongsOpen ? this.artistSongs : this.artistSongs.slice(0, 5);
        },
        groupedReleases() {
            if (!this.lastArtistReleases) return [];

            const grouped = {};

            this.lastArtistReleases.forEach(release => {
                const date = new Date(release.date);
                const year = date.getFullYear();
                const month = date.toLocaleString('ru-RU', { month: 'long' });
                const key = `${year} ${month}`;

                if (!grouped[key]) {
                    grouped[key] = [];
                }

                grouped[key].push(release);
            });

            return Object.entries(grouped).map(([date, releases]) => ({
                date,
                releases
            }));
        },
        resultReleasesIsExists() {
            return this.lastArtistReleases?.length > 0;
        },
        randomEmodzi() {
            const randomIndex = Math.floor(Math.random() * this.emodzi.length);
            return this.emodzi[randomIndex];
        },
    },
    data() {
        return {
            toolsBtns: [
                'link_to_release',
                'favorite_togle',
                'link_to_singers',
                'add_in_playlist',
            ],
            currentSong: null,
            isLoading: true,
            artistSongs: null,
            artist: null,
            lastArtistReleases: null,
            isMoreArtistSongsOpen: false,
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
            ],
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
        playSong(song) {
            this.currentSong = song;
        },
        async fetchLastArtistReleases() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/releases/singer/${this.$route.params.id}`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.lastArtistReleases = data.data;
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
        async fetchSubscribe() {
            try {
                let currentValue = this.artist.isSubscribe;
                this.artist.isSubscribe = !currentValue;

                const response = await fetch(this.getFullApiUrl(`api/subscribe/singer/${this.$route.params.id}`), {
                    method: currentValue ? 'DELETE' : 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken,
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    this.artist.isSubscribe = currentValue;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchArtistSongs() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/singer/${this.$route.params.id}/songs?limit=10`), {
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
        this.fetchLastArtistReleases();
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
    overflow-y: scroll;
    overflow-x: hidden;
    background-color: #121212;

    .container {
        display: flex;
        flex-direction: column;
        border-radius: 0px 20px 20px 0px;
        min-height: 100%;

        .artist__header {
            position: relative;
            overflow: hidden;
            border-radius: 0px 20px 0px 0px;

            .artist__header__background__img {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
                width: 100%;
                height: 100%;
                background: v-bind(randomGradient);
            }

            .artist__header__info {
                position: relative;
                z-index: 1;
                padding-top: 250px;
                padding-left: 30px;
                padding-bottom: 30px;
                display: flex;
                flex-direction: column;
                gap: 20px;

                .artist__header__info__confirmed {
                    display: flex;
                    align-items: center;
                    gap: 10px;

                    img {
                        width: 30px;
                        height: 30px;
                        object-fit: cover;
                    }

                    p {
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 15px;
                        color: #e0e0e0;
                    }
                }

                .artist__header__info__name {
                    h2 {
                        font-family: 'UnboundedBold', sans-serif;
                        font-weight: 700;
                        color: #e0e0e0;
                        letter-spacing: 1px;
                        font-size: 90px;
                    }
                }

                .artist__header__info__count {
                    p {
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 15px;
                        color: #e0e0e0;
                    }
                }
            }
        }

        .artist__btns {
            position: relative;
            z-index: 1;
            padding-top: 30px;
            padding-left: 30px;
            display: flex;
            align-items: center;
            gap: 25px;
            margin-bottom: 50px;

            .artist__btns__start {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-family: "BoundedVariable", sans-serif;
                font-weight: 400;
                color: rgb(51, 51, 51);
                padding: 10px 15px;
                border-radius: 9999px;
                background-color: #e0e0e0;

                img {
                    width: 30px;
                    height: 30px;
                }
            }

            .artist__btns__subscribe {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                font-family: "UnboundedBold", sans-serif;
                font-weight: 400;
                color: #e0e0e0;
                padding: 10px 15px;
                border-radius: 9999px;
                border: 2px solid rgba(255, 255, 255, 0.1);
                transition: .2s;
                background-color: #121212;

                &.artist__btns__subscribe__already {
                    border-color: #e0e0e0;
                }

                &:hover {
                    border-color: #e0e0e0;
                }
            }
        }

        .playlist__title {
            padding-left: 30px;
            display: flex;
            align-items: center;
            gap: 25px;

            .playlist__title__text {
                font-size: 25px;
                font-family: 'UnboundedBold', sans-serif;
                color: #e0e0e0;
            }

            .playlist__title__all {
                font-size: 20px;
                font-family: 'BoundedRegular', sans-serif;
                color: #5b5b5b;
                position: relative;
                display: flex;
                align-items: center;
                transition: .2s;

                &::after {
                    content: '>';
                    position: absolute;
                    top: 50%;
                    transform: translate(0, -45%);
                    right: -20px;
                    transition: .2s;
                    opacity: 0;
                }

                &:hover {
                    color: #e0e0e0;

                    &::after {
                        opacity: 1;
                    }
                }
            }
        }

        .playlist__more {
            margin-left: 30px;
            font-size: 15px;
            font-family: "BoundedVariable", sans-serif;
            font-weight: 400;
            color: #9e9e9e;
            margin-top: 20px;
            margin-bottom: 20px;
            transition: .2s;
            display: block;

            &:hover {
                color: #e0e0e0;
                cursor: pointer;
            }
        }

        .last__release {
            padding-block: 50px;
            padding-left: 30px;
            padding-right: 30px;

            .last__release__title {
                font-size: 25px;
                font-family: 'UnboundedBold', sans-serif;
                color: #e0e0e0;
                margin-bottom: 20px;
                display: block;
            }

            .last__release__list {
                display: flex;
                overflow-x: scroll;
                overflow-y: hidden;
                padding-bottom: 10px;
                gap: 50px;

                .last__release__list__item {
                    .last__release__list__item__title {
                        display: block;
                        font-size: 20px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 700;
                        color: #e0e0e0;
                        margin-bottom: 10px;
                    }

                    .last__release__list__item__list {
                        display: flex;
                        gap: 50px;

                        .last__release__list__item__list__item {
                            cursor: pointer;

                            .last__release__list__item__list__item__img {
                                width: 150px;
                                height: 150px;
                                overflow: hidden;
                                margin-bottom: 10px;
                                border-radius: 10px;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                }
                            }

                            .last__release__list__item__list__item__title {
                                display: block;
                                font-size: 15px;
                                font-family: 'UnboundedBold', sans-serif;
                                color: #e0e0e0;
                            }
                        }
                    }
                }
            }
        }
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
