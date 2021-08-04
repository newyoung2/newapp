<template>
  <div>
    <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#484848"
      text-color="#fff"
      :collapse="$store.state.isCollapse"
      router
      active-text-color="#ffd04b"
    >
      <sideMenuItem v-for="item in menuList"  :item="item" :key="item.title"></sideMenuItem>
    </el-menu>
  </div>
</template>

<script>
import sideMenuItem from "./sideMenuItem";
import menu from '../menu'
export default {
  props: {},
  data() {
    return {
      menuList: menu,
    };
  },
  computed: {},
  watch: {},
  components: {
    sideMenuItem,
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>

<style scoped>
</style>
