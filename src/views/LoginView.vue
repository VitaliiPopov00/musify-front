<template>
    <SimpleHeader>Авторизация</SimpleHeader>
    <main>
        <section class="login__form">
            <img class="login__form__background" src="@/assets/img/shape-7.png" alt="">
            <form class="form" action="#">
                <div class="form__field">
                    <label for="login" class="form__field__label">
                        Логин
                    </label>
                    <input v-model="form.login" :class="{
                        'form__field__input__invalid': formErrors.login.length > 0,
                        'form__field__input__success': formSuccess.login
                    }" id="login" type="text" class="form__field__input">
                    <p v-for="error in formErrors.login" class="form__field__message">
                        {{ error }}
                    </p>
                </div>
                <div class="form__field">
                    <label for="password" class="form__field__label">
                        Пароль
                    </label>
                    <input v-model="form.password" :class="{
                        'form__field__input__invalid': formErrors.password.length > 0,
                        'form__field__input__success': formSuccess.password
                    }" id="password" type="password" class="form__field__input">
                    <p v-for="error in formErrors.password" class="form__field__message">
                        {{ error }}
                    </p>
                </div>
                <button @click.prevent.stop="loginFetch" :disabled="isLoading"
                    :class="{ 'form__button__loading': isLoading }" type="submit" class="form__button">
                    <span>Войти</span>
                </button>
                <span class="line"></span>
            </form>
            <div class="login__form__redirect">
                <p>Нет аккаунта?</p>
                <router-link to="/register">Зарегистрироваться</router-link>
            </div>
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
        ...mapGetters(['getFullApiUrl'])
    },
    data() {
        return {
            isLoading: false,
            form: {
                login: '',
                password: '',
            },
            formErrors: {
                login: [],
                password: [],
            },
            formSuccess: {
                login: false,
                password: false,
            }
        }
    },
    methods: {
        ...mapActions(['setAuth']),
        async loginFetch() {
            try {
                this.isLoading = true;
                this.clearFormErrors();
                this.clearFormSuccess();

                const response = await fetch(this.getFullApiUrl('api/user/login'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.form)
                });

                const data = await response.json();

                if (response.status > 199 && response.status < 300) {
                    this.setAuth({
                        token: data.data.token,
                        id: data.data.user.id,
                        login: data.data.user.login
                    });

                    this.$router.push('/');
                }

                if (response.status > 399) {
                    if (data.error?.errors) {
                        const errors = data.error.errors;
                        this.setErrors(errors);
                        this.setSuccess(errors);
                    }
                }

                if (response.status === 401) {
                    this.formErrors.login = ['Incorrect login or password'];
                    this.formSuccess.login = false;
                }

            } catch (error) {
                throw error;
            } finally {
                this.isLoading = false;
            }
        },
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
        }
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

                .form__field__label {
                    font-family: 'BoundedVariable', sans-serif;
                    font-weight: 400;
                    color: #e0e0e0;
                    font-size: 16px;
                    margin-bottom: 13px;
                    letter-spacing: 1px;
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
