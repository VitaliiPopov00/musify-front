<template>
<main>
    <transition-group name="slide-up">
        <h3
            v-if="showElements"
            class="create__playlist__title"
        >
            Придумай название плейлиста
        </h3>
        <div
            v-if="showElements"
            class="form__field"
        >
            <input
                v-model="form.title"
                :class="{
                    'form__field__input__invalid': formErrors.title.length > 0,
                    'form__field__input__success': formSuccess.title
                }"
                id="password_repeat"
                class="form__field__input"
            >
            <p
                v-for="(error, index) in formErrors.title"
                :key="index"
                class="form__field__message">
                {{ error }}
            </p>
        </div>
        <ul
            v-if="showElements"
            class="create__playlist__btn__list"
        >
            <li class="create__playlist__btn__list__item">
                <router-link
                    :to="{ path: $router.options.history.state.back || '/' }"
                    class="cancel"
                >
                    Отмена
                </router-link>
            </li>
            <li class="create__playlist__btn__list__item">
                <a
                    @click.prevent.stop="fetchCreatePlaylist"
                    class="create"
                >
                    Создать
                </a>
            </li>
        </ul>
    </transition-group>
    <transition name="opacity">
        <div
            v-if="showSuccessNotification"
            class="success__notification"
        >
            <div class="success__notification__content">
                <div class="success__notification__content__img">
                    <img src="@/assets/img/success_green.svg" alt="Успешно">
                </div>
                <span>Плейлист успешно создан!</span>
                <router-link
                    :to="{
                        path: `/playlist/${playlistId}`
                    }"
                    class="success__notification__content__btn"
                >
                    Перейти на страницу с плейлистом
                </router-link>
            </div>
        </div>
    </transition>
</main>
</template>

<script>
import { mapGetters } from 'vuex';

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
            showSuccessNotification: false,
            showElements: false,
            form: {
                title: '',
            },
            formErrors: {
                title: [],
            },
            formSuccess: {
                title: false,
            },
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
            playlistId: null,
        }
    },
    methods: {
        clearFormErrors() {
            Object.keys(this.formErrors).forEach(field => {
                this.formErrors[field] = [];
            });
        },
        clearFormSuccess() {
            Object.keys(this.formSuccess).forEach(field => {
                this.formSuccess[field] = false;
            });
        },
        setSuccess(errors) {
            Object.keys(this.formSuccess).forEach(field => {
                this.formSuccess[field] = errors[field] ? false : true;
            });
        },
        setErrors(errors) {
            Object.keys(this.formErrors).forEach(field => {
                if (errors[field]) {
                    this.formErrors[field] = Array.isArray(errors[field])
                        ? errors[field]
                        : [errors[field]];
                }
            });
        },
        async fetchCreatePlaylist() {
            try {
                this.clearFormErrors();
                this.clearFormSuccess();

                const response = await fetch(this.getFullApiUrl('api/user/playlists'), {
                    method: 'POST',
                    body: JSON.stringify(this.form),
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.showSuccessNotification = true;
                    this.playlistId = data.playlist.id;
                    this.setSuccess([]);
                }

                if (response.status > 399) {
                    if (data?.error?.errors) {
                        const errors = data.error.errors;

                        this.setErrors(errors);
                        this.setSuccess(errors);
                    } else {
                        throw new Error(JSON.stringify(data));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        setTimeout(() => {
            this.showElements = true;
        }, 200)
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

    .create__playlist__title {
        font-size: 40px;
        font-family: 'UnboundedBold', sans-serif;
        color: #e0e0e0;
        margin-bottom: 50px;
    }

    .form__field {
        display: flex;
        flex-direction: column;
        max-width: 500px;
        width: 100%;
        margin-bottom: 50px;

        .form__field__input {
            box-sizing: border-box;
            font-family: 'BoundedVariable', sans-serif;
            font-weight: 400;
            font-size: 16px;
            color: #e0e0e0;
            padding: 10px 15px;
            transition: all 0.2s;
            border: 2px solid transparent;
            border-bottom: 2px solid #9e9e9e;

            &:hover {
                border-bottom: 2px solid #e0e0e0;
            }

            &:focus {
                border: 2px solid #e0e0e0;
                border-radius: 10px;
            }

            &.form__field__input__success {
                border: 2px solid #78A75A;
                border-radius: 10px;
            }

            &.form__field__input__invalid {
                border: 2px solid #BB271A;
                border-radius: 10px;
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

    .create__playlist__btn__list {
        display: flex;
        gap: 30px;

        .create__playlist__btn__list__item {
            display: flex;
            align-items: center;
            justify-content: center;

            a {
                border-radius: 9999px;
                transition: .2s;
                padding: 10px 20px;
                font-size: 15px;
                font-family: 'BoundedVariable', sans-serif;
                font-weight: 400;
                color: #e0e0e0;
                border: 1px solid rgba(255, 255, 255, .1);

                &:hover {
                    border-color: #e0e0e0;
                }

                &.create {
                    cursor: pointer;
                    border-color: #e0e0e0;
                    background-color: #e0e0e0;
                    color: #121212;

                    &:hover {
                        scale: 1.03;
                    }
                }
            }
        }
    }
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
    transform: translateY(100%);
}

.slide-right-enter-active,
.slide-right-leave-active {
    transition: all .5s ease;
}

.slide-right-enter-from,
.slide-right-leave-to {
    opacity: 0;
    transform: translatex(-10%);
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: all .5s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
    opacity: 0;
    transform: translateY(-100%);
}

.opacity-enter-active,
.opacity-leave-active {
    transition: all .5s ease;
}

.opacity-enter-from,
.opacity-leave-to {
    opacity: 0;
}

.playlist-enter-active,
.playlist-leave-active {
    transition: all .5s ease;
}

.playlist-enter-from,
.playlist-leave-to {
    opacity: 0;
    transform: translateY(15%);
}
</style>
