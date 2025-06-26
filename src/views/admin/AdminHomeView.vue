<template>
    <CustomHeader>
        Админ-панель
    </CustomHeader>
    <main>
        <adminSidebar></adminSidebar>
        <section class="main">
            <div class="container">
                <transition name="opacity">
                    <ul
                        v-if="!isLoading"
                        class="statistic__list"
                    >
                        <li class="statistic__list__item">
                            <span class="statistic__list__item__head">
                                Количество пользователей
                            </span>
                            <div class="statistic__list__item__content">
                                <span class="statistic__list__item__content__count">
                                    <CountUp
                                        :end-val="statistics.users_count"
                                        :duration="2"
                                        :autoplay="true"
                                    />
                                </span>
                            </div>
                        </li>
                        <li class="statistic__list__item">
                            <span class="statistic__list__item__head">
                                Количество исполнителей
                            </span>
                            <div class="statistic__list__item__content">
                                <span class="statistic__list__item__content__count">
                                    <CountUp
                                        :end-val="statistics.singers_count"
                                        :duration="2"
                                        :autoplay="true"
                                    />
                                </span>
                            </div>
                        </li>
                        <li class="statistic__list__item">
                            <span class="statistic__list__item__head">
                                Количество песен
                            </span>
                            <div class="statistic__list__item__content">
                                <span class="statistic__list__item__content__count">
                                    <CountUp
                                        :end-val="statistics.songs_count"
                                        :duration="2"
                                        :autoplay="true"
                                    />
                                </span>
                            </div>
                        </li>
                        <li class="statistic__list__item">
                            <span class="statistic__list__item__head">
                                Количество жанров
                            </span>
                            <div class="statistic__list__item__content">
                                <span class="statistic__list__item__content__count">
                                    <CountUp
                                        :end-val="statistics.genres_count + statistics.custom_genres_count"
                                        :duration="2"
                                        :autoplay="true"
                                    />
                                </span>
                            </div>
                        </li>
                    </ul>
                </transition>
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { mapGetters } from 'vuex'
import CountUp from 'vue-countup-v3'

export default {
    name: 'AdminHomeView',
    components: {
        CountUp
    },
    computed: {
        ...mapGetters(['getAuthToken', 'getFullApiUrl']),
    },
    data() {
        return {
            isLoading: true,
            statistics: null
        }
    },
    methods: {
        async fetchStatistics() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/admin/statistics`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }

                this.statistics = data.data
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        },
    },
    mounted() {
        this.fetchStatistics();
    }
}
</script>

<style scoped>
body {
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

        .statistic__list {
            margin-left: 30px;
            margin-top: 50px;
            display: flex;
            flex-direction: column;
            gap: 50px;

            .statistic__list__item {
                display: flex;
                flex-direction: column;

                .statistic__list__item__head {
                    font-size: 20px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;
                    margin-bottom: 10px;
                }

                .statistic__list__item__content {
                    padding: 10px;
                    border-radius: 10px;
                    background-color: #2c2c2c;
                    width: fit-content;

                    .statistic__list__item__content__count {
                        font-size: 30px;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 700;
                        letter-spacing: 1px;
                        color: #e0e0e0;
                    }
                }
            }
        }
    }
}

.slide-up-enter-active,
.slide-up-leave-active {
    transition: all .5s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
    transform: translateY(20%);
}

.opacity-enter-active,
.opacity-leave-active {
    transition: all .5s ease;
}

.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
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
</style>
