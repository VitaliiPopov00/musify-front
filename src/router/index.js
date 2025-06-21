import { createRouter, createWebHistory } from 'vue-router';
import RegisterView from '../views/RegisterView.vue';
import LoginView from '../views/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import CreateSingerView from '@/views/CreateSingerView.vue';
import UploadSongView from '@/views/UploadSongView.vue';
import FavoriteSongView from '@/views/FavoriteSongView.vue';
import ReleaseView from '@/views/ReleaseView.vue';
import ArtistView from '@/views/ArtistView.vue';
import ArtistSongsView from '@/views/ArtistSongsView.vue'
import PlaylistListView from '@/views/PlaylistListView.vue'
import CreatePlaylistView from '@/views/CreatePlaylistView.vue'
import PlaylistView from '@/views/PlaylistView.vue';
import SearchView from '@/views/SearchView.vue'
import HistoryView from '@/views/HistoryView.vue'

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
        },
        {
            path: '/release/:id',
            name: 'releaseOne',
            component: ReleaseView,
        },
        {
            path: '/artist/:id',
            name: 'artistOne',
            component: ArtistView,
        },
        {
            path: '/artist/:id/songs',
            name: 'artistSongs',
            component: ArtistSongsView,
        },
        {
            path: '/playlist',
            name: 'playlistList',
            component: PlaylistListView,
        },
        {
            path: '/create-playlist',
            name: 'createPlaylist',
            component: CreatePlaylistView,
        },
        {
            path: '/playlist/:id',
            name: 'playlistOne',
            component: PlaylistView,
        },
        {
            path: '/search',
            name: 'search',
            component: SearchView,
        },
        {
            path: '/history',
            name: 'historyPlaylist',
            component: HistoryView,
        },
    ],
})

export default router
