import './bootstrap';
import Root from './root.vue';
import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { createPinia } from 'pinia';

const pinia = createPinia();

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(Root);

app.use(router);
app.use(pinia);

app.mount('#app');
