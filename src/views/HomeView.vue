<template>
    <transition name="slide-down">
        <CustomHeader
            v-if="!isLoading"
        >
            musify
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
                <transition name="playlist">
                    <SongsFeed
                        v-if="!isLoading"
                        :feed="latestSongs"
                        @openSong="openSong"
                        :style="{ 'margin-top': '50px' }"
                    >
                        Рекомендуем
                    </SongsFeed>
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

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'getCurrentSong'])
    },
    data() {
        return {
            latestSongs: [],
            isLoading: true,
        }
    },
    methods: {
        async getLatestSongsFetch() {
            try {
                const response = await fetch(this.getFullApiUrl('api/song/latest'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.getAuthToken}`
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.latestSongs = data.data.songs;
                }
            } catch (error) {
                throw error;
            } finally {
                this.isLoading = false;
            }
        },
        openSong(item) {
            this.$store.dispatch('setCurrentSong', item);
        }
    },
    mounted() {
        this.getLatestSongsFetch();
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

.reccomendations-enter-active,
.reccomendations-leave-active {
    transition: all .5s ease;
}

.reccomendations-enter-from,
.reccomendations-leave-to {
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
        height: 100%;
        background-color: #121212;
        margin-right: 30px;
        border-radius: 0px 20px 20px 0px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
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
