<template>
    <SimpleHeader>Создание исполнителя</SimpleHeader>
    <main>
        <section class="login__form">
            <img class="login__form__background" src="@/assets/img/shape-7.png" alt="">
            <form class="form" action="#">
                <div v-if="currentStep === 1" class="form__field">
                    <label for="login" class="form__field__label">
                        Псевдоним
                    </label>
                    <input v-model="form.name" :class="{
                        'form__field__input__invalid': formErrors.name.length > 0,
                        'form__field__input__success': formSuccess.name
                    }" id="login" type="text" class="form__field__input">
                    <p v-for="error in formErrors.name" class="form__field__message">
                        {{ error }}
                    </p>
                </div>
                <div v-if="currentStep === 1" class="form__field">
                    <label for="login" class="form__field__label">
                        Описание
                    </label>
                    <input v-model="form.description" :class="{
                        'form__field__input__invalid': formErrors.description.length > 0,
                        'form__field__input__success': formSuccess.description
                    }" id="login" type="text" class="form__field__input">
                    <p v-for="error in formErrors.description" class="form__field__message">
                        {{ error }}
                    </p>
                </div>
                <div v-else-if="currentStep === 2" class="form__field">
                    <label class="form__field__label">
                        Выберите жанры
                    </label>
                    <div v-if="genresApi.length > 0" class="form__field__genres">
                        <div v-for="genre in genresApi" @click.prevent.stop="handleGenreClick(genre)" :key="genre.id"
                            :class="{
                                'form__field__genres__item__active': form.genres.includes(genre.id)
                            }" class="form__field__genres__item">
                            <span>
                                {{ genre.title }}
                            </span>
                        </div>
                        <div v-if="!customGenreInputIsVisible && form.genres.length < 2"
                            @click.prevent.stop="customGenreInputIsVisible = !customGenreInputIsVisible"
                            class="form__field__genres__item__add">
                            <span>
                                +
                            </span>
                        </div>
                        <div v-else-if="customGenreInputIsVisible" style="margin-top: 20px;">
                            <label for="login" class="form__field__label form__field__label__custom__genre">
                                Название твоего жанра
                            </label>
                            <input v-model="form.customGenre" :class="{
                                'form__field__input__invalid': formErrors.customGenre.length > 0,
                                'form__field__input__success': formSuccess.customGenre
                            }" id="login" type="text" class="form__field__input">
                            <p v-for="error in formErrors.customGenre" class="form__field__message">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                </div>
                <button :disabled="isLoading" :class="{ 'form__button__loading': isLoading }"
                    @click.prevent="handleSubmit" type="submit" class="form__button">
                    <span>{{ currentStep === 1 ? 'Далее' : 'Создать' }}</span>
                </button>
            </form>
        </section>
        <section class="side__img">
            <img src="@/assets/img/shape-8.png" alt="">
        </section>
    </main>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
    computed: {
        ...mapGetters(['getFullApiUrl', 'getAuthToken'])
    },
    data() {
        return {
            currentStep: 1,
            isLoading: false,
            customGenreInputIsVisible: false,
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
            genresApi: []
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
        handleSubmit() {
            if (this.currentStep < 2) {
                this.currentStep++;
                return;
            }

            this.createSinger();
        },
        async createSinger() {
            try {
                this.isLoading = true;

                const response = await fetch(this.getFullApiUrl('api/singer'), {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                    body: JSON.stringify(this.form)
                });

                if (response.status > 199 && response.status < 300) {
                    this.$router.push('/');
                }

                if (response.status > 399) {
                    if (data.error?.errors) {
                        console.log(data);
                    }
                }
            } catch (error) {
                throw error;
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
main {
    height: 100%;
    display: flex;
    margin: 0px 10px 15px 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px 20px 20px 20px;

    .side__img {
        align-self: stretch;
        flex: 2;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 100%;
            height: 100%;
            max-width: 700px;
            max-height: 700px;
        }
    }

    .login__form {
        border-radius: 20px 0px 0px 20px;
        flex: 1;
        align-self: stretch;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        position: relative;
        overflow: hidden;

        .login__form__background {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            filter: blur(20px);
            z-index: -1;
            width: 110%;
            height: 110%;
            object-fit: cover;

        }

        .form {
            display: flex;
            flex-direction: column;
            gap: 35px;
            width: 100%;
            max-width: 350px;

            .form__field {
                display: flex;
                flex-direction: column;

                .form__field__genres {
                    display: flex;
                    flex-wrap: wrap;

                    .form__field__genres__item {
                        background-color: #333333;
                        border-radius: 10px;
                        padding: 10px 15px;
                        margin-right: 10px;
                        margin-bottom: 10px;
                        border: 2px solid transparent;
                        cursor: pointer;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 16px;
                        color: #e0e0e0;
                        transition: .2s;

                        &:hover {
                            border: 2px solid #e0e0e0;
                        }
                    }

                    .form__field__genres__item__active {
                        border: 2px solid #e0e0e0;
                    }

                    .form__field__genres__item__add {
                        background-color: #333333;
                        border-radius: 10px;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-family: 'BoundedVariable', sans-serif;
                        font-weight: 400;
                        font-size: 16px;
                        color: #e0e0e0;
                        cursor: pointer;
                        transition: .2s;
                        border: 2px solid transparent;
                        padding: 10px 0px;

                        &:hover {
                            border: 2px solid #e0e0e0;
                        }
                    }
                }

                .form__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #e0e0e0;
                    font-size: 16px;
                    margin-bottom: 13px;
                    letter-spacing: 1px;
                }

                .form__field__label__custom__genre {
                    display: block;
                }

                .form__field__input {
                    box-sizing: border-box;
                    outline: 1px solid #e0e0e0;
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    font-size: 16px;
                    color: #e0e0e0;
                    padding: 10px 15px;
                    border-radius: 10px;
                    transition: all 0.2s;

                    &:hover {
                        outline: 2px solid #e0e0e0;
                    }

                    &:focus {
                        outline: 2px solid #e0e0e0;
                    }

                    &.form__field__input__success {
                        outline: 2px solid #78A75A;
                    }

                    &.form__field__input__invalid {
                        outline: 2px solid #BB271A;
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

            .form__button {
                margin-top: 15px;
                font-family: 'UnboundedBold', sans-serif;
                font-weight: 400;
                background-color: #e0e0e0;
                border: none;
                padding: 20px;
                letter-spacing: 1px;
                border-radius: 15px;
                transition: .2s;
                color: #333333;
                position: relative;

                &:hover {
                    border-radius: 10px;
                }

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

            .line {
                height: 1px;
                background-color: #5b5b5b;
                margin-top: 10px;
                width: 120%;
                align-self: center;
            }
        }

        .login__form__redirect {
            margin-top: 15px;
            display: flex;
            letter-spacing: 1px;

            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 13px;
            color: #9e9e9e;
            gap: 10px;
            align-self: center;

            a {
                color: #9e9e9e;
                border-bottom: 1px solid #9e9e9e;
                padding-bottom: 2px;

                &:hover {
                    color: #e0e0e0;
                    border-color: #e0e0e0;
                }
            }
        }
    }
}

@keyframes spin {
    0% {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    100% {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}
</style>
