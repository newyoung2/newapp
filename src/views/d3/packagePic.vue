<template>
  <div class="packagePic">
    <el-table
      ref="table"
      :header-cell-style="{background:'#000c35',color:'#2debb8',borderBottom:'1px dashed #2debb8'}"
      :cell-style ="{background:'#000c35',color:'#2debb8',borderBottom:'1px dashed #2debb8'}"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      dom: null,
      tableData: [
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
        { date: "", name: "", address: "" },
      ],
      value1: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      value: "",
    };
  },
  computed: {},
  watch: {},
  components: {},
  created() {},
  mounted() {
    /*elemenUI  日历面板节点与#app同级  父元素为body  修改日历面板样式需要
        为body动态加上xxxx类名  xxxx类名下的样式修改才会生效   不加类名也可以修改样式  但是会变成全局样式影响全局*/
    document.getElementsByTagName("body")[0].classList.add("packagePic");
    this.scroll();
  },
  beforeDestroy() {
    document.getElementsByTagName("body")[0].classList.remove("packagePic");
  },
  methods: {
    tableLoadMore() {
      // 表格到底后执行  这里写你要做的事
      console.log("触底了");
    },
    //浮框  数据列表下拉滚动条触底获取更多数据触发事件
    scroll() {
      this.dom = this.$refs.table.bodyWrapper;
      this.dom.addEventListener("scroll", () => {
        // console.log("this.$refs.table.bodyWrapper",this.$refs.table)
        // 滚动距离
        let scrollTop = this.dom.scrollTop;
        // 变量windowHeight是可视区的高度
        let windowHeight = this.dom.clientHeight || this.dom.clientHeight;
        // 变量scrollHeight是滚动条的总高度
        let scrollHeight = this.dom.scrollHeight || this.dom.scrollHeight;
        // console.log(scrollTop,windowHeight,scrollHeight)
        if (Math.ceil(scrollTop + windowHeight) >= scrollHeight) {
          console.log("触底了");
        }
      });
    },
  },
};
</script>

<style>
.packagePic .el-picker-panel {
  color: red !important;
  border: 1px solid #E4E7ED;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background: blue;
  border-radius: 4px;
  line-height: 30px;
  margin: 5px 0;
}

.packagePic .el-select-dropdown {
  color: white !important;
  position: absolute;
  z-index: 1001;
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  background-color: red;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 5px 0;
}

.packagePic .el-select-dropdown__item {
  font-size: 14px;
  padding: 0 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: blue;
  height: 34px;
  line-height: 34px;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
