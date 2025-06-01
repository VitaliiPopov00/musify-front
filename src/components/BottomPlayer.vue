<template>
    <footer>
        <section class="bottom__player">
            <div class="container">
                <div class="song">
                    <img :src="getFullApiUrl(`uploads/${song.singers[0].id}/${song.id}/photo.png`)" alt="">
                    <div class="song__info">
                        <span class="song__info__name">
                            {{ song.title }}
                        </span>
                        <span class="song__info__artists">
                            <a v-for="singer in song.singers" :key="singer.id" href="#">{{ singer.name }}{{ singer ===
                                song.singers[song.singers.length - 1] ? '' : ', ' }}</a>
                        </span>
                    </div>
                    <img class="song__favorite__btn" src="@/assets/img/heart_gray.svg" alt="">
                </div>
                <div class="player">
                    <!-- <div class="player__btns">
                        <img src="@/assets/img/previous_gray.svg" alt="">
                        <img src="@/assets/img/start.svg" alt="" class="player__btns__start__stop">
                        <img src="@/assets/img/next_gray.svg" alt="">
                    </div>
                    <div class="player__progress">
                        <span class="player__progress__time">0:44</span>
                        <span class="player__progress__line"></span>
                        <span class="player__progress__time">3:37</span>
                    </div> -->
                    <audio 
                        :key="`audio-${song.id}`"
                        ref="audioPlayer"
                        controls
                    >
                        <source 
                            :src="getFullApiUrl(`uploads/${song.singers[0].id}/${song.id}/song.mp3`)"
                            type="audio/mpeg"
                        >
                    </audio>
                </div>
                <div class="volume">
                    <img src="@/assets/img/volume.svg" alt="">
                    <span class="volume__line"></span>
                </div>
            </div>
        </section>
    </footer>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'BottomPlayer',
    props: {
        song: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters(['getFullApiUrl'])
    },
    methods: {
        playAudio() {
            this.$nextTick(() => {
                this.$refs.audioPlayer.play();
            });
        }
    },
    watch: {
        song: {
            handler() {
                this.playAudio();
            },
            immediate: true
        }
    }
}
</script>
