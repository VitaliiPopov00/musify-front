<template>
    <section class="nav__side">
        <div class="container">
            <div class="nav__side__top">
                <h1 class="nav__side__heading">
                    Моя медиатека
                </h1>
                <ul class="nav__side__list">
                    <li :class="{ active: isActive('/') || isHoveredHome }" class="nav__side__list__item"
                        @mouseover="isHoveredHome = true" @mouseleave="isHoveredHome = false">
                        <router-link to="/">
                            <img :src="isActive('/') || isHoveredHome ? homeIcon : homeGrayIcon" alt="">
                            <span>Главная</span>
                        </router-link>
                    </li>
                    <li :class="{ active: isActive('/search') || isHoveredSearch }" class="nav__side__list__item"
                        @mouseover="isHoveredSearch = true" @mouseleave="isHoveredSearch = false">
                        <router-link to="/search">
                            <img :src="isActive('/search') || isHoveredSearch ? searchIcon : searchGrayIcon" alt="">
                            <span>Поиск</span>
                        </router-link>
                    </li>
                    <li :class="{ active: isActive('/favorites') || isHoveredFavorites }" class="nav__side__list__item"
                        @mouseover="isHoveredFavorites = true" @mouseleave="isHoveredFavorites = false">
                        <router-link to="/favorites">
                            <img :src="isActive('/favorites') || isHoveredFavorites ? heartFillIcon : heartGrayIcon" alt="">
                            <span>Любимые треки</span>
                        </router-link>
                    </li>
                    <li :class="{ active: isActive('/playlist') || isHoveredPlaylist }" class="nav__side__list__item"
                        @mouseover="isHoveredPlaylist = true" @mouseleave="isHoveredPlaylist = false">
                        <router-link to="/playlist">
                            <img :src="isActive('/playlist') || isHoveredPlaylist ? playlistIcon : playlistGrayIcon" alt="">
                            <span>Мои плейлисты</span>
                        </router-link>
                    </li>
                    <li :class="{ active: isActive('/history') || isHoveredHistory }" class="nav__side__list__item"
                        @mouseover="isHoveredHistory = true" @mouseleave="isHoveredHistory = false">
                        <router-link to="/history">
                            <img :src="isActive('/history') || isHoveredHistory ? HistoryIcon : HistoryGrayIcon" alt="">
                            <span>История</span>
                        </router-link>
                    </li>
                    <li v-if="isSinger && !isAdmin" :class="{ active: isActive('/upload') || isHoveredDownload }" class="nav__side__list__item"
                        @mouseover="isHoveredDownload = true"
                        @mouseleave="isHoveredDownload = false">
                        <router-link to="/upload">
                            <img :src="(isActive('/upload') || isHoveredDownload) ? downloadIcon : downloadGrayIcon" alt="">
                            <span>Загрузить трек</span>
                        </router-link>
                    </li>
                    <li v-if="!isSinger && !isAdmin" :class="{ active: isActive('/create-singer-profile') || isHoveredDownload }" class="nav__side__list__item"
                        @mouseover="isHoveredDownload = true"
                        @mouseleave="isHoveredDownload = false">
                        <router-link to="/create-singer-profile">
                            <img :src="(isActive('/create-singer-profile') || isHoveredDownload) ? downloadIcon : downloadGrayIcon" alt="">
                            <span>Стать исполнителем</span>
                        </router-link>
                    </li>
                    <li v-if="isSinger && !isAdmin" :class="{ active: isActive(`/artist/${getSingerId}`) || isHoveredSingerProfile }" class="nav__side__list__item"
                        @mouseover="isHoveredSingerProfile = true"
                        @mouseleave="isHoveredSingerProfile = false">
                        <router-link :to="getSingerProfileLink">
                            <img :src="(isActive(`/artist/${getSingerId}`) || isHoveredSingerProfile) ? ArtistIcon : ArtistGrayIcon" alt="">
                            <span>Мой исполнитель</span>
                        </router-link>
                    </li>
                    <li v-if="isAdmin" :class="{ active: isActive('/admin-panel') || isHoveredAdminPanel }" class="nav__side__list__item"
                        @mouseover="isHoveredAdminPanel = true"
                        @mouseleave="isHoveredAdminPanel = false">
                        <router-link to="/admin-panel">
                            <img :src="(isActive('/admin-panel') || isHoveredAdminPanel) ? AdminPanelIcon : AdminPanelGrayIcon" alt="">
                            <span>Админ-панель</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <a @click.prevent.stop="logout" href="#" class="nav__side__logout__btn">
                <img :src="logoutGrayIcon" alt="">
                <span>Выйти ({{ getAuthUserLogin }})</span>
            </a>
        </div>
    </section>

</template>

<script>
import { mapGetters } from 'vuex'
import homeIcon from '@/assets/img/home.svg'
import homeGrayIcon from '@/assets/img/home_gray.svg'
import searchIcon from '@/assets/img/search.svg'
import searchGrayIcon from '@/assets/img/search_gray.svg'
import heartFillIcon from '@/assets/img/heart_fill.svg'
import heartGrayIcon from '@/assets/img/heart_fill_gray.svg'
import playlistIcon from '@/assets/img/playlist.svg'
import playlistGrayIcon from '@/assets/img/playlist_gray.svg'
import logoutGrayIcon from '@/assets/img/logout_gray.svg'
import downloadIcon from '@/assets/img/download.svg'
import downloadGrayIcon from '@/assets/img/download_gray.svg'
import HistoryIcon from '@/assets/img/history_white.svg';
import HistoryGrayIcon from '@/assets/img/history_grey.svg';
import AdminPanelIcon from '@/assets/img/admin_white.svg';
import AdminPanelGrayIcon from '@/assets/img/admin_grey.svg';
import ArtistIcon from '@/assets/img/artist_white.svg';
import ArtistGrayIcon from '@/assets/img/artist.svg';

export default {
    name: 'SidebarComponent',
    computed: {
        ...mapGetters(['getAuthUserLogin', 'isSinger', 'getUserRole', 'getSingerId',]),
        isAdmin() {
            return this.getUserRole === 'admin';
        },
        getSingerProfileLink() {
            return `/artist/${this.getSingerId}`;
        },
    },
    data() {
        return {
            HistoryIcon,
            HistoryGrayIcon,
            homeIcon,
            homeGrayIcon,
            searchIcon,
            searchGrayIcon,
            heartFillIcon,
            heartGrayIcon,
            playlistIcon,
            playlistGrayIcon,
            logoutGrayIcon,
            downloadIcon,
            downloadGrayIcon,
            AdminPanelIcon,
            AdminPanelGrayIcon,
            ArtistIcon,
            ArtistGrayIcon,
            isHoveredDownload: false,
            isHoveredSingerProfile: false,
            isHoveredUpload: false,
            isHoveredPlaylist: false,
            isHoveredHistory: false,
            isHoveredFavorites: false,
            isHoveredSearch: false,
            isHoveredHome: false,
            isHoveredAdminPanel: false,
        }
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/login');
        },
        isActive(path) {
            return this.$route.path === path;
        }
    }
}
</script>

<style scoped>
.nav__side {
    max-width: 350px;
    min-width: 350px;
    width: 30%;
    position: sticky;
    top: 0;
    left: 0;

    .container {
        border-radius: 20px 0px 0px 20px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .nav__side__top {
            .nav__side__heading {
                margin: 0;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 700;
                font-size: 20px;
                color: #9e9e9e;
                padding: 50px 0px 0px 30px;

                &::first-letter {
                    text-transform: uppercase;
                }
            }

            .nav__side__list {
                margin-top: 50px;
                padding-left: 30px;
                display: flex;
                flex-direction: column;
                gap: 30px;

                .nav__side__list__item {
                    a {
                        display: flex;
                        align-items: center;
                        gap: 20px;

                        img {
                            width: 30px;
                            height: 30px;
                        }

                        span {
                            font-family: 'BoundedVariable', sans-serif;
                            font-size: 15px;
                            color: #9e9e9e;
                        }
                    }

                    &.active {
                        a {
                            span {
                                color: #e0e0e0;
                            }
                        }
                    }
                }
            }
        }

        .nav__side__logout__btn {
            display: flex;
            align-items: center;
            padding-left: 30px;
            gap: 20px;
            margin-bottom: 30px;

            img {
                width: 30px;
                height: 30px;
            }

            span {
                font-family: 'BoundedVariable', sans-serif;
                font-size: 15px;
                color: #9e9e9e;
            }
        }
    }
}
</style>
