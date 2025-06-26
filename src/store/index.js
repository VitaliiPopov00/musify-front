import { createStore } from 'vuex'

const savedState = localStorage.getItem('vuex-state')
const initialState = savedState ? JSON.parse(savedState) : {
    apiHost: 'http://127.0.0.1:8000',
    authUserToken: null,
    authUserId: null,
    authUserLogin: null,
    isSinger: false,
    userRole: null,
    singerName: null,
    singerId: null,
    currentSong: null,
    songsQueue: [],
    previousSongs: [],
}

export default createStore({
    state: initialState,
    getters: {
        getApiHost: (state) => state.apiHost,
        getFullApiUrl: (state) => (endpoint) => `${state.apiHost}/${endpoint}`,
        isAuthenticated: (state) => !!state.authUserToken,
        getAuthToken: (state) => state.authUserToken,
        getAuthUserId: (state) => state.authUserId,
        getAuthUserLogin: (state) => state.authUserLogin,
        isSinger: (state) => state.isSinger,
        getUserRole: (state) => state.userRole,
        getSingerName: (state) => state.singerName,
        getSingerId: (state) => state.singerId,
        getCurrentSong: (state) => state.currentSong,
        getSongsQueue: (state) => state.songsQueue,
        getPreviousSongs: (state) => state.previousSongs,
    },
    mutations: {
        setAuthToken(state, token) {
            state.authUserToken = token
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setAuthUserId(state, id) {
            state.authUserId = id
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setAuthUserLogin(state, login) {
            state.authUserLogin = login
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setUserRole(state, role) {
            state.userRole = role
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setSingerStatus(state, status) {
            state.isSinger = status
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setSingerName(state, name) {
            state.singerName = name
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setSingerId(state, id) {
            state.singerId = id;
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        clearAuth(state) {
            state.authUserToken = null
            state.authUserId = null
            state.authUserLogin = null
            state.isSinger = false
            state.userRole = null
            state.singerName = null
            state.singerId = null;
            state.currentSong = null;
            state.songsQueue = [];
            state.previousSongs = [];
            localStorage.setItem('vuex-state', JSON.stringify(state))
        },
        setCurrentSong(state, song) {
            state.currentSong = song;
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        setSongsQueue(state, queue) {
            state.songsQueue = queue;
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        setPreviousSongs(state, prev) {
            state.previousSongs = prev;
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        addToPreviousSongs(state, song) {
            state.previousSongs.push(song);
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        clearPreviousSongs(state) {
            state.previousSongs = [];
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        nextSong(state) {
            if (state.currentSong) {
                state.previousSongs.push(state.currentSong);
            }
            if (state.songsQueue.length > 0) {
                state.currentSong = state.songsQueue.shift();
                localStorage.setItem('vuex-state', JSON.stringify(state));
            }
        },
        prevSong(state) {
            if (state.previousSongs.length > 0) {
                if (state.currentSong) {
                    state.songsQueue.unshift(state.currentSong);
                }
                state.currentSong = state.previousSongs.pop();
                localStorage.setItem('vuex-state', JSON.stringify(state));
            }
        },
        addToSongsQueue(state, song) {
            state.songsQueue.push(song);
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        removeFromSongsQueue(state, songId) {
            state.songsQueue = state.songsQueue.filter(song => song.id !== songId);
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        clearSongsQueue(state) {
            state.songsQueue = [];
            localStorage.setItem('vuex-state', JSON.stringify(state));
        },
        playFromQueue(state, songId) {
            const songIndex = state.songsQueue.findIndex(song => song.id === songId);
            
            if (songIndex !== -1) {
                const newState = { ...state };
                
                if (newState.currentSong) {
                    newState.previousSongs = [...newState.previousSongs, newState.currentSong];
                }
                
                const songsBeforeSelected = newState.songsQueue.slice(0, songIndex);
                newState.previousSongs = [...newState.previousSongs, ...songsBeforeSelected];
                
                newState.currentSong = newState.songsQueue[songIndex];
                
                newState.songsQueue = newState.songsQueue.slice(songIndex + 1);
                
                commit('setCurrentSong', newState.currentSong);
                commit('setSongsQueue', newState.songsQueue);
                commit('setPreviousSongs', newState.previousSongs);
            }
        },
    },
    actions: {
        setAuth({ commit }, { token, id, login }) {
            commit('setAuthToken', token)
            commit('setAuthUserId', id)
            commit('setAuthUserLogin', login)
        },
        logout({ commit }) {
            commit('clearAuth')
            localStorage.removeItem('vuex-state')
        },
        setCurrentSong({ commit }, song) {
            commit('setCurrentSong', song);
        },
        setSongsQueue({ commit }, queue) {
            commit('setSongsQueue', queue);
        },
        setPreviousSongs({ commit }, prev) {
            commit('setPreviousSongs', prev);
        },
        addToPreviousSongs({ commit }, song) {
            commit('addToPreviousSongs', song);
        },
        clearPreviousSongs({ commit }) {
            commit('clearPreviousSongs');
        },
        nextSong({ commit }) {
            commit('nextSong');
        },
        prevSong({ commit }) {
            commit('prevSong');
        },
        addToSongsQueue({ commit }, song) {
            commit('addToSongsQueue', song);
        },
        removeFromSongsQueue({ commit }, songId) {
            commit('removeFromSongsQueue', songId);
        },
        clearSongsQueue({ commit }) {
            commit('clearSongsQueue');
        },
        playFromQueue({ commit, state }, songId) {
            const songIndex = state.songsQueue.findIndex(song => song.id === songId);
            
            if (songIndex !== -1) {
                const newState = { ...state };
                
                if (newState.currentSong) {
                    newState.previousSongs = [...newState.previousSongs, newState.currentSong];
                }
                
                const songsBeforeSelected = newState.songsQueue.slice(0, songIndex);
                newState.previousSongs = [...newState.previousSongs, ...songsBeforeSelected];
                
                newState.currentSong = newState.songsQueue[songIndex];
                
                newState.songsQueue = newState.songsQueue.slice(songIndex + 1);
                
                commit('setCurrentSong', newState.currentSong);
                commit('setSongsQueue', newState.songsQueue);
                commit('setPreviousSongs', newState.previousSongs);
            }
        },
    }
}) 