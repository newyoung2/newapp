import axios from "./axios";

const apiList = {
  // 提交上报
  data1: './data/population.json',
};
export default {
  // 提交上报
  getData1 (data = {}) {
    return axios({
      url: apiList.data1,
      method: "get",
      data,
    })
  },
}
