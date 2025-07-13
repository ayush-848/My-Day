// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/layouts/HomeView.vue';
import PostView from '../components/PostView.vue';
import About from '../components/About.vue';
import Contact from '../components/Contact.vue';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import EditPost from '../components/posts/EditPost.vue';
import AddPost from '../components/posts/AddPost.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/post/:id',
    name: 'post',
    component: PostView,
  },
  {
    path: '/edit-post/:id', // <-- Route for editing a specific post
    name: 'edit-post',
    component: EditPost,
    meta: { requiresAuth: true }, // Optional: protect this route
  },
  {
    path: '/add-post', // <-- Route for editing a specific post
    name: 'add-post',
    component: AddPost,
    meta: { requiresAuth: true }, // Optional: protect this route
  },
  {
    path: '/about',
    name: 'about',
    component: About,
  },
  {
    path: '/contact',
    name: 'contact',
    component: Contact,
  },
  {
    path: '/admin',
    name: 'login',
    component: Login,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
