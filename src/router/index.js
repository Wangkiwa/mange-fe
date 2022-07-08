import { createRouter, createWebHashHistory } from "vue-router"
import Home from "./../components/Home.vue"
const routes = [
  {
    path: "/",
    meta: {
      title: "首页",
    },
    component: Home,
    redirect: "/welcome",
    children: [
      {
        path: "/welcome",
        component: () => import("./../components/Welcome.vue"),
      },
      {
        path: "/login",
        component: () => import("./../components/Login.vue"),
      },
    ],
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
