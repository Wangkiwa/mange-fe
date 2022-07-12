import { createApp } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import router from "./router"
import request from "./utils/request"
console.log("环境=", import.meta.env)
import storage from "./utils/storage"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import api from "./api"
import store from "./store"
const app = createApp(App)
// icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载封装的axios
app.config.globalProperties.$request = request
// 挂载封装的storage
app.config.globalProperties.$storage = storage
// 挂载api
app.config.globalProperties.$api = api
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount("#app")
