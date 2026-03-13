import { createRouter, createWebHistory } from 'vue-router'
import InvoiceListView from '../views/InvoiceListView.vue'
import InvoiceDetailView from '../views/InvoiceDetailView.vue'
import InvoiceCreateView from '../views/InvoiceCreateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'InvoiceList',
      component: InvoiceListView
    },
    {
      path: '/invoices/:id',
      name: 'InvoiceDetail',
      component: InvoiceDetailView
    },
    {
      path: '/invoices/new',
      name: 'InvoiceCreate',
      component: InvoiceCreateView
    }
  ],
})

export default router
