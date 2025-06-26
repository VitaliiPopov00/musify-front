<template>
    <footer>
        <section class="bottom__player">
            <div class="container">
                <div class="song">
                    <img
                        :src="photoSong()"
                        alt=""
                    >
                    <div class="song__info">
                        <span class="song__info__name">
                            {{ song.title }}
                        </span>
                        <span
                            v-if="!song.is_user_song"
                            class="song__info__artists"
                        >
                            <a v-for="singer in song.singers" :key="singer.id" href="#">{{ singer.name }}{{ singer ===
                                song.singers[song.singers.length - 1] ? '' : ', ' }}</a>
                        </span>
                    </div>
                    <img 
                        v-if="!song.is_user_song"
                        @click.prevent.stop="fetchFavorite(song)" 
                        :src="song.isFavorite ? favoriteIcon : notFavoriteIcon" 
                        class="song__favorite__btn"
                        alt=""
                    >
                </div>
                <div class="player">
                    <div class="player__controls">
                        <button class="player__controls__btn" @click="playPrev">
                            <img src="@/assets/img/previous_gray.svg" alt="">
                        </button>
                        <button class="player__controls__btn player__controls__btn__play" @click="togglePlay">
                            <img :src="isPlaying ? pauseIcon : playIcon" alt="">
                        </button>
                        <button class="player__controls__btn" @click="playNext">
                            <img src="@/assets/img/next_gray.svg" alt="">
                        </button>
                    </div>
                    <div class="player__progress">
                        <span class="player__progress__time">{{ formatTime(currentTime) }}</span>
                        <div class="player__progress__line" @click="seek">
                            <div class="player__progress__line__progress" :style="{ width: progress + '%' }"></div>
                        </div>
                        <span class="player__progress__time">{{ formatTime(duration) }}</span>
                    </div>
                    <audio
                        :key="`audio-${song.id}`"
                        ref="audioPlayer"
                        @timeupdate="onTimeUpdate"
                        @loadedmetadata="onLoadedMetadata"
                        @ended="onEnded"
                    >
                        <source
                            :src="songFile()"
                            type="audio/mpeg"
                        >
                    </audio>
                </div>
                <div class="volume">
                    <img src="@/assets/img/volume.svg" alt="" @click="toggleVolume">
                    <div class="volume__line" @click="setVolume">
                        <div class="volume__line__progress" :style="{ width: volume + '%' }"></div>
                    </div>
                </div>
            </div>
        </section>
    </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import playIcon from '@/assets/img/start.svg';
import pauseIcon from '@/assets/img/pause.svg';
import favoriteIcon from '@/assets/img/heart_fill_gray.svg';
import notFavoriteIcon from '@/assets/img/heart_gray.svg';

export default {
    name: 'BottomPlayer',
    data() {
        return {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 100,
            playIcon,
            pauseIcon,
            favoriteIcon,
            notFavoriteIcon
        }
    },
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken', 'getCurrentSong', 'getSongsQueue', 'getPreviousSongs', 'getAuthUserId']),
        song() {
            return this.getCurrentSong;
        },
        progress() {
            return (this.currentTime / this.duration) * 100 || 0;
        },
    },
    methods: {
        ...mapActions(['nextSong', 'prevSong']),
        photoSong() {
            return !this.song.is_user_song
                ? this.getFullApiUrl(`uploads/${this.song.singers[0].id}/${this.song.id}/photo.png`)
                : '/src/assets/img/default.png';
        },
        songFile() {
            return !this.song.is_user_song
                ? this.getFullApiUrl(`uploads/${this.song.singers[0].id}/${this.song.id}/song.mp3`)
                : this.getFullApiUrl(`uploads/user/${this.getAuthUserId}/${this.song.id}/song.mp3`)
        },
        restartSong() {
            this.$refs.audioPlayer.currentTime = 0;
            if (this.isPlaying) {
                this.$refs.audioPlayer.play();
            }
        },
        async fetchFavorite(song) {
            try {
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
        async fetchIncrement(song) {
            try {
                const response = await fetch(this.getFullApiUrl(`api/song/${song.id}/increment`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        playAudio() {
            this.$nextTick(() => {
                this.$refs.audioPlayer.play();
                this.isPlaying = true;
            });
        },
        togglePlay() {
            if (this.isPlaying) {
                this.$refs.audioPlayer.pause();
                this.isPlaying = false;
            } else {
                this.$refs.audioPlayer.play();
                this.isPlaying = true;
            }
        },
        onTimeUpdate() {
            this.currentTime = this.$refs.audioPlayer.currentTime;
        },
        onLoadedMetadata() {
            this.duration = this.$refs.audioPlayer.duration;
        },
        onEnded() {
            this.isPlaying = false;
            this.currentTime = 0;
            if (this.getSongsQueue && this.getSongsQueue.length > 0) {
                this.nextSong();
            }
        },
        seek(event) {
            const progressBar = event.currentTarget;
            const clickPosition = event.offsetX;
            const progressBarWidth = progressBar.offsetWidth;
            const seekTime = (clickPosition / progressBarWidth) * this.duration;
            this.$refs.audioPlayer.currentTime = seekTime;
        },
        setVolume(event) {
            const volumeBar = event.currentTarget;
            const clickPosition = event.offsetX;
            const volumeBarWidth = volumeBar.offsetWidth;
            this.volume = (clickPosition / volumeBarWidth) * 100;
            this.$refs.audioPlayer.volume = this.volume / 100;
        },
        toggleVolume() {
            if (this.volume > 0) {
                this.volume = 0;
            } else {
                this.volume = 100;
            }

            this.$refs.audioPlayer.volume = this.volume / 100;
        },
        formatTime(seconds) {
            if (isNaN(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60);
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        playNext() {
            if (this.getSongsQueue && this.getSongsQueue.length > 0) {
                this.nextSong();
            }
        },
        playPrev() {
            if (this.currentTime < 2) {
                if (this.getPreviousSongs && this.getPreviousSongs.length > 0) {
                    this.prevSong();
                }
            } else {
                this.$refs.audioPlayer.currentTime = 0;
            }
        }
    },
    watch: {
        song: {
            handler(newValue) {
                if (newValue) {
                    this.playAudio();
                    this.fetchIncrement(newValue)
                } else {
                    this.isPlaying = false;
                    this.currentTime = 0;
                }
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
.song {
    display: flex;
    align-items: center;
    width: 30%;

    img {
        width: 60px;
        height: 60px;
        border-radius: 10px;
        object-fit: cover;
    }

    .song__info {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .song__info__name {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 16px;
            color: #e0e0e0;
        }

        .song__info__artists {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 14px;
            color: #9e9e9e;

            a {
                color: #9e9e9e;
                text-decoration: none;

                &:hover {
                    color: #e0e0e0;
                }
            }
        }
    }

    .song__favorite__btn {
        width: 24px;
        height: 24px;
        cursor: pointer;
        transition: .2s;

        &:hover {
            transform: scale(1.1);
        }
    }
}

.player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    width: 40%;

    .player__controls {
        display: flex;
        align-items: center;
        gap: 20px;

        .player__controls__btn {
            background: none;
            border: none;
            cursor: pointer;
            transition: .2s;

            &:hover {
                transform: scale(1.1);
            }

            img {
                width: 35px;
                height: 35px;
            }

            &.player__controls__btn__play {
                img {
                    width: 50px;
                    height: 50px;
                }
            }
        }
    }

    .player__progress {
        display: flex;
        align-items: center;
        gap: 10px;
        width: 100%;

        .player__progress__time {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 11px;
            color: #9e9e9e;
            min-width: 45px;
        }

        .player__progress__line {
            flex: 1;
            height: 4px;
            background-color: #333333;
            border-radius: 2px;
            cursor: pointer;
            position: relative;

            .player__progress__line__progress {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                background-color: #e0e0e0;
                border-radius: 2px;
                transition: width 0.1s linear;

                &::before {
                    content: "";
                    display: block;
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    left: calc(100% - 10px);
                    width: 10px;
                    height: 10px;
                    background-color: #e0e0e0;
                    border-radius: 50%;
                }
            }
        }
    }
}

.volume {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 30%;
    margin-right: 20px;
    justify-content: flex-end;

    img {
        width: 24px;
        height: 24px;
        cursor: pointer;
    }

    .volume__line {
        width: 80px;
        height: 4px;
        background-color: #333333;
        border-radius: 2px;
        cursor: pointer;
        position: relative;

        .volume__line__progress {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            background-color: #e0e0e0;
            border-radius: 2px;
            transition: width 0.1s linear;

            &::before {
                content: "";
                display: block;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                left: calc(100% - 10px);
                width: 10px;
                height: 10px;
                background-color: #e0e0e0;
                border-radius: 50%;
            }
        }
    }
}

audio {
    display: none;
}
</style>
