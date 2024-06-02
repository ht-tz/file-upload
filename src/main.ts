import { createApp } from 'vue'
import './style.css'
import './upload.css'
import App from './App.vue'
import router from "./router/index.ts"


const app = createApp(App)
app.use(router)

app.mount('#app')