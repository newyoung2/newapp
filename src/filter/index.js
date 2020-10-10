import moment from "moment";
export default {
  // 日期格式化显示
  dateFormat (date, pattern = "YYYY-MM-DD") {
    if (!date) return "";
    const result = moment(new Date(date)).format(pattern);
    return result === "Invalid date" ? "" : result;
  },
  reportState (data) {
    const result = {
      0: "未上报",
      1: "已上报",
      2: "已撤销",
    };
    return result[data];
  }
};
