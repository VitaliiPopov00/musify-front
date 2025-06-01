import './assets/css/fonts.css';
import './assets/css/reset.css';
import './assets/css/normalize.css';
import './assets/css/header.css';
import './assets/css/bottom_player.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import components from './components'
const app = createApp(App)

app.use(router)
app.use(store)

components.forEach(component => {
    app.component(component.name, component)
})

app.mount('#app')
