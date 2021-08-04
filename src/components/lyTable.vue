<template>
    <div class="lyTable">
        <div class="lyTable_head">
            <div class="lyTable_head_item" v-for="(item,index) in headArr" :key="index">
                <span>{{index}}</span>
            </div>
        </div>

        <div class="lyTable_body">
             <div class="lyTable_head" v-for="(item,index) in tableData" :key="index">
                <div class="lyTable_head_item" v-for="(value,key,index1) in item" :key="index1">
                     <span>{{value}}</span>
               </div>
            </div>
        </div>

        
    </div>
</template>

<script>
export default {
    props: {

    },
    data() {
        return {
           headArr:['0','0','0','0','0'],
           tableData:[{col1:'',col2:'',col3}]
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
   .lyTable{
       width: 100%;
       background: #000c35;
   }

   .lyTable_head{
       width: 100%;
       display: flex;
   }

   .lyTable_head_item{
       display: flex;
       align-items: center;
       flex-shrink: 1;
       flex-grow: 1;
       height: 15px;
       border-bottom: 1px solid #2debb8;
   }

   /*  */
   .lyTable_body{
     width: 100%;
     height: 200px;
     overflow: auto;
   }
</style>
