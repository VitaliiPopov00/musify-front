<template>
    <CustomHeader>
        {{ searchQuery ? searchQuery : 'поиск' }}
    </CustomHeader>
    <main>
        <SidebarComponent />
        <section class="main">
            <div class="container">
                <transition-group name="slide-up">
                    <div
                        v-if="show"
                        :class="{
                            'search__container__hide__title': searchQuery
                        }"
                        class="search"
                    >
                        <div
                            class="search__container"
                        >
                            <h3
                                ref="searchTitle"
                                class="search__title"
                            >
                                Ввведи что-нибудь
                            </h3>
                            <input
                                v-model="searchQuery"
                                placeholder="Вот сюда"
                                class="search__input"
                                type="text"
                            >
                        </div>
                    </div>
                    <transition-group name="slide-up">
                        <Tracklist
                            v-if="
                                !isLoading
                                && (
                                    existResultSongs
                                    || existResultSingers
                                    || existResultReleases
                                )
                            "
                            :songs="songs"
                            :singers="singers"
                            :releases="releases"
                            :toolsBtns="toolsBtns"
                            @openSong="playSong"
                        />
                        <div
                            v-if="
                                !isLoading
                                && searchQuery
                                && !existResultSongs
                                && !existResultSingers
                                && !existResultReleases
                                && isWasFetching
                            "
                            class="not__found"
                        >
                            <span class="not__found__emodzi">
                                {{ randomEmodzi }}
                            </span>
                            <span class="not__found__message">
                                Ничего не нашли по данному запросу :(
                            </span>
                            <button
                                @click.prevent.stop="searchQuery = ''"
                                class="not__found__clear"
                            >
                                Очистить
                            </button>
                        </div>
                    </transition-group>
                </transition-group>
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
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken']),
        titleHeight() {
            if (this.$refs.searchTitle) {
                return this.$refs.searchTitle.offsetHeight;
            }

            return '107.5px';
        },
        existResultSongs() {
            return this.songs?.length > 0;
        },
        existResultSingers() {
            return this.singers?.length > 0;
        },
        existResultReleases() {
            return this.releases?.length > 0;
        },
        randomEmodzi() {
            const randomIndex = Math.floor(Math.random() * this.emodzi.length);
            return this.emodzi[randomIndex];
        },
    },
    data() {
        return {
            show: false,
            isLoading: false,
            searchQuery: this.$route.query.query || '',
            debounceTimer: null,
            releases: null,
            songs: null,
            singers: null,
            currentSong: null,
            isWasFetching: false,
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
            toolsBtns: [
                'favorite_togle',
                'link_to_singers',
                'add_in_playlist',
            ],
        }
    },
    watch: {
        searchQuery(newValue) {
            this.isWasFetching = false;

            if (this.debounceTimer) {
                clearTimeout(this.debounceTimer);
            }

            this.debounceTimer = setTimeout(() => {
                this.fetchSearch();
            }, 500);

            this.$router.replace({
                query: {
                    ...this.$route.query,
                    query: newValue || undefined
                }
            });

            if (!newValue) {
                this.songs = null;
                this.singers = null;
                this.releases = null;
            }
        }
    },
    methods: {
        playSong(song) {
            this.currentSong = song;
        },
        async fetchSearch() {
            if (!this.searchQuery) return;

            try {
                this.isLoading = true;

                const response = await fetch(this.getFullApiUrl(`api/search?query=${this.searchQuery}`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.songs = data.data.songs || [];
                    this.releases = data.data.releases || [];
                    this.singers = data.data.singers || [];
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
                this.isWasFetching = true;
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.show = true;
        }, 1);

        if (this.$route.query.query) {
            this.fetchSearch();
        }
    }
}
</script>


<style scoped>
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
        border-radius: 0px 20px 20px 0px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;

        .search {
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            transition: .5s;
            bottom: 0px;

            &.search__container__hide__title {
                bottom: v-bind(titleHeight);

                .search__title {
                    transition: .5s;
                    opacity: 1;
                }
            }

            .search__container {
                display: flex;
                flex-direction: column;
            }

            .search__title {
                font-size: 50px;
                font-family: 'UnboundedBold', sans-serif;
                color: #e0e0e0;
                text-align: center;
                padding-bottom: 50px;
                transition: .5s;
            }

            .search__input {
                box-sizing: border-box;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                font-size: 50px;
                color: #e0e0e0;
                padding: 10px 15px;
                transition: all 0.2s;
                border-bottom: 3px solid #9e9e9e;
                align-self: center;

                &:hover {
                    border-color: #e0e0e0;
                }

                &:focus {
                    border-color: #e0e0e0;
                }

                &.form__field__input__success {
                    border-color: #78A75A;
                }

                &.form__field__input__invalid {
                    border-color: #BB271A;
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

            .not__found__clear {
                cursor: pointer;
                font-family: 'BoundedVariable', sans-serif;
                font-size: 15px;
                color: #9e9e9e;
                background-color: transparent;
                padding: 10px 20px;
                border-radius: 9999px;
                border: 1px solid rgba(255, 255, 255, .1);
                transition: .2s;

                &:hover {
                    color: #e0e0e0;
                    border-color: #e0e0e0;
                }
            }
        }
    }
}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-top: 30px;
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
    transform: translateY(10%);
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
    transform: translateY(-10%);
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
