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
        meta: {
          title: "欢迎页",
        },
        component: () => import("./../views/Welcome.vue"),
      },
      {
        path: "/system/user",
        meta: {
          title: "用户管理",
        },
        component: () => import("./../views/User.vue"),
      },
      {
        path: "/system/menu",
        meta: {
          title: "菜单管理",
        },
        component: () => import("./../views/Menu.vue"),
      },
    ],
  },
  {
    path: "/login",
    meta: {
      title: "登录",
    },
    component: () => import("./../views/Login.vue"),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
export default router
