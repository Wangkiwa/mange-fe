/* 
 vuex状态管理入口
*/
import { createStore } from "vuex"
import mutations from "./mutations"
import storage from "./../utils/storage"
const state = {
  userInfo: "" || storage.getItem("userInfo"), // 获取用户信息
  menuList: storage.getItem("menuList") || [], //初始化状态
  actionList: storage.getItem("menuList") || [], //按钮
}
export default createStore({
  state,
  mutations,
})
