<template>
    <Transition name="fade" mode="out-in">
        <div
            v-if="isLoading"
            class="load__section"
            key="loader"
        >
            <h1>Musify</h1>
            <ul class="author__team">
                <li>
                    create by vpopov
                </li>
                <li>
                    javalets team
                </li>
            </ul>
        </div>
        <RouterView v-else key="content" />
    </Transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    computed: {
        ...mapGetters(['getAuthToken', 'getFullApiUrl'])
    },
    data() {
        return {
            isLoading: true,
        }
    },
    methods: {
        ...mapActions(['setAuth']),
        async fetchProfile() {
            try {
                const response = await fetch(this.getFullApiUrl('api/user/profile'), {
                    headers: {
                        'Authorization': 'Bearer ' + this.getAuthToken
                    },
                });

                if (response.status > 199 && response.status < 300) {
                    const data = await response.json();

                    this.$store.commit('setUserRole', data.data.role);

                    if (data.data.singer) {
                        this.$store.commit('setSingerStatus', true);
                        this.$store.commit('setSingerName', data.data.singer.name);
                        this.$store.commit('setSingerId', data.data.singer.id);
                    } else {
                        this.$store.commit('setSingerStatus', false);
                        this.$store.commit('setSingerName', null);
                        this.$store.commit('setSingerId', null);
                    }
                }

                if (response.status > 399) {
                    this.$store.commit('clearAuth');
                }

                if (response.status === 401 || response.status === 403) {
                    this.$router.push({ path: '/login' });
                }
            } catch (error) {
                throw error;
            } finally {
                setTimeout(() => {
                    this.isLoading = false;
                }, 100);
            }
        }
    },
    mounted() {
        if (!this.getAuthToken && this.$route.path !== '/register' && this.$route.path !== '/login') {
            this.isLoading = false;
            this.$router.push('/login');
        } else {
            this.fetchProfile();
        }
    }
}
</script>

<style scoped>
.load__section {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1000;

    h1 {
        font-size: 100px;
        font-family: 'UnboundedBold', sans-serif;
        color: #e0e0e0;
        animation: 1.5s infinite scale;
    }

    .author__team {
        display: flex;
        flex-direction: column;
        align-items: center;

        li {
            font-size: 15px;
            font-family: 'UnboundedBold', sans-serif;
            color: #2c2c2c;
        }
    }
}

@keyframes scale {
    0% {
        scale: 1;
    }

    50% {
        scale: 1.1;
    }

    100% {
        scale: 1;
    }
}

.fade-enter-active {
    transition: all .5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
