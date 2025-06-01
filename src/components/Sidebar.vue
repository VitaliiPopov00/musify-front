<template>
    <section class="nav__side">
        <div class="container">
            <div class="nav__side__top">
                <h1 class="nav__side__heading">
                    Моя медиатека
                </h1>
                <ul class="nav__side__list">
                    <li class="nav__side__list__item">
                        <a href="#">
                            <img src="@/assets/img/home_gray.svg" alt="">
                            <span>Главная</span>
                        </a>
                    </li>
                    <li class="nav__side__list__item">
                        <a href="#">
                            <img src="@/assets/img/search_gray.svg" alt="">
                            <span>Поиск</span>
                        </a>
                    </li>
                    <li class="nav__side__list__item active">
                        <a href="#">
                            <img src="@/assets/img/heart_fill.svg" alt="">
                            <span>Любимые треки</span>
                        </a>
                    </li>
                    <li class="nav__side__list__item">
                        <a href="#">
                            <img src="@/assets/img/playlist_gray.svg" alt="">
                            <span>Мои плейлисты</span>
                        </a>
                    </li>
                </ul>
            </div>
            <a @click.prevent.stop="logout" href="#" class="nav__side__logout__btn">
                <img src="@/assets/img/logout_gray.svg" alt="">
                <span>Выйти ({{ getAuthUserLogin }})</span>
            </a>
        </div>
    </section>

</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'Sidebar',
    computed: {
        ...mapGetters(['getAuthUserLogin'])
    },
    methods: {
        logout() {
            this.$store.dispatch('logout');
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.nav__side {
    max-width: 350px;
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
