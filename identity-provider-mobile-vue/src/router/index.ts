import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import MapPage from '../views/MapPage.vue';
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: LoginPage
  },
  {
    path: '/map',
    component: MapPage
  },
  {
    path: '/report-issue',
    component: () => import('../views/ReportIssuePage.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterPage.vue')
  }
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation Guard: Protect routes that require authentication
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/map']; // Map is now also public for visitors
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router;
