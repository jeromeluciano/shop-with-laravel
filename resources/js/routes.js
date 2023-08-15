import Index from './pages/Index.vue';


export default [
    { path: '/', component: Index, name: 'product.index' },
    { path: '/checkout', component: () => import('./pages/Checkout.vue'), name: 'product.checkout' },
    { path: '/product/:slug', component: () => import('./pages/Show.vue'), name: 'product.show' },
    { path: '/summary', component: () => import('./pages/Summary.vue'), name: 'order.summary' }
]