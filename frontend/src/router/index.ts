import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';
import Modules from '../pages/Modules.vue';
import Logs from '../pages/Logs.vue';
import Contact from '../pages/Contact.vue';
import Shop from '../pages/Shop.vue';
import Cart from '../pages/Cart.vue';
import OrderPay from '../pages/OrderPay.vue';
import OrderSuccess from '../pages/OrderSuccess.vue';
import MobilePay from '../pages/MobilePay.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/modules', component: Modules },
    { path: '/logs', component: Logs },
    { path: '/contact', component: Contact },
    { path: '/shop', component: Shop },
    { path: '/cart', component: Cart },
    { path: '/order/pay/:id', component: OrderPay },
    { path: '/order/success', component: OrderSuccess },
    { path: '/pay/:id', component: MobilePay },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, left: 0 };
    }
  }
});

export default router;
