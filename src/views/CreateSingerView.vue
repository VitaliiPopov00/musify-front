<template>
    <main>
        <router-link
            to="/"
            class="go__back"
        >
            Выйти из создания
        </router-link>
        <transition-group name="slide-up">
            <div
                v-if="showContent && currentStep === 1"
                class="step__one"
            >
                <h3 class="create__title">
                    Создание нового исполнителя
                </h3>
                <div class="step__btns">
                    <button
                        @click.prevent.stop="handleSubmit(true)"
                        class="next__btn"
                    >
                        Приступить
                    </button>
                </div>
            </div>
        </transition-group>
        <transition-group name="slide-up">
            <div
                v-if="showContent && currentStep === 2"
                class="second__step"
            >
                <span class="step__id">
                    # {{ currentStep - 1 }}
                </span>
                <h3 class="form__title__title">
                    Напиши свой псевдоним
                </h3>
                <div class="form__field">
                    <input
                        v-model="form.name"
                        placeholder="Пиши здесь"
                        type="text"
                        class="form__field__input"
                    >
                </div>
                <div class="step__btns">
                    <button
                        @click.prevent.stop="handleSubmit(false)"
                        class="prev__btn"
                    >
                        Назад
                    </button>
                    <button
                        @click.prevent.stop="handleSubmit(true)"
                        class="next__btn"
                    >
                        Далее
                    </button>
                </div>
            </div>
        </transition-group>
        <transition-group name="slide-up">
            <div
                v-if="showContent && currentStep === 3"
                class="second__three"
            >
                <span class="step__id">
                    # {{ currentStep - 1 }}
                </span>
                <h3 class="form__title__title">
                    Можешь написать краткое описание о себе
                </h3>
                <p class="form__title__title__description">
                    (это необязательно)
                </p>
                <div class="form__field">
                    <input
                        v-model="form.description"
                        placeholder="Например: начинающий исполнитель"
                        type="text"
                        class="form__field__input"
                    >
                </div>
                <div class="step__btns">
                    <button
                        @click.prevent.stop="handleSubmit(false)"
                        class="prev__btn"
                    >
                        Назад
                    </button>
                    <button
                        @click.prevent.stop="handleSubmit(true)"
                        class="next__btn"
                    >
                        Далее
                    </button>
                </div>
            </div>
        </transition-group>
        <transition-group name="slide-up">
            <div
                v-if="showContent && currentStep === 4"
                class="second__four"
            >
                <span class="step__id">
                    # {{ currentStep - 1 }}
                </span>
                <h3 class="form__title__title">
                    Выбери жанры, в которых ты поёшь
                </h3>
                <p class="form__title__title__description">
                    (до 5 штук)
                </p>
                <ul class="form__genres__list">
                    <transition-group name="opacity">
                        <li
                            v-for="genre in genresApi"
                            :key="genre.id"
                            @click.prevent.stop="handleGenreClick(genre)"
                            :class="{
                                'form__field__genres__item__active': this.form.genres.includes(genre.id)
                            }"
                            class="form__genres__list__item"
                        >
                            {{ genre.title }}
                        </li>
                    </transition-group>
                </ul>
                <div class="form__add__genre">
                    <div class="form__field">
                        <input
                            v-model="form.customGenre"
                            placeholder="Описание твоего жанра"
                            type="text"
                            class="form__field__input"
                        >
                    </div>
                    <p class="form__title__title__add_genre">
                        Нет среди нашего списка твоего жанра?
                        <br>Назови его и наши администраторы расмотрят его
                    </p>
                </div>
                <div class="step__btns">
                    <button
                        @click.prevent.stop="handleSubmit(false)"
                        class="prev__btn"
                    >
                        Назад
                    </button>
                    <button
                        @click.prevent.stop="handleSubmit(true)"
                        class="next__btn"
                    >
                        Далее
                    </button>
                </div>
            </div>
        </transition-group>
        <transition-group name="slide-up">
            <div
                v-if="showContent && currentStep === 5"
                class="second__five"
            >
                <span class="step__id">
                    # {{ currentStep - 1 }}
                </span>
                <h3 class="form__title__title">
                    Почти всё готово, давай проверим данные
                </h3>
                <div class="form__summary">
                    <div class="form__summary__field">
                        <div class="form__summary__field__label">
                            Твой псевдоним
                        </div>
                        <div class="form__summary__field__label__value">
                            {{ form.name ? form.name : '*здесь ничего нет*' }}
                        </div>
                    </div>
                    <div class="form__summary__field">
                        <div class="form__summary__field__label">
                            Твоё описание о себе
                        </div>
                        <div class="form__summary__field__label__value">
                            {{ form.description ? form.description : '*здесь ничего нет*' }}
                        </div>
                    </div>
                    <div class="form__summary__field">
                        <div class="form__summary__field__label">
                            Твои жанры
                        </div>
                        <div class="form__summary__field__label__value">
                            <ul class="form__genres__list">
                                <transition-group name="opacity">
                                    <li
                                        v-for="(genre, index) in form.genres"
                                        :key="index"
                                        class="form__genres__list__item"
                                    >
                                        {{ genresApi.find(genreApi => genreApi.id === genre).title }}
                                    </li>
                                    <li
                                        v-if="form.customGenre"
                                        class="form__genres__list__item"
                                    >
                                        {{ form.customGenre }}
                                    </li>
                                </transition-group>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="step__btns">
                    <button
                        @click.prevent.stop="handleSubmit(false)"
                        class="prev__btn"
                    >
                        Назад
                    </button>
                    <button
                        @click.prevent.stop="handleSubmit(true)"
                        class="next__btn"
                        :class="{
                            'form__button__loading': isLoading
                        }"
                    >
                        <span>Создать</span>
                    </button>
                </div>
            </div>
        </transition-group>
        <div
            v-if="isSuccessCreate"
            class="success__notification"
        >
            <div class="success__notification__content">
                <div class="success__notification__content__img">
                    <img src="@/assets/img/success_green.svg" alt="Успешно">
                </div>
                <span>Исполнитель успешно создан!</span>
                <router-link
                    :to="{
                            path: `/artist/${this.singerCreatedId}`
                        }"
                    class="success__notification__content__btn"
                >
                    Перейти на страницу певца
                </router-link>
            </div>
        </div>
    </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken']),
        randomGradient() {
            const randomIndex = Math.floor(Math.random() * this.gradients.length);
            return this.gradients[randomIndex];
        },
    },
    data() {
        return {
            showContent: false,
            currentStep: 1,
            isLoading: false,
            customGenreInputIsVisible: false,
            isSuccessCreate: false,
            singerCreatedId: null,
            form: {
                name: '',
                description: '',
                genres: [],
                customGenre: ''
            },
            formErrors: {
                name: [],
                description: [],
                genres: [],
                customGenre: []
            },
            formSuccess: {
                name: false,
                description: false,
                genres: false,
                customGenre: false
            },
            genresApi: [],
            gradients: [
                'linear-gradient(45deg, #2d1b4d, #4a2b7a, #2d1b4d)',
                'linear-gradient(45deg, #1a1f3d, #2a3b6a, #1a1f3d)',
                'linear-gradient(45deg, #2d1a1a, #4a2b2b, #2d1a1a)',
                'linear-gradient(45deg, #1a2d1a, #2d4a2d, #1a2d1a)',
                'linear-gradient(45deg, #2d2d1a, #4a4a2b, #2d2d1a)',
                'linear-gradient(45deg, #1a2d2d, #2d4a4a, #1a2d2d)',
                'linear-gradient(45deg, #2d1a2d, #4a2b4a, #2d1a2d)',
                'linear-gradient(45deg, #1a2d3d, #2d4a6a, #1a2d3d)',
                'linear-gradient(45deg, #2d1a1f, #4a2b3d, #2d1a1f)',
                'linear-gradient(45deg, #1a2d2b, #2d4a47, #1a2d2b)'
            ],
        }
    },
    methods: {
        ...mapActions(['setAuth']),
        handleGenreClick(genre) {
            if (this.form.genres.includes(genre.id)) {
                this.form.genres = this.form.genres.filter(id => id !== genre.id);
            } else {
                this.form.genres.push(genre.id);
            }
        },
        async fetchGenres() {
            try {
                const response = await fetch(this.getFullApiUrl('api/genre'), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                if (response.status > 199 && response.status < 300) {
                    const data = await response.json();
                    this.genresApi = data.data
                }

                if (response.status > 399) {
                    if (data.error?.errors) {
                        console.log(data);
                    }
                }
            } catch (error) {
                throw error;
            }
        },
        clearFormErrors() {
            Object.keys(this.formErrors).forEach(field => {
                this.formErrors[field] = []
            })
        },
        clearFormSuccess() {
            Object.keys(this.formSuccess).forEach(field => {
                this.formSuccess[field] = false
            })
        },
        setSuccess(errors) {
            Object.keys(this.formSuccess).forEach(field => {
                this.formSuccess[field] = errors[field] ? false : true
            })
        },
        setErrors(errors) {
            Object.keys(this.formErrors).forEach(field => {
                if (errors[field]) {
                    this.formErrors[field] = Array.isArray(errors[field])
                        ? errors[field]
                        : [errors[field]]
                }
            })
        },
        handleSubmit(direction) {
            if (direction && this.currentStep < 5) {
                this.currentStep += 0.5;

                setTimeout(() => {
                   this.currentStep += 0.5;
                }, 500);
                return;
            }

            if (!direction && this.currentStep <= 5) {
                this.currentStep -= 0.5;

                setTimeout(() => {
                    this.currentStep -= 0.5;
                }, 500);
                return;
            }

            this.createSinger();
        },
        async createSinger() {
            if (this.isLoading) return;

            try {
                this.isLoading = true;

                const response = await fetch(this.getFullApiUrl('api/singer'), {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                    body: JSON.stringify(this.form)
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.isSuccessCreate = true;
                    this.singerCreatedId = data.data.singerId;
                    this.$emit('refresh-profile');
                }

                if (response.status > 399) {
                    throw new Error(JSON.stringify(data));
                }
            } catch (error) {
                console.log(error);
            } finally {
                this.isLoading = false;
            }
        }
    },
    mounted() {
        this.fetchGenres();

        setTimeout(() => {
            this.showContent = true;
        }, 200);
    }
}
</script>

<style scoped>
main {
    position: relative;
    margin: 0;
    border-radius: 0;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: v-bind(randomGradient);

    .go__back {
        cursor: pointer;
        position: absolute;
        top: 5%;
        left: 5%;
        font-family: 'BoundedVariable', sans-serif;
        font-weight: 400;
        color: #9e9e9e;
        font-size: 15px;
        transition: .2s;

        &:hover {
            color: #e0e0e0;
        }
    }

    .step__id {
        font-family: 'UnboundedBold', sans-serif;
        color: #9e9e9e;
        margin-bottom: 50px;
        font-size: 50px;
    }

    .step__btns {
        display: flex;
        gap: 20px;

        .prev__btn {
            cursor: pointer;
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            padding: 10px 20px;
            border-radius: 9999px;
            color: #9e9e9e;
            border: 1px solid rgba(255, 255, 255, .1);
            font-size: 15px;
            background-color: transparent;
            transition: .2s;

            &:hover {
                border-color: #e0e0e0;
                color: #e0e0e0;
            }
        }

        .next__btn {
            cursor: pointer;
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            padding: 10px 20px;
            border-radius: 9999px;
            background-color: #e0e0e0;
            color: #121212;
            border: 1px solid transparent;
            font-size: 15px;
            transition: .2s;

            &:hover {
                background-color: #9e9e9e;
            }
        }
    }


    .step__one {
        display: flex;
        flex-direction: column;
        align-items: center;

        .create__title {
            font-size: 60px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
            margin-bottom: 30px;
        }
    }

    .second__step {
        display: flex;
        flex-direction: column;
        align-items: center;

        .form__title__title {
            text-align: center;
            font-size: 70px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
            margin-bottom: 30px;
        }

        .form__field {
            display: flex;
            flex-direction: column;
            max-width: 700px;
            width: 100%;
            margin-bottom: 50px;

            .form__field__input {
                box-sizing: border-box;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                font-size: 50px;
                color: #e0e0e0;
                padding: 10px 15px;
                transition: all 0.2s;
                border-bottom: 2px solid #9e9e9e;

                &:hover {
                    border-color: #e0e0e0;
                }

                &:focus {
                    border-color: #e0e0e0;
                }

                &.form__field__input__success {
                    border-color: #78A75A;
                }

                &.form__field__input__invalid {
                    border-color: #BB271A;
                }
            }

            .form__field__message {
                color: #BB271A;
                font-size: 13px;
                margin-top: 10px;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
            }
        }
    }

    .second__three {
        display: flex;
        flex-direction: column;
        align-items: center;

        .form__title__title {
            text-align: center;
            font-size: 50px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
            margin-bottom: 15px;
        }

        .form__title__title__description {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 30px;
            color: #9e9e9e;
            margin-bottom: 30px;
        }

        .form__field {
            display: flex;
            flex-direction: column;
            max-width: 700px;
            width: 100%;
            margin-bottom: 50px;

            .form__field__input {
                box-sizing: border-box;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                font-size: 50px;
                color: #e0e0e0;
                padding: 10px 15px;
                transition: all 0.2s;
                border-bottom: 2px solid #9e9e9e;

                &::placeholder {
                    font-size: 25px;
                }

                &:hover {
                    border-color: #e0e0e0;
                }

                &:focus {
                    border-color: #e0e0e0;
                }

                &.form__field__input__success {
                    border-color: #78A75A;
                }

                &.form__field__input__invalid {
                    border-color: #BB271A;
                }
            }

            .form__field__message {
                color: #BB271A;
                font-size: 13px;
                margin-top: 10px;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
            }
        }
    }

    .second__four {
        display: flex;
        flex-direction: column;
        align-items: center;

        .form__title__title {
            text-align: center;
            font-size: 50px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
            margin-bottom: 15px;
        }

        .form__title__title__description {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 30px;
            color: #9e9e9e;
            margin-bottom: 50px;
        }

        .form__genres__list {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 15px;

            .form__genres__list__item {
                border-radius: 999px;
                padding: 10px 20px;
                border: 2px solid rgba(255, 255, 255, .1);
                cursor: pointer;
                font-family: 'UnboundedMedium', sans-serif;
                font-size: 30px;
                color: #e0e0e0;
                transition: .2s;

                &:hover {
                    border: 2px solid #e0e0e0;
                }
            }

            .form__field__genres__item__active {
                border: 2px solid #e0e0e0;
            }
        }

        .form__add__genre {
            display: flex;
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 50px;

            .form__field {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-bottom: 10px;

                .form__field__input {
                    box-sizing: border-box;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 25px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    transition: all 0.2s;
                    border-bottom: 2px solid #9e9e9e;

                    &::placeholder {
                        font-size: 25px;
                    }

                    &:hover {
                        border-color: #e0e0e0;
                    }

                    &:focus {
                        border-color: #e0e0e0;
                    }

                    &.form__field__input__success {
                        border-color: #78A75A;
                    }

                    &.form__field__input__invalid {
                        border-color: #BB271A;
                    }
                }

                .form__field__message {
                    color: #BB271A;
                    font-size: 13px;
                    margin-top: 10px;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                }
            }

            .form__title__title__add_genre {
                text-align: center;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                font-size: 15px;
                color: #9e9e9e;
            }
        }
    }

    .second__five {
        display: flex;
        flex-direction: column;
        align-items: center;

        .form__title__title {
            text-align: center;
            font-size: 50px;
            font-family: 'UnboundedBold', sans-serif;
            color: #e0e0e0;
            margin-bottom: 50px;
        }

        .form__summary {
            display: flex;
            flex-direction: column;
            gap: 20px;
            margin-bottom: 50px;

            .form__summary__field {
                .form__summary__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #9e9e9e;
                }

                .form__summary__field__label__value {
                    font-size: 40px;
                    font-family: 'UnboundedBold', sans-serif;
                    color: #e0e0e0;

                    .form__genres__list {
                        margin-top: 10px;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 10px;

                        .form__genres__list__item {
                            border-radius: 999px;
                            padding: 10px 20px;
                            border: 2px solid #e0e0e0;
                            cursor: pointer;
                            font-family: 'UnboundedMedium', sans-serif;
                            font-size: 20px;
                            color: #e0e0e0;
                            transition: .2s;
                        }
                    }
                }
            }
        }

        .next__btn {
            position: relative;

            &.form__button__loading {
                span {
                    color: transparent;
                }

                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 20px;
                    height: 20px;
                    border: 2px solid #333333;
                    border-radius: 50%;
                    border-top-color: transparent;
                    animation: spin 1s linear infinite;
                }
            }
        }
    }
}

.success__notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease-out;

    .success__notification__content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        animation: scaleIn 0.3s ease-out;

        .success__notification__content__img {
            width: 175px;
            height: 175px;
            position: relative;

            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(120, 167, 90, 0.4) 0%, rgba(120, 167, 90, 0) 70%);
                animation: wave 3s ease-out infinite;
                z-index: -1;
            }

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                position: relative;
                z-index: 1;
            }
        }

        span {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 700;
            font-size: 24px;
            color: #e0e0e0;
            display: block;
        }

        .success__notification__content__btn {
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 700;
            font-size: 17px;
            color: #121212;
            display: block;
            padding: 10px 20px;
            background-color: #e0e0e0;
            border-radius: 10px;
            transition: .2s;

            &:hover {
                scale: 1.03;
            }

        }
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes scaleIn {
    from {
        transform: scale(0.8);
        opacity: 0;
    }
    to {
        transform: scale(1);
        opacity: 1;
    }
}

@keyframes wave {
    0% {
        transform: translate(-50%, -50%) scale(0.5);
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.5);
        opacity: 0;
    }
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
    transform: translateY(30%);
}

.opacity-enter-active,
.opacity-leave-active {
    transition: all .5s ease;
}

.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
}
</style>
