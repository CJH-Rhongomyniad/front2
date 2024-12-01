import Vue from 'vue';
import Router from 'vue-router';
import Register from '@/views/UserRegister.vue';
import Login from '@/views/UserLogin.vue';
import ProductList from '@/views/ProductList.vue';
import ProductDetail from '@/views/ProductDetail.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/register',
      name: 'UserRegister',
      component: Register
    },
    {
      path: '/login',
      name: 'UserLogin',
      component: Login
    },
    {
      path: '/products',
      name: 'ProductList',
      component: ProductList
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetail
    },
    {
      path: '/',
      name: 'UserRegister',
      component: Register
    },
  ]
});
