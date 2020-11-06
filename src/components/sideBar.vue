<template>
  <div class="sideBar">
      <div class="sideBar_avater_box"   v-show="!$store.state.isCollapse" >
        <div class="sideBar_avater">
            <img src="../assets/avater.jpg" alt="">
        </div>
     </div>
     <p v-show="!$store.state.isCollapse"  style="width:100%;text-align:center;color:white;font-size:16px;">liuyang</p> 
     
     <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#484848"
      text-color="#fff"
      :collapse="$store.state.isCollapse"
      router
      active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>Three.js示例</span>
        </template>
        <!-- <el-menu-item index="/unit2Example1">test1</el-menu-item> -->
        <el-menu-item index="/three/unit2Example2">添加立方体</el-menu-item>
        <el-menu-item index="/three/unit2Example3">平面光示例</el-menu-item>
        <el-menu-item index="/three/unit2Example4">凸面体示例</el-menu-item>
        <el-menu-item index="/three/unit2Example5">几何体转粒子系统</el-menu-item>
        <el-menu-item index="/three/unit2Example6">加载OBJ/MTL模型</el-menu-item>
        <el-menu-item index="/three/unit2Example7">加载collada模型</el-menu-item>
        <el-menu-item index="/three/unit2Example8">加载ply模型</el-menu-item>
        <el-menu-item index="/three/unit2Example9">加载gltf动画模型</el-menu-item>
        <el-menu-item index="/three/unit2Example10">环境贴图</el-menu-item>
        <!-- <el-menu-item index="/unit2Example11">加入物理效果</el-menu-item> -->
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  components: {},
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
.sideBar_avater_box{
   width: 200px;
   height: 130px;
   display: flex;
   justify-content: center;
   align-items: center;
}

.sideBar_avater,.sideBar_avater img{
    width: 100px;
    height:100px;
    border-radius: 50px;
}

.sxtx{
    /* width: 64px;
   height: 150px;
   display: flex;
   justify-content: center;
   align-items: center; */
   /* transform: scale(0.32);
   width: 64px; */
   display: none;
}

/deep/ .el-menu-item,/deep/  .el-submenu__title {
    text-align: left;
}

/deep/.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}


/deep/.el-menu {
     border-right: solid 0px #e6e6e6; 
}

</style>
