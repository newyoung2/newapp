<template>
<!-- 自定义日期组件（只含有月份选择与季度选择功能） -->
    <div class="lyDatePicker">
        <el-input placeholder="" size="mini" prefix-icon="el-icon-date" v-model="input2"  @focus="openPlane"></el-input>

    <!-- 日历面板 -->
    <div class="lyDate_plane" v-show="showPlane">
        <!-- 首部 -->
        <div class="lyDate_plane_top">
           <i class="el-icon-d-arrow-left ly_point" @click="year--"></i>
           <span>{{year}}年</span>
           <i class="el-icon-d-arrow-right ly_point" @click="year++"></i>
        </div>
        <!-- 内容区 -->
        <!-- 月份 -->
        <div  class="lyDate_plane_mid">
            <div  class="lyDate_plane_mid_item ly_point"  :class="{'lyDate_active_range':isRange(item),'lyDate_out_range':isOutRange(item)}"  @click="selectMonth(item,'month')" v-for="(item,index) in 12" :key="index">
               <div :class="{'lyDate_active_btn':isActive(item)}">{{item}}月</div>
            </div>
        </div>
        <!-- 季度 -->
        <div  class="lyDate_plane_mid1">
            <div  class="lyDate_plane_mid_item1 ly_point" :class="{'lyDate_active_range':isRangeQ(item),'lyDate_out_range':isOutRangeQ(item)}" v-for="(item,index) in 4" :key="index"  @click="selectQuarter(item,'quarter')">
               <div  :class="{'lyDate_active_btn':isActiveQ(item)}" >第{{item}}季度</div>
            </div>
        </div>
        <div  class="lyDate_plane_bottom" >
             <span class="ly_point" style="margin-right:5%;" @click="cancel">取消</span>
             <span class="ly_point" v-show="selectRange.length !=0" @click="confirm">确定</span>
        </div>
    </div>
    </div>
</template>

<script>
export default {
    props: ['forbidTime','defalutTime'],
    data() {
        return {
            dateType:'month',//month  quarter
            year:parseFloat(new Date().getFullYear()),
            outRange:this.forbidTime,  //不可选的范围
            selectRange: this.defalutTime?this.defalutTime:[],
            showPlane:false,
            input2:''
        };
    },
    computed: {

    },
    watch: {
        year(){
           //季度选择  不可以跨年   所以切换年的时候重置select
         if(this.dateType == 'quarter'){
             this.selectRange = []
         }
        }
    },
    components: {

    },
    created() {
       this.setInput2()
    },
    mounted() {

    },
    methods: {
        //打开日期面板
        openPlane(){
            this.selectRange = []
           this.showPlane = true
        },
        //点击取消
       cancel(){
          this.showPlane = false
          this.selectRange = []
       },
       //点击确定
       confirm(){
          this.showPlane = false
          this.setInput2()
          
          let res = {
              type:this.dateType,
              value:this.selectRange.length == 2?[...this.selectRange].sort():[this.selectRange[0],this.selectRange[0]]
          }
          this.$emit('datechange',res)
          this.selectRange = []
       },
       //根绝选择日期的变化   更新input的值
       setInput2(){
          let resText = ''
         if(this.dateType == 'month'){
             
             if(this.selectRange.length == 1 || this.selectRange[0] == this.selectRange[1]){
                   resText  = `${Math.min(...this.selectRange).toString().substring(0,4)}-${Math.min(...this.selectRange).toString().substring(4,6)}`
             }else{
                    resText  = `${Math.min(...this.selectRange).toString().substring(0,4)}-${Math.min(...this.selectRange).toString().substring(4,6)}至${Math.max(...this.selectRange).toString().substring(0,4)}-${Math.max(...this.selectRange).toString().substring(4,6)}`
             }
             
         }else if(this.dateType == 'quarter'){
              if(this.selectRange.length == 1 || this.selectRange[0] == this.selectRange[1]){
                  resText = `${Math.min(...this.selectRange).toString().substring(0,4)}年 第${parseInt(Math.min(...this.selectRange).toString().substring(4,6))}季度` 
              }else{
                   resText = `${Math.min(...this.selectRange).toString().substring(0,4)}年 第${parseInt(Math.min(...this.selectRange).toString().substring(4,6))}季度——第${parseInt(Math.max(...this.selectRange).toString().substring(4,6))}季度` 
              }
              
         }
          this.input2 = resText
       },
       isActive(item){
           let date = `${this.year}${item>9?item:'0'+item}`*1
        if((date ==this.selectRange[0] || date ==this.selectRange[1]*1) && this.dateType == 'month'){
               return true
        }else{
            return false
        }
       },
       isRange(item){
          let date = `${this.year}${item>9?item:'0'+item}`*1
        if(date >= Math.min(...this.selectRange) && date <=Math.max(...this.selectRange)  && this.dateType == 'month'){
               return true
        }else{
            return false
        }
       },
       isOutRange(item){
        let date = `${this.year}${item>9?item:'0'+item}`*1
        if(this.outRange  && date <= this.outRange){
               return true
        }else{
            return false
        }
       },
       
       selectMonth(item,type){
           //    点击禁用的日期无反应
         let date = `${this.year}${item>9?item:'0'+item}`*1
        if(date <= this.outRange){
               return 
        }

        //季度和月份的切换   重置selectRange
           if(this.dateType == 'quarter'){
                this.selectRange = []
           }

         this.dateType = type
         if(this.selectRange.length >=2){
                this.selectRange = [this.selectRange[1]*1,`${this.year}${item>9?item:'0'+item}`*1]
         }else if(this.selectRange.length ==1){
              this.selectRange.push(`${this.year}${item>9?item:'0'+item}`*1)

         }else{
              this.selectRange.push(`${this.year}${item>9?item:'0'+item}`*1)
         }
       },
       selectQuarter(item,type){
        //    点击禁用的日期无反应
           let date = `${this.year}${item>9?item:'0'+item}`*1
        let cq =  Math.ceil(parseFloat(this.outRange.substr(4,2))/3)
        if(date <=  `${this.outRange.substr(0,4)}${cq>9?cq:'0'+cq}`){
               return 
        }

         //季度和月份的切换   重置selectRange
           if(this.dateType == 'month'){
                this.selectRange = []
           }
         this.dateType = type 
         if(this.selectRange.length >=2){
                this.selectRange = [this.selectRange[1]*1,`${this.year}${item>9?item:'0'+item}`*1]
         }else if(this.selectRange.length ==1){
              this.selectRange.push(`${this.year}${item>9?item:'0'+item}`*1)

         }else{
              this.selectRange.push(`${this.year}${item>9?item:'0'+item}`*1)
         }
       },
       isActiveQ(item){
           let date = `${this.year}${item>9?item:'0'+item}`*1
        if((date ==this.selectRange[0] || date ==this.selectRange[1]*1) && this.dateType == 'quarter'){
               return true
        }else{
            return false
        }
       },
       isRangeQ(item){
          let date = `${this.year}${item>9?item:'0'+item}`*1
        if(date >= Math.min(...this.selectRange) && date <=Math.max(...this.selectRange)  && this.dateType == 'quarter'){
               return true
        }else{
            return false
        }
       },
       isOutRangeQ(item){
        let date = `${this.year}${item>9?item:'0'+item}`*1
        let cq =  Math.ceil(parseFloat(this.outRange.substr(4,2))/3)
        if(this.outRange  &&  date <=  `${this.outRange.substr(0,4)}${cq>9?cq:'0'+cq}`){
               return true
        }else{
            return false
        }
       },
    },
};
</script>

<style scoped>
  .lyDatePicker{
        position: relative;
   }
   
   /* 日历面板样式 */
  .lyDate_plane{
     position: absolute;
     top: 60px;
     left: 40%;
     width: 30%;
     height: 30vh;
     min-width: 200px;
     min-height: 200px;
     font-size: 1.7vh;
     background: #000c35;
     border: 1px solid #2debb8;
     color: #2debb8;
  }

  .lyDate_plane_top{
      width: 96%;
      padding: 0 2%;
      height: 13%;
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .lyDate_plane_mid{
      width: 100%;
      height: 50%;
      display: flex;
      flex-wrap: wrap;
  }

  .lyDate_plane_mid_item{
      width: 25%;
      /* height: 33.33%; */
      display: flex;
      justify-content: center;
      align-items: center;
  }


  .lyDate_plane_mid1{
      width: 100%;
      height: 25%;
      display: flex;
      flex-wrap: wrap;
  }

  .lyDate_plane_mid_item1{
      width: 50%;
      height: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
  }
  
  .lyDate_plane_bottom{
      width: 100%;
      height: 12%;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .lyDate_active_btn{
      width: 75%;
      height: 65%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      background: #2debb8;
  }
  
  .lyDate_active_range{
      background: rgba(45,235,184,0.2);
  }

  .lyDate_out_range{
      color: #c0c4cc;
      cursor: not-allowed !important;
  }

  .ly_point{
      cursor: pointer;
  }

  /deep/ .el-input__inner {
    background-color: #000c35;
    border: 1px solid #2debb8;
    color: #2debb8;
}

/deep/ .el-icon-date{
   color: #2debb8;
}
</style>
