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
      mock: false,
    })
  },
  // 通知数量
  noticeCount() {
    return request({
      url: "/leave/count",
      method: "get",
      data: {},
      mock: true,
    })
  },
  // 菜单列表
  getMenuList(params) {
    return request({
      url: "/menu/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  // 获取用户列表
  getUserList(params) {
    return request({
      url: "/users/list",
      method: "get",
      data: params,
      mock: true,
    })
  },
  // 删除用户
  userDel(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: true,
    })
  },
  // 角色列表
  getRoleAllList() {
    return request({
      url: "/roles/allList",
      method: "get",
      data: {},
      mock: true,
    })
  },
  // 部门列表
  getDeptList() {
    return request({
      url: "/dept/list",
      method: "get",
      data: {},
      mock: true,
    })
  },
  // 新增用户
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: true,
    })
  },
  // 菜单新增
  menuSubmit(params) {
    return request({
      url: "/menu/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
}
