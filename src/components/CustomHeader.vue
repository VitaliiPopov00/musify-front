<template>
    <header>
        <div class="container">
            <nav class="header__nav">
                <ul class="header__nav__list">
                    <li @click="goToHome" class="header__nav__list__item header__logo__img">
                        <img src="@/assets/img/logo_white_withou_text.svg" alt="musify">
                    </li>
                    <li class="header__nav__list__item header__logo__text">
                        <span><slot></slot></span>
                    </li>
<!--                    <li class="header__nav__list__item header__login__btn">-->
<!--                        <a href="#">-->
<!--                            <span></span>-->
<!--                            <img src="@/assets/img/login.svg" alt="login">-->
<!--                        </a>-->
<!--                    </li>-->
                </ul>
            </nav>
        </div>
    </header>
</template>

<script>
export default {
    name: 'CustomHeader',
    methods: {
        goToHome() {
            this.$router.push('/');
        }
    }
}
</script>


<style scoped>
.main {
    flex-grow: 1;
    padding-right: 20px;
    height: 100%;

    .container {
        width: 100%;
        height: 100%;
        background-color: #121212;
        margin-right: 30px;
        padding-top: 50px;
        border-radius: 0px 20px 20px 0px;
    }
}
</style>
