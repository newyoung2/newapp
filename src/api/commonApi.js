import axios from "./axios";

const apiList = {
  // 获取用户信息
  getCurrentUserInfo: "plat/admin_api/sys/users/currentUser",
  // 获取会员信息
  getMemberInfo: "member/mc/member/select/member",
  // 获取用户权限
  getUserPermission: "plat/admin_api/sys/permissions/currentUserPermissions/enabled",
  //单系统登录
  login: '/member/mc/login/user_name?',
  //验证码
  getCode: '/member/mc/select/picture-code',
  //获取统一社会信用代码
  getSocialCreditCode: 'plat/admin_api/sys/organizations/ff80808173326611017447e234ef0233/pvs'
};
export default {
  // 获取用户信息
  getCurrentUserInfo (data = {}) {
    return axios({
      url: apiList.getCurrentUserInfo,
      method: "get",
      base: true,
      data,
    })
  },
  // 获取会员信息
  getMemberInfo (data = {}) {
    return axios({
      url: apiList.getMemberInfo,
      method: "get",
      base: true,
      data,
    })
  },
  // 获取用户权限
  getUserPermission (data = {}) {
    return axios({
      url: apiList.getUserPermission,
      method: "get",
      base: true,
      data,
    })
  },
  // 获取消息列表
  getMessageList (data = {}) {
    return axios({
      url: apiList.getMessageList,
      method: "get",
      base: true,
      data,
    })
  },
  //单系统登录
  login (data = {}) {
    return axios({
      url: apiList.login,
      method: "get",
      base: true,
      data,
    })
  },
  //验证码
  getCode (data = {}) {
    return axios({
      url: apiList.getCode,
      method: "get",
      base: true,
      data,
    })
  },
  //获取统一社会信用代码
  getSocialCreditCode (data) {
    return axios({
      url: `plat/admin_api/sys/organizations/${data}/pvs?id=${data}`,
      method: "get",
      base: true
    })
  }
}
