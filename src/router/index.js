import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import CreateSingerView from '@/views/CreateSingerView.vue';
import UploadSongView from '@/views/UploadSongView.vue';
import FavoriteSongView from '@/views/FavoriteSongView.vue';
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/create-singer-profile',
            name: 'createSingerProfile',
            component: CreateSingerView,
        },
        {
            path: '/upload',
            name: 'uploadSong',
            component: UploadSongView,
        },
        {
            path: '/favorites',
            name: 'favorites',
            component: FavoriteSongView,
        }
    ],
})

export default router
