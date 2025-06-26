<template>
    <section class="nav__side">
        <div class="container">
            <div class="nav__side__top">
                <ul class="nav__side__list">
                    <li
                        :class="{
                            active: isActive('/') || isHoveredHome
                        }"
                        class="nav__side__list__item"
                        @mouseover="isHoveredHome = true"
                        @mouseleave="isHoveredHome = false"
                    >
                        <router-link to="/">
                            <img
                                :src="isActive('/') || isHoveredHome
                                    ? homeIcon
                                    : homeGrayIcon"
                                alt=""
                            >
                            <span>Musify</span>
                        </router-link>
                    </li>
                    <li
                        :class="{
                            active: isActive('/admin-panel') || isHoveredAdminPanel
                        }"
                        class="nav__side__list__item"
                        @mouseover="isHoveredAdminPanel = true"
                        @mouseleave="isHoveredAdminPanel = false"
                    >
                        <router-link to="/admin-panel">
                            <img
                                :src="isActive('/admin-panel') || isHoveredAdminPanel
                                    ? adminPanelIcon
                                    : adminPanelGrayIcon"
                                alt=""
                            >
                            <span>Админ-панель</span>
                        </router-link>
                    </li>
                    <li
                        :class="{
                            active: isActive('/admin-panel/genres') || isHoveredGenres
                        }"
                        class="nav__side__list__item"
                        @mouseover="isHoveredGenres = true"
                        @mouseleave="isHoveredGenres = false"
                    >
                        <router-link to="/admin-panel/genres">
                            <img
                                :src="isActive('/admin-panel/genres') || isHoveredGenres
                                    ? genresIcon
                                    : genresGrayIcon"
                                alt=""
                            >
                            <span>Жанры</span>
                        </router-link>
                    </li>
                </ul>
            </div>
            <a
                @click.prevent.stop="logout"
                href="#"
                class="nav__side__logout__btn"
            >
                <img
                    :src="logoutGrayIcon"
                    alt=""
                >
                <span>Выйти ({{ getAuthUserLogin }})</span>
            </a>
        </div>
    </section>

</template>

<script>
import { mapGetters } from 'vuex'
import genresIcon from '@/assets/img/genres_white.svg';
import genresGrayIcon from '@/assets/img/genres_gray.svg';
import logoutGrayIcon from '@/assets/img/logout_gray.svg';
import adminPanelIcon from '@/assets/img/admin_white.svg';
import adminPanelGrayIcon from '@/assets/img/admin_grey.svg';
import homeIcon from '@/assets/img/home.svg'
import homeGrayIcon from '@/assets/img/home_gray.svg'


export default {
    name: 'adminSidebar',
    computed: {
        ...mapGetters(['getAuthUserLogin', 'isSinger', 'getUserRole']),
        isAdmin() {
            return this.getUserRole === 'admin';
        },
    },
    data() {
        return {
            homeIcon,
            homeGrayIcon,
            genresIcon,
            genresGrayIcon,
            logoutGrayIcon,
            adminPanelIcon,
            adminPanelGrayIcon,
            isHoveredGenres: false,
            isHoveredAdminPanel: false,
            isHoveredHome: false,
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
