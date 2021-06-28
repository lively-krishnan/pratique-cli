
import Layout from 'layout/layout.vue'
export default [
  {
    path: '/',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/',
        name: '首页',
        component: () => import('views/welcome.vue')
      },
    ]
  },
]