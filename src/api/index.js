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
  noticeCount(params) {
    return request({
      url: "/leave/counts",
      method: "get",
      data: params,
      mock: false,
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
  getPermissionList(params) {
    return request({
      url: "users/getPermissionList",
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
      mock: false,
    })
  },
  // 获取所有用户列表
  getAllUserList(params) {
    return request({
      url: "/users/all/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  // 删除用户
  userDel(params) {
    return request({
      url: "/users/delete",
      method: "post",
      data: params,
      mock: false,
    })
  },
  // 角色列表
  getRoleAllList() {
    return request({
      url: "/roles/allList",
      method: "get",
      data: {},
      mock: false,
    })
  },
  // 部门列表
  getDeptList(prams) {
    return request({
      url: "/dept/list",
      method: "get",
      data: prams,
      mock: false,
    })
  },
  // 部门列表
  deptOperate(prams) {
    return request({
      url: "/dept/operate",
      method: "post",
      data: prams,
      mock: false,
    })
  },
  // 新增用户
  userSubmit(params) {
    return request({
      url: "/users/operate",
      method: "post",
      data: params,
      mock: false,
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
  // 角色菜单
  getRoleList(params) {
    return request({
      url: "/roles/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  // 角色列表
  rolesSubmit(params) {
    return request({
      url: "/roles/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  // 角色权限修改
  updatePermission(params) {
    return request({
      url: "/roles/update/permission",
      method: "post",
      data: params,
      mock: false,
    })
  },
  // 申请列表
  getApplyList(params) {
    return request({
      url: "/leave/list",
      method: "get",
      data: params,
      mock: false,
    })
  },
  // 创建申请单
  leaveOperate(params) {
    return request({
      url: "/leave/operate",
      method: "post",
      data: params,
      mock: false,
    })
  },
  // 审核
  leaveApprove(params) {
    return request({
      url: "/leave/approve",
      method: "post",
      data: params,
      mock: false,
    })
  },
}
