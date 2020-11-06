<template>
  <div class="home">
       <div class="home_left">
         <sideBar/>
       </div>
       <div class="home_right">
         <div class="home_right_top" ></div>
         <div class="home_right_bottom">
            <transition name="fade-transform" mode="out-in">
               <router-view/>
            </transition>
         </div>
       </div>
  </div>
</template>

<script>
import sideBar from "../components/sideBar"
export default {
  name: 'Home',
  components: {
    sideBar
  },
  created(){    
    this.initRoutes()
  },
  methods:{
    async initRoutes(){
       const accessRoutes = await this.$store.dispatch('permission/generateRoutes', ['admin'])
       this.$router.addRoutes(accessRoutes)
    }
  }
}
</script>


<style lang="scss">
$head-height:60px; //顶部高度
   .home{
     width: 100%;
     height: 100vh;
     box-sizing: border-box;
     display: flex;
     
     .home_left{
     flex-shrink: 1;
     flex-grow: 0;
     background-color: #484848;
   }

   .home_right{
     flex-shrink: 1;
     flex-grow: 1;
     

     .home_right_top{
       width: 100%;
       height: $head-height;
       background: rgb(21, 119, 250);
     }

     .home_right_bottom{
       width: 100%;
       height: calc(100vh - #{$head-height});
       overflow-y: auto;
     }
   }

   }

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  // transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  // transform: translateX(30px);
}
   
</style>