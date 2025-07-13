// frontend/src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // <--- Import your router configuration
import './assets/style.css'; // Your global styles

const app = createApp(App);

app.use(router);
app.config.devtools = false;


app.mount('#app');