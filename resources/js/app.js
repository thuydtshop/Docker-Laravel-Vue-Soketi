import './bootstrap';

import { createApp } from 'vue'
import App from '../views/App.vue'
import { createPinia } from 'pinia'

// router
import router from '../route'

const app = createApp(App)

// use pinia
const pinia = createPinia()
app.use(pinia)

app.use(router)
app.mount('#app')