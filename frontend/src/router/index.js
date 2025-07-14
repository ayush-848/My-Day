import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/layouts/HomeView.vue';
import PostView from '../components/PostView.vue';
import About from '../components/About.vue';
import Contact from '../components/Contact.vue';
import Login from '../components/Login.vue';
import Dashboard from '../components/Dashboard.vue';
import EditPost from '../components/posts/EditPost.vue';
import AddPost from '../components/posts/AddPost.vue';
import Changelog from '../components/Changelog.vue';
import Search from '../components/Search.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/post/:id', name: 'post', component: PostView },
  { path: '/edit-post/:id', name: 'edit-post', component: EditPost, meta: { requiresAuth: true } },
  { path: '/add-post', name: 'add-post', component: AddPost, meta: { requiresAuth: true } },
  { path: '/about', name: 'about', component: About },
  { path: '/changelog', name: 'changelog', component: Changelog },
  { path: '/contact', name: 'contact', component: Contact },
  { path: '/admin', name: 'login', component: Login },
  { path: '/search', name: 'search', component: Search },
  { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createWebHistory(),

  routes,

  // ✅ Add this scroll behavior
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

export default router;
