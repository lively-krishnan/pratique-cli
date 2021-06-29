import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './modules/index'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router