<template>
  <div class="sideBar">
      <div class="sideBar_avater_box"   v-show="!$store.state.isCollapse" >
        <div class="sideBar_avater">
            <img src="../assets/avater.jpg" alt="">
        </div>
     </div>
     <p v-show="!$store.state.isCollapse"  style="width:100%;text-align:center;color:white;font-size:16px;">liuyang</p> 
     <sideMenu></sideMenu>
  </div>
</template>

<script>
import sideMenu from './sideMenu'
export default {
  props: {},
  data() {
    return {
      
    };
  },
  computed: {},
  watch: {},
  components: {sideMenu},
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
