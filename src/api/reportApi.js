import axios from "./axios";

const apiList = {
  // 提交上报
  commitReport: '/enterpriseDataReport/commitReport',
  // 分页
  findPage: '/enterpriseDataReport/findPage',
  // 获取详情
  getDetails: '/enterpriseDataReport/getDetails',
  // 撤销上报
  revokeReport: '/enterpriseDataReport/revokeReport',
  // 新增
  save: '/enterpriseDataReport/save',
  // 修改
  update: '/enterpriseDataReport/update',
  // 查询未上报月
  queryNoReportMonth: '/enterpriseDataReport/queryNoReportMonth'
};
export default {
  // 提交上报
  commitReport (data = {}) {
    return axios({
      url: apiList.commitReport,
      method: "get",
      data,
    })
  },
  // 分页
  findPage (data = {}) {
    return axios({
      url: apiList.findPage,
      method: "get",
      data,
    })
  },
  // 获取详情
  getDetails (data = {}) {
    return axios({
      url: apiList.getDetails,
      method: "get",
      data,
    })
  },
  // 撤销上报
  revokeReport (data = {}) {
    return axios({
      url: apiList.revokeReport,
      method: "get",
      data,
    })
  },
  // 新增
  save (data = []) {
    return axios({
      url: apiList.save,
      method: "post",
      data,
    })
  },
  // 修改
  update (data = {}) {
    return axios({
      url: apiList.update,
      method: "post",
      data,
    })
  },
  // 查询未上报月
  queryNoReportMonth (data = {}) {
    return axios({
      url: apiList.queryNoReportMonth,
      method: "get",
      data,
    })
  }
}
