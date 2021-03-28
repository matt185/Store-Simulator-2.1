import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/register',
    name: 'Register',

    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/change-password/:token?',
    name: 'Change-password',
    component: () => import('../views/Change-password.vue'),
    props(route) {
      console.log(route)
      const props = {
        token: route.params.token
      };
      return props;
    },
  }
]

const router = new VueRouter({
  routes
})

export default router