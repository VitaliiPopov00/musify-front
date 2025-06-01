<template>
    <CustomHeader />
    <main>
        <Sidebar />
        <section class="main">
            <div class="container">
                <transition name="reccomendations">
                    <SongsFeed 
                        v-if="latestSongs.length > 0"
                        :feed="latestSongs"
                        @openSong="openSong"
                    >
                        Реккомендуем
                    </SongsFeed>
                </transition>
                <div 
                    v-if="isLoading"
                    class="loader-container"
                >
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

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken'])
    },
    data() {
        return {
            latestSongs: [],
            currentSong: null,
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
                    this.isLoading = false;
                }
            } catch (error) {
                throw error;
            }
        },
        openSong(item) {
            this.currentSong = item;
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
}

main {
    margin: 0px 20px 10px 20px;
    display: flex;
    overflow-y: scroll;
    overflow-x: hidden;
    transition: .5s all ease;
}

.main {
    flex-grow: 1;

    .container {
        width: 100%;
        height: 100%;
        background-color: #121212;
        margin-right: 30px;
        padding-top: 50px;
        border-radius: 0px 20px 20px 0px;
    }

}

.loader-container {
    display: flex;
    justify-content: center;
    align-items: center;
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
