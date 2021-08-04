<template>
    <div>
          <template v-if="item.children" >
              <el-submenu :index="item.path" :key="item.title">
                    <template slot="title">
                       <i :class="item.icon" v-if="item.icon"></i>
                       <span>{{item.title}}</span>
                    </template>
                    <side-menu-item v-for="item1 in item.children" :item="item1" :key="item1.title"></side-menu-item>
              </el-submenu>
          </template>

           <template v-else >
              <el-menu-item :index="item.path" :key="item.title">
                   <i :class="item.icon" v-if="item.icon"></i>
                   <span>{{item.title}}</span>
              </el-menu-item>
          </template>
    </div>
</template>

<script>
export default {
    name:'sideMenuItem',
    props: ['item'],
    data() {
        return {

        };
    },
    computed: {

    },
    watch: {

    },
    components: {

    },
    created() {

    },
    mounted() {

    },
    methods: {

    },
};
</script>

<style scoped>

</style>
