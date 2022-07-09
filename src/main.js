import { createApp } from "vue"
import App from "./App.vue"
import ElementPlus from "element-plus"
import "element-plus/dist/index.css"
import router from "./router"
import request from "./utils/request"
console.log("环境=", import.meta.env)
import storage from "./utils/storage"
const app = createApp(App)
// 挂载封装的axios
app.config.globalProperties.$request = request
// 挂载封装的storage
app.config.globalProperties.$storage = storage
app.use(ElementPlus)
app.use(router)
app.mount("#app")
