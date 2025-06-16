<template>
    <div class="feed">
        <h3 class="feed__title">
            <slot></slot>
        </h3>
        <ul class="feed__list">
            <li 
                v-for="item in feed"
                :key="item.id"
                @click.prevent.stop="openSong(item)"
                class="feed__list__item"
            >
                <a href="#">
                    <img :src="getFullApiUrl(`uploads/${item.singers[0].id}/${item.id}/photo.png`)" alt="">
                    <div class="feed__list__item__info">
                        <span class="feed__list__item__info__song_name">
                            {{ item.title }}
                        </span>
                        <span class="feed__list__item__info__song_artist">
                            {{ item.singers.map(singer => singer.name).join(', ') }}
                        </span>
                    </div>
                </a>
            </li>
            <!-- АРТИСТ TODO: СДЕЛАТЬ АРТИСТА -->
            <!-- <li class="feed__list__item">
                <a href="#">
                    <img class="artist" src="@/assets/img/loqiemean.jpg" alt="">
                    <div class="feed__list__item__info">
                        <span class="feed__list__item__info__artist">
                            Loqiemean
                        </span>
                        <span class="feed__list__item__info__artist__description">
                            Артист
                        </span>
                    </div>
                </a>
            </li> -->
            <!-- АЛЬБОМ TODO: СДЕЛАТЬ АЛЬБОМ -->
            <!-- <li class="feed__list__item">
                <a href="#">
                    <img src="@/assets/img/ivoxygen_kaleidoscope.jpg" alt="">
                    <div class="feed__list__item__info">
                        <span class="feed__list__item__info__song_name">
                            Kaleidoscope
                        </span>
                        <span class="feed__list__item__info__song_artist">
                            Альбом | IVOXYGEN
                        </span>
                    </div>
                </a>
            </li> -->
        </ul>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SongsFeed',
    props: {
        feed: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapGetters(['getFullApiUrl'])
    },
    methods: {
        openSong(item) {
            this.$emit('openSong', item);
        }
    }
}
</script>


<style scoped>
.feed {
    padding-left: 70px;
    display: flex;
    flex-direction: column;
    padding-bottom: 100px;

    .feed__title {
        font-size: 35px;
        font-family: 'UnboundedBold', sans-serif;
        font-weight: 700;
        color: #e0e0e0;
        margin-bottom: 50px;
    }

    .feed__list {
        display: flex;
        flex-wrap: wrap;
        gap: 70px;

        .feed__list__item {
            a {
                img {
                    position: relative;
                    bottom: 0px;
                    box-shadow: 0 0 0 rgba(0, 0, 0, 0);
                    width: 250px;
                    height: 250px;
                    border-radius: 10px;
                    margin-bottom: 15px;
                    transition: .3s ease;

                    &.artist {
                        border-radius: 99999px;
                    }
                }

                &:hover>img {
                    bottom: 5px;
                    box-shadow: 0 10px 10px -1px rgba(0, 0, 0, 0.3);
                }

                .feed__list__item__info {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;

                    .feed__list__item__info__song_name {
                        font-size: 20px;
                        font-family: 'UnboundedBold', sans-serif;
                        font-weight: 700;
                        color: #e0e0e0;
                    }

                    .feed__list__item__info__song_artist {
                        font-size: 12px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        color: #9e9e9e;
                    }

                    .feed__list__item__info__artist {
                        font-size: 20px;
                        font-family: 'UnboundedBold', sans-serif;
                        font-weight: 700;
                        color: #e0e0e0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .feed__list__item__info__artist__description {
                        font-size: 12px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        color: #9e9e9e;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
        }
    }
}
</style>