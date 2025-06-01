<template>
    <header>
        <h1 class="form__title">
            <slot></slot>
        </h1>
    </header>
</template>

<script>
export default {
    name: 'SimpleHeader'
}
</script>

<style scoped>
.form__title {
    letter-spacing: 1px;
    font-size: 16px;
    font-family: 'BoundedVariable', sans-serif;
    font-weight: 700;
    color: #e0e0e0;
    text-align: center;
    margin: 15px 0px;
}
</style>

