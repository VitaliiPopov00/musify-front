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
            localStorage.setItem('vuex-state', JSON.stringify(state))
        }
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
        }
    }
}) 