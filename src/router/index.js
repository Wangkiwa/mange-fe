import { createRouter, createWebHashHistory } from "vue-router"
import Home from "./../components/Home.vue"
import storage from "../utils/storage"
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
      {
        path: "/system/role",
        meta: {
          title: "角色管理",
        },
        component: () => import("../views/Role.vue"),
      },
      {
        path: "/system/dept",
        meta: {
          title: "部门管理",
        },
        component: () => import("../views/Dept.vue"),
      },
      {
        path: "/audit/leave",
        meta: {
          title: "休假申请",
        },
        component: () => import("../views/Leave.vue"),
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
  {
    path: "/404",
    meta: {
      title: "页面不存在",
    },
    component: () => import("./../views/404.vue"),
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes,
})
// 判断路径是否合法
function checkPermission(path) {
  let hasPermission = router
    .getRoutes()
    .filter(route => route.path == path).length
  if (hasPermission) {
    return true
  } else {
    return false
  }
}
router.beforeEach(async (to, from, next) => {
  if (checkPermission(to.path)) {
    document.title = to.meta.title
    next()
  } else {
    next("/404")
  }
})
//数组
// 0: {path: '/system/user', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 1: {path: '/system/menu', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 2: {path: '/system/role', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 3: {path: '/system/dept', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 4: {path: '/welcome', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 5: {path: '/', redirect: '/welcome', name: undefined, meta: {…}, aliasOf: undefined, …}
// 6: {path: '/login', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
// 7: {path: '/404', redirect: undefined, name: undefined, meta: {…}, aliasOf: undefined, …}
export default router
