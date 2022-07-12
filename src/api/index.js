/* 
 apit统一管理
*/
import request from "./../utils/request"
export default {
  // 登录
  login(params) {
    return request({
      url: "/users/login",
      method: "post",
      data: params,
    })
  },
  // 通知数量
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
    })
  },
  // 菜单列表
  getMenuList() {
    return request({
      url: "/menu/list",
      method: "get",
      data: {},
    })
  },
}
