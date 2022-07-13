/*
  axios的二次封装
*/
import axios from "axios"
import config from "./../config/index"
import { ElMessage } from "element-plus"
import storage from "./storage"
import router from "../router"
const TOKEN_INVALID = "token认证失败，请重新登录！"
const NEXTWORK_ERROR = "网络异常，请稍后重试！"
// 使用自定义配置新建一个实例,添加全局配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000,
})
// axios请求拦截
service.interceptors.request.use(req => {
  const headers = req.headers
  const { token } = storage.getItem("userInfo")
  if (!headers.Authorization) headers.Authorization = "Bearer " + token
  return req
})
// axios响应拦截
service.interceptors.response.use(res => {
  const { code, data, msg } = res.data
  if (code == 200) {
    return data
  } else if (code == 500001) {
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push("/login")
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NEXTWORK_ERROR)
    return Promise.reject(msg || NEXTWORK_ERROR)
  }
})
/* 
  请求核心函数
*/
function request(options) {
  // 默认为get请求
  options.method = options.method || "get"
  if (options.method.toLowerCase() === "get") {
    // 封装get请求自动将data 转为params
    options.params = options.data
  }
  let isMock = config.mock
  if (typeof options.mock !== "undefined") {
    isMock = options.mock
  }
  if (config.env === "production") {
    // 防止生产模式访问mock接口
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = isMock ? config.mockApi : config.baseApi
  }
  return service(options)
}
// axios的方法直接调用
;["get", "post", "put", "delete", "patch"].forEach(item => {
  // request函数添加方法
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options,
    })
  }
})
export default request
