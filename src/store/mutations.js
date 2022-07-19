/* 
  mutations数据提交
*/
import storage from "./../utils/storage"
export default {
  saveUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem("userInfo", userInfo)
  },
  saveUserMenu(state, menList) {
    state.menList = menList
    storage.setItem("menList", menList)
  },
  saveUserAction(state, actionList) {
    state.actionList = actionList
    storage.setItem("actionList", actionList)
  },
}
