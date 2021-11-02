<template>
    <div id="svgBox" style="padding: 50px;">

    </div>
</template>

<script>
    var svg
    var linear
    let width = 800, height = 800
    let padding = 50
    export default {
        props: {

        },
        data() {
            return {
                barList: [{
                    index:0,
                    name:'上海',
                    value:150,
                    color:'red'
                },
                {
                    index:1,
                    name:'北京',
                    value:130,
                    color:'green'
                },
                {
                    index:2,
                    name:'广州',
                    value:100,
                    color:'blue'
                }],
                moniData:[],
                moniArr: [
                {
                    index:0,
                    name:'成都',
                    value:150,
                    color:'purple'
                },
                {
                    index:1,
                    name:'上海',
                    value:130,
                    color:'red'
                },
                {
                    index:2,
                    name:'深圳',
                    value:90,
                    color:'gray'
                }
                ],
                curIndex: 0,
            };
        },
        computed: {

        },
        watch: {

        },
        components: {

        },
        created() {
            // this.makeData()
        },
        mounted() {
            let that = this
            this.init()
            setTimeout(() => {
                let nowArr = that.moniArr
                
                that.drawRect(nowArr)
                
            }, 3000);
           /*  setTimeout(() => {
                that.curIndex++
                let nowArr = that.moniArr // that.moniData[that.curIndex]
                linear = d3.scaleLinear().domain([0, nowArr[0].value]).range([0, width - 2 * 50])
                // console.log(that.barList)
                // console.log(nowArr)
                let oldNameArr = that.barList.map(e=>e.name)
                let nowNameArr = nowArr.map(e=>e.name)
                
                nowArr.map((e,i)=>{
                    let index  = that.barList.findIndex(e1=> e1.name == e.name)
                    // console.log(index)
                    
                    if(index !== -1){
                        svg.selectAll('rect')
                        // .filter(`:nth-child(${index+1})`)
                        .filter(function(params) {
                            return params.name == e.name
                        })
                        .transition().duration(1000)
                            .attr('y', e.index * 80)
                            .attr('width', linear(e.value))

                        svg.selectAll('.text').filter(function(params) {
                            return params.name == e.name
                        }).transition().duration(1000)
                            .attr('y', e.index * 80 + 25)

                        svg.selectAll('.text1').filter(function(params) {
                            return params.name == e.name
                        }).transition().duration(1000)
                            .attr('x', linear(e.value) + 60)
                            .attr('y', e.index * 80 + 25)
                            .text(e.value)

                    //     if(!nowNameArr.includes(that.barList[i])){
                    //     svg.selectAll('rect').filter(function(params) {
                    //         return params.name == that.barList[i].name
                    //     }).attr('y', that.barList[i].index * 80)
                    //         .attr('width', 0)

                    //     svg.selectAll('.text').filter(function(params) {
                    //         return params.name == that.barList[i].name
                    //     })
                    //      .attr('y', that.barList[i].index * 80 + 25)
                    //      .text('')

                    //     svg.selectAll('.text1').filter(function(params) {
                    //         return params.name == that.barList[i].name
                    //     }).transition().duration(1000)
                    //         .attr('x', linear(that.barList[i].value) + 60)
                    //         .attr('y', 0)
                    //         .text('')
                    // }
                    }else{
                        console.log(e.index)
                        svg.selectAll('rect').filter(`:nth-child(${i+1})`)
                            .attr('y',800)
                            .attr('width',0)
                            .attr('fill',function(d) {
                                return e.color
                            })
                            .transition().duration(1000)
                            .attr('y', e.index * 80)
                            .attr('width', linear(e.value))
                        
                        svg.selectAll(`.text`).filter(function(d) {
                            return d.name == that.barList[i].name
                            })
                            .attr('fill', e.color)
                            .attr('y', 800)
                            .transition()
                            .duration(1000)
                            .attr('y', e.index * 80 + 25)
                            .text(e.name)

                        svg.selectAll('.text1').filter(function(d) {
                            return d.name == that.barList[i].name
                            })
                            .attr('x', padding)
                            .attr('y', 800)
                            .attr('fill', e.color)
                            .transition().duration(1000)
                            .attr('x', linear(e.value) + 60)
                            .attr('y', e.index * 80 + 25)
                            .text(e.value)

                    }
                    
                })
                
                that.barList = nowArr  
                d3.select('svg').selectAll('rect').data(that.barList)
                d3.select('svg').selectAll('.text').data(that.barList)
                d3.select('svg').selectAll('.text1').data(that.barList)
             }, 3000);  */
        },
        methods: {
            drawRect(data){
                let oldNameArr = that.barList.map(e=>e.name)
                let nowNameArr = nowArr.map(e=>e.name)
                console.log(data)
                d3.select('svg').selectAll('rect').data(data)
                .each(function(d) {
                    console.log(d)
                    if(oldNameArr.includes(d.name)){
                        let item  = that.barList.find(e1=> e1.name == e.name)
                    d3.select(this)
                    .attr('height', 40)
                    .attr('fill', item.color)
                    .attr('rx', 20)
                    .attr('ry', 20)
                    .attr('x', padding)
                    .attr('y', item.index * 80)
                    .attr('width', linear(item.value))
                    .transition()
                    .duration(1000)
                    
                    .attr('y', d.index * 80)
                    .attr('width', linear(d.value))
                    

                    }
                    
                })
                    
            },
            init() {
                let that = this
                var color = d3.schemeCategory10;

                linear = d3.scaleLinear().domain([0, that.barList[0].value]).range([0, width - 2 * 50])

                svg = d3.select('#svgBox')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    // .selectAll('g')
                    // .data(that.barList)
                    // .enter()
                    // .append('g')

                // 回执柱形图

                svg.selectAll('rect')
                    .data(that.barList)
                    .enter()
                    .append('rect')
                    .classed('bar', true)
                    .attr('rx', 20)
                    .attr('ry', 20)
                    .attr('x', padding)
                    .attr('y', function (d, i) {
                        return i * 80
                    })
                    .attr('width', function (d, i) {
                        return linear(d.value)
                    })
                    .attr('height', 40)
                    .attr('fill', function (d, i) {
                        return d.color
                    })

                // 添加文字
                svg.selectAll('.text')
                    .data(that.barList)
                    .enter()
                    .append('text')
                    .classed('text', true)
                    .attr('x', 0)
                    .attr('y', function (d, i) {
                        return i * 80 + 25
                    })
                    .attr('fill', function (params) {
                        return params.color
                    })
                    .text(function (params) {
                        return params.name
                    })

                // 添加文字
                svg.selectAll('.text1')
                    .data(that.barList)
                    .enter()
                    .append('text')
                    .classed('text1', true)
                    .attr('x', function (d) {
                        return linear(d.value) + 60
                    })
                    .attr('y', function (d, i) {
                        return i * 80 + 25
                    })
                    .attr('fill', function (params) {
                        return params.color
                    })
                    .text(function (params) {
                        return params.value
                    })
            },
            //生成模拟数据
            makeData() {
                var color = d3.schemeCategory20;
                let city = ['上海', '北京', '广州', '深圳', '武汉', '杭州', '成都', '苏州', '南京', '重庆', '天津', '长沙', '郑州', '青岛']
                let resArr = []
                city = city.map((e, i) => {
                    return {
                        name: e,
                        color: color[i % 20]
                    }
                })
                for (let i = 2000; i < 2021; i++) {   //生成2000年到2021年的数据
                    let tempArr = []
                    city.map(e => {
                        tempArr.push({
                            name: e.name,
                            color: e.color,
                            value: this.random(2000, 10000)
                        })
                    })
                    tempArr.sort(this.compare('value'))
                    tempArr = tempArr.map((e1, i) => {
                        e1.index = i
                        return e1
                    })
                    tempArr = tempArr.filter((e2, i2) => {   //取前十的数据
                        return i2 < 11
                    })
                    resArr.push(tempArr)
                }
                // console.log(resArr)
                this.moniData = resArr
                this.barList = this.moniData[0]
            },
            // 生成某个范围内的随机数
            random(min, max) {

                return Math.floor(Math.random() * (max - min)) + min;

            },
            // 根据对象数组中的某一个属性值进行排序
            compare(propertyName) {
                return function (object1, object2) {
                    var value1 = object1[propertyName]
                    var value2 = object2[propertyName]
                    if (value2 < value1) {
                        return -1
                    } else if (value2 > value1) {
                        return 1
                    } else {
                        return 0
                    }
                }
            },

        },
    };
</script>

<style scoped>

</style>