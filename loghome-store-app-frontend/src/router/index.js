import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '../views/ProductList.vue'
import ProductDetail from '../views/ProductDetail.vue'
import CategoryProducts from '../views/CategoryProducts.vue'
import Cart from '../views/Cart.vue'
import Orders from '../views/Orders.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/products'
    },
    {
      path: '/products',
      name: 'ProductList',
      component: ProductList,
      meta: {
        title: '商品列表'
      }
    },
    {
      path: '/product/:id',
      name: 'ProductDetail',
      component: ProductDetail,
      meta: {
        title: '商品详情'
      }
    },
    {
      path: '/category/:id',
      name: 'CategoryProducts',
      component: CategoryProducts,
      meta: {
        title: '分类商品'
      }
    },
    {
      path: '/cart',
      name: 'Cart',
      component: Cart,
      meta: {
        title: '购物车'
      }
    },
    {
      path: '/orders',
      name: 'Orders',
      component: Orders,
      meta: {
        title: '我的订单'
      }
    }
  ],
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - LogHome商店`
  }
  next()
})

export default router
