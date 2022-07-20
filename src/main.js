/*
 * @Descripttion:
 * @Author: TaoWang
 * @Date: 2022-07-07 22:09:56
 */
import { createApp } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import router from "./router"
import request from "./utils/request"
import storage from "./utils/storage"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import api from "./api"
import store from "./store"
import dayjs from "dayjs"
const app = createApp(App)
// icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 全局自定义指令
app.directive("has", {
  beforeMount: (el, binding) => {
    // 获取按钮权限
    let actionList = storage.getItem("actionList")
    let value = binding.value
    let hasPermission = actionList.includes(value)
    // if (!hasPermission) {
    //   el.style = "display:none"
    //   setTimeout(() => {
    //     el.parentNode.removeChild(el)
    //   }, 0)
    // }
  },
})
// 挂载封装的axios
app.config.globalProperties.$request = request
// 挂载封装的storage
app.config.globalProperties.$storage = storage
// 挂载api
app.config.globalProperties.$api = api
// dayjs挂载
app.config.globalProperties.$dayjs = dayjs
app.use(ElementPlus, { size: "small" })
app.use(router)
app.use(store)
app.mount("#app")
