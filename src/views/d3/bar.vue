<template>
    <div id="svgBox">

    </div>
</template>

<script>
    let svg = null   //SVG对象
        let height = 700   //SVG高度
        let width = 1000    //SVG宽度
        let offset = 60    //坐标系距离svg边缘的距离
        let axisWidth = width - 2 * offset   //坐标系的宽度
        let axisHeight = height - 2 * offset   //坐标系的高度
        let axisData = []
        let xScale
        let yScale
export default {
    props: {

    },
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
       this.init()
    },
    methods: {
        init(){
            let that = this
            that.initData()
            svg = d3.select("#svgBox").append('svg').style('width',width+"px").style('height',height+'px')
            that.renderAxisX()
            that.renderAxisY()
            that.renderRect()
        },
        // 绘制x轴
        renderAxisX(type,data,key){

           xScale  = d3.scaleLinear().domain([1,12]).range([0,axisWidth])
           let axis = d3.axisBottom().scale(xScale).ticks(13).tickSize(10)//.tickPadding(10)  //定义坐标轴
           svg.append("g")
                .attr('transform',`translate(${offset},${height-offset})`) 
                .call(axis)
                .selectAll('text').attr('dx',35).text(function(item,i) {
                    console.log(item,i)
                    return i<11? i+1:''
                })
        },
        // 绘制y轴
        renderAxisY(){
           yScale = d3.scaleLinear().domain([120,0]).range([0,axisHeight])
           let axis = d3.axisLeft().scale(yScale).tickSize(10)//.tickPadding(10)  //定义坐标轴
           svg.append("g")
                .attr('transform',`translate(${offset},${offset})`) 
                .call(axis)
        },
        // 绘制柱形
        renderRect(){
            axisData.map((e,i)=>{
                svg.append('g').selectAll('rect').data(e).enter().append('rect')
                .attr('fill','red')
                .attr('x',function(e1,i1) {
                    return offset + 5 + i1*(axisWidth/11) + i*30 + 'px'
                })
                .attr('y',function(e1,i) {
                    return height-offset-yScale(e1.y)
                })
                .attr('width','25px')
                .attr('height',function(e1,i) {
                    console.log(yScale(e1.y))
                    return yScale(e1.y) + 'px'
                })
            })
        },
        initData(){   //初始化数据
               
                let  maxVal = []
                for (let i = 0; i <= 2; i++) {
                    let dataMax = null
                    if(i==0){
                         dataMax = this.abs(0,20)
                    }
                    if(i==1){
                         dataMax = this.abs(30,50)
                    }
                    if(i==2){
                         dataMax = this.abs(50,100)
                    }
                    dataMax.push(0)
                    maxVal = maxVal.concat(dataMax)
                    let data = d3.range(12).map(function (i2) { // <-B
                        return { x: i2 + 1, y: dataMax[i2],type:'工厂'+(i+1) };
                    });
                    axisData.push(data)
                    
                }
                return axisData
                // maxAxisData =   maxVal.sort(d3.ascending)[maxVal.length-1] 
            },
            abs(min,max){    //生成0-20之间不重复的随机整数
			var arr = new Array();
			for(var i = 0; i < 12; i++) {
                var n = parseInt(Math.random()*max+min);//随机生成整形数
				if(arr.length == 0) {
					arr.push(n);    //从末尾插入数组
				} else {
                        //indexOf判断数组中是否有元素n,如果没有输出-1，如果有输出位置
					if(arr.indexOf(n) < 0) {
						arr.push(n);
					} else {
						i--;
					}
 
				}
			}
               return arr
            },
        
    },
};
</script>

<style scoped>

</style>
