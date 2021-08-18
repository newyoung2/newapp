<template>
    <div class="page3">
        <!-- <lyDatePicker forbidTime = '201901' :defalutTime = "defalutTime" @datechange="getDateChange"></lyDatePicker> -->
        
        <waterBall ref="waterBall" :svgWidth="svgWidth" :optionProp="option"></waterBall>
        
    </div>
</template>

<script>
    import waterBall from '@/components/d3/waterBall'
    import lyDatePicker from "@/components/lyDatePicker";
    let sum = 0
    let objArr = [{
        wave: {
            height: '50', //海浪高度
            color: 'black',  //海浪颜色
            speed: 100,  //海浪流动速度   值越大速度越慢
        },
    }, {
        wave: {
            height: '80', //海浪高度
            color: 'red',  //海浪颜色
            speed: 100,  //海浪流动速度   值越大速度越慢
        },
        outCircle: {   //外环配置
            color: 'green'  //外环颜色
        }
    }, {
        wave: {
            height: '20', //海浪高度
            color: 'green',  //海浪颜色
            speed: 100,  //海浪流动速度   值越大速度越慢
        },
        text: {  //文本配置
            color: 'red',   //文本颜色
            fontSize: '', //文本大小
            x: '', //横坐标
            y: '', //纵坐标
        }
    }]
    export default {
        props: {

        },
        data() {
            return {
                svgWidth: '',
                option: {},
                defalutTime: []
            };
        },
        computed: {

        },
        watch: {

        },
        components: {
            waterBall,
            lyDatePicker
        },
        created() {
            let year = parseFloat(new Date().getFullYear())
            let mon = parseFloat(new Date().getMonth()) + 1
            this.defalutTime = [`${year}01`, `${year}${mon > 9 ? mon : '0' + mon}`]

            setInterval(() => {
                if(sum > 3){
                    sum = 0
                }
                this.option = objArr[sum]
                sum ++ 
            }, 30000);

        },
        mounted() {
            const that = this
            document.getElementsByTagName('body')[0].classList.add('waterBall1')
            that.svgWidth = that.$refs.waterBall.offsetWidth
            //    console.log(this.$refs.waterBall.offsetWidth)

            window.onresize = function () {
                that.$refs.waterBall.reSize()
  
           }       

        },
        beforeDestroy() {
            document.getElementsByTagName('body')[0].classList.remove('waterBall1')
        },
        methods: {
            getDateChange(e) {
                console.log(e)
            }
        },
    };
</script>

<style>
    .page3 {
        width: 100%;
        height: 100vh;
    }

    .waterBall {
        width: 60%;
        /* height: 60%; */

    }

    .ts {
        font-size: 100px;
        stroke: #ffffff;
        stroke-width: 2px;
        font-weight: bold;
    }

    .waterBall1 .el-picker-panel {
        color: red !important;
        border: 1px solid #E4E7ED;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
        background: green;
        border-radius: 4px;
        line-height: 30px;
        margin: 5px 0;
    }
</style>