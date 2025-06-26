<template>
    <CustomHeader>
        Админ-панель | жанры
    </CustomHeader>
    <main>
        <adminSidebar></adminSidebar>
        <section class="main">
            <div class="container">
                <transition-group name="slide-up">
                    <ul
                        v-if="!isLoading"
                        class="genres__nav"
                    >
                        <li
                            :class="{
                                active: currentSlideIsAll
                            }"
                            @click.prevent.stop="currentSlide = 'all'"
                            class="genres__nav__item"
                        >
                            <span class="genres__nav__item__title">
                                Все
                            </span>
                            <span class="genres__nav__item__count">
                                {{ genres.length }}
                            </span>
                        </li>
                        <li
                            :class="{
                                active: currentSlideIsAgree
                            }"
                            @click.prevent.stop="currentSlide = 'agree'"
                            class="genres__nav__item"
                        >
                            <span class="genres__nav__item__title">
                                Одобренные
                            </span>
                            <span class="genres__nav__item__count">
                                {{ genresAgree.length }}
                            </span>
                        </li>
                        <li
                            :class="{
                                active: currentSlideIsNotAgree
                            }"
                            @click.prevent.stop="currentSlide = 'notAgree'"
                            class="genres__nav__item"
                        >
                            <span class="genres__nav__item__title">
                                Неодобренные
                            </span>
                            <span class="genres__nav__item__count">
                                {{ genresNotAgree.length }}
                            </span>
                        </li>
                    </ul>
                    <ul
                        v-if="!isLoading && currentSlideIsAll"
                        class="genres"
                    >
                        <li
                            v-if="!openGenreAddInput"
                            @click.prevent.stop="openGenreAddInput = !openGenreAddInput"
                            class="genres__add"
                        >
                            <div class="genres__add__img">
                                <img src="@/assets/img/add_circle.svg" alt="">
                            </div>
                            <span>Добавить новый жанр</span>
                        </li>
                        <li
                            v-else
                            class="genres__add__form"
                        >
                            <input
                                v-model="genreAddForm.title"
                                class="genres__add__input"
                                type="text"
                            >
                            <ul class="genres__add__form__btns">
                                <li
                                    @click.prevent.stop="fetchCreateGerne"
                                    class="genres__add__form__btns__item"
                                >
                                    <img src="@/assets/img/agree_gray.svg" alt="">
                                </li>
                                <li
                                    @click.prevent.stop="openGenreAddInput = !openGenreAddInput"
                                    class="genres__add__form__btns__item"
                                >
                                    <img src="@/assets/img/close_gray.svg" alt="">
                                </li>
                            </ul>
                        </li>
                        <li
                            v-for="(genre, index) in genres"
                            :key="index"
                            :class="{
                                custom: !genre.hasOwnProperty('id')
                            }"
                            class="genres__item"
                        >
                            <span
                                v-if="genre.hasOwnProperty('id')"
                                class="genres__item__title"
                            >
                                {{ genre.title }}
                            </span>
                            <p
                                v-else
                                class="custom__header"
                            >
                                Количество упоминаний: {{ genre.count }}
                            </p>
                            <ul
                                v-if="genre.hasOwnProperty('id')"
                                class="genres__item__btns"
                            >
                                <li
                                    @click.prevent.stop="fetchDeleteGenre(genre.id)"
                                    class="genres__item__btns__item"
                                >
                                    <img src="@/assets/img/delete_gray.svg" alt="">
                                </li>
                            </ul>
                            <div
                                v-else
                                class="custom__content"
                            >
                                <span class="genres__item__title">
                                    {{ genre.title }}
                                </span>
                                <ul class="genres__item__btns">
                                    <li 
                                        @click.prevent.stop="fetchCreateCustomGenre(genre.title)"
                                        class="genres__item__btns__item"
                                    >
                                        <img src="@/assets/img/agree_gray.svg" alt="">
                                    </li>
                                    <li
                                        @click.prevent.stop="fetchDeleteCustomGenre(genre.title)"
                                        class="genres__item__btns__item"
                                    >
                                        <img src="@/assets/img/close_gray.svg" alt="">
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    <ul
                        v-if="!isLoading && currentSlideIsAgree"
                        class="genres"
                    >
                        <li
                            v-for="(genre, index) in genresAgree"
                            :key="index"
                            class="genres__item"
                        >
                            <span
                                v-if="genre.hasOwnProperty('id')"
                                class="genres__item__title"
                            >
                                {{ genre.title }}
                            </span>
                            <ul
                                v-if="genre.hasOwnProperty('id')"
                                class="genres__item__btns"
                            >
                                <li
                                    @click.prevent.stop="fetchDeleteGenre(genre.id)"
                                    class="genres__item__btns__item"
                                >
                                    <img src="@/assets/img/delete_gray.svg" alt="">
                                </li>
                            </ul>
                        </li>
                    </ul>
                    <ul
                        v-if="!isLoading && currentSlideIsNotAgree"
                        class="genres"
                    >
                        <li
                            v-for="(genre, index) in genresNotAgree"
                            :key="index"
                            class="genres__item custom"
                        >
                            <p class="custom__header">
                                Количество упоминаний: {{ genre.count }}
                            </p>
                            <div class="custom__content">
                                <span class="genres__item__title">
                                    {{ genre.title }}
                                </span>
                                <ul class="genres__item__btns">
                                    <li
                                        @click="fetchCreateCustomGenre(genre.title)"
                                        class="genres__item__btns__item"
                                    >
                                        <img src="@/assets/img/agree_gray.svg" alt="">
                                    </li>
                                    <li
                                        @click.prevent.stop="fetchDeleteCustomGenre(genre.title)"
                                        class="genres__item__btns__item"
                                    >
                                        <img src="@/assets/img/close_gray.svg" alt="">
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </transition-group>
                <div v-if="isLoading" class="loader-container">
                    <div class="loader"></div>
                </div>
            </div>
        </section>
    </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'AdminGenresView',
    computed: {
        ...mapGetters(['getAuthToken', 'getFullApiUrl']),
        currentSlideIsAll() {
            return this.currentSlide === 'all';
        },
        currentSlideIsAgree() {
            return this.currentSlide === 'agree';
        },
        currentSlideIsNotAgree() {
            return this.currentSlide === 'notAgree';
        },
    },
    data() {
        return {
            currentSlide: 'all',
            openGenreAddInput: false,
            genreAddForm: {
                title: '',
            },
            isLoading: true,
            genres: [],
            genresAgree: [],
            genresNotAgree: [],
        }
    },
    methods: {
        async fetchCreateCustomGenre(genreTitle) {
            try {
                const response = await fetch(this.getFullApiUrl(`api/admin/custom-genres/promote`), {
                    method: 'POST',
                    body: JSON.stringify({title: genreTitle}),
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    this.genresNotAgree = currentValueNotAgree;
                    this.genres = currentValueGenres;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchDeleteCustomGenre(genreTitle) {
            try {
                let currentValueNotAgree = this.genresNotAgree;
                let currentValueGenres = this.genres;
                this.genres = this.genres.filter(genre => genre.title !== genreTitle);
                this.genresNotAgree = this.genresNotAgree.filter(genre => genre.title !== genreTitle);

                const response = await fetch(this.getFullApiUrl(`api/admin/custom-genres`), {
                    method: 'DELETE',
                    body: JSON.stringify({title: genreTitle}),
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    this.genresNotAgree = currentValueNotAgree;
                    this.genres = currentValueGenres;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchDeleteGenre(genreId) {
            try {
                let currentValueGenres = this.genres;
                let currentValueGenresAgree = this.genresAgree;
                this.genres = this.genres.filter(genre => genre.id !== genreId);
                this.genresAgree = this.genresAgree.filter(genre => genre.id !== genreId);

                const response = await fetch(this.getFullApiUrl(`api/admin/genres/${genreId}`), {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    this.genres = currentValueGenres;
                    this.genresAgree = currentValueGenresAgree;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCreateGerne() {
            try {
                this.openGenreAddInput = !this.openGenreAddInput;
                let currentValueGenres = this.genres;
                let currentValueGenresAgree = this.genresAgree;
                let newGenre = {id: -1, title: this.genreAddForm.title};
                this.genres = [
                    newGenre,
                    ...this.genres
                ];
                this.genresAgree = [
                    newGenre,
                    ...this.genresAgree
                ];

                const response = await fetch(this.getFullApiUrl(`api/admin/genres`), {
                    method: 'POST',
                    body: JSON.stringify(this.genreAddForm),
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    this.genres = currentValueGenres;
                    this.genresAgree = currentValueGenresAgree;
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.fetchGenres();
            }
        },
        async fetchGenres() {
            try {
                const response = await fetch(this.getFullApiUrl(`api/admin/genres`), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }

                this.genres = [
                    ...data.data.genres,
                    ...data.data.custom_genres,
                ];
                this.genresAgree = data.data.genres;
                this.genresNotAgree = data.data.custom_genres;
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        }
    },
    mounted() {
        this.fetchGenres();
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

        .genres__nav {
            margin-left: 30px;
            margin-top: 50px;
            margin-bottom: 30px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;

            .genres__nav__item {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 7px 15px;
                background-color: #2c2c2c;
                border-radius: 999px;

                .genres__nav__item__title {
                    font-size: 15px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #e0e0e0;
                }

                .genres__nav__item__count {
                    font-size: 11px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #9e9e9e;
                }

                &.active {
                    background-color: #e0e0e0;

                    .genres__nav__item__title {
                        color: #121212;
                    }

                    .genres__nav__item__count {
                        color: #2c2c2c;
                    }
                }
            }
        }

        .genres {
            margin-left: 30px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            transition: .5s;

            .genres__add {
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 15px;

                .genres__add__img {
                    width: 35px;
                    height: 35px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                }

                span {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 15px;
                    color: #e0e0e0;
                }

            }

            .genres__add__form {
                display: flex;
                align-items: center;
                gap: 20px;

                .genres__add__input {
                    box-sizing: border-box;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    transition: all 0.2s;
                    border-radius: 10px;
                    border: 2px solid #9e9e9e;
                }

                .genres__add__form__btns {
                    display: flex;
                    align-items: center;
                    gap: 15px;

                    .genres__add__form__btns__item {
                        cursor: pointer;
                        width: 30px;
                        height: 30px;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }
            }



            .genres__item {
                display: flex;
                align-items: center;
                gap: 20px;
                transition: .5s;

                .genres__item__title {
                    display: block;
                    font-size: 20px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;
                    padding: 10px 20px;
                    border-radius: 9999px;
                    background-color: #2c2c2c;
                }

                .genres__item__btns {
                    display: flex;
                    gap: 30px;

                    .genres__item__btns__item {
                        cursor: pointer;
                        width: 25px;
                        height: 25px;

                        img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                        }
                    }
                }

                &.custom {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    align-items: flex-start;

                    padding: 10px 20px;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, .1);

                    .custom__header {
                        font-family: 'BoundedVariable', sans-serif;
                        font-size: 15px;
                        color: #9e9e9e;
                    }

                    .custom__content {
                        display: flex;
                        align-items: center;
                        gap: 20px;
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
