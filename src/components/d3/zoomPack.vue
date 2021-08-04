<template>
    <div>
        <svg :width="option.borderLength" :height="option.borderLength">
            <g class="cc"></g>
        </svg>
    </div>

</template>

<script>
    // import * as d3 from 'd3';
   
    export default {
        props: {
            optionProp:{
                type:Object,
                default:null
            }
        },
        data() {
            return {
                arr: [],
                colorScale: null,
                packLayout: null,
                rootNode: [],
                nodes:null,
                curObj:null,
                option:{
                    borderLength:600,
                    colorRange:['#FF1493','#FFB6C1'],
                    data: {
                    "name": "A1",
                    "id":"A1001",
                    'isNode': false,
                    "children": [
                        {
                            "name": "B1",
                            "id":"B1001",
                            'isNode': false,
                            "children": [
                                {
                                    "name": "C1",
                                    "id":"C1001",
                                    'isNode': true,
                                    "value": 50
                                },
                                {
                                    "name": "C2",
                                    "id":"C2001",
                                    'isNode': true,
                                    "value": 300
                                },
                                {
                                    "name": "C3",
                                    "id":"C3001",
                                    'isNode': true,
                                    "value": 180
                                }
                            ]
                        },
                        {
                            "name": "B2",
                            "id":"B2001",
                            "value": 110
                        }
                    ]
                }
                },
                
            };
        },
        computed:{
            maxValue(){
                let arr1 = this.arr.map(e=>e.value)
                return d3.max(arr1)
            }
        },
        watch: {
            optionProp(val){
               if(val){
                   for(let key in val){
                       if(val[key] instanceof Object){
                        this.option[key] = Object.assign({},this.option[key],val[key]) 
                       }else{
                        this.option[key] = val[key]
                       }
                      
                   }
                //    d3.select("svg").remove()
                   this.init()
               }
            }
        },
        mounted() {
           this.init()
        },
        methods: {
            init() {
                this.colorScale = d3.interpolate(d3.rgb(this.option.colorRange[0]),d3.rgb(this.option.colorRange[1]) ) //颜色插值   //d3.scaleOrdinal().domain([0, 300]).range(['#28004d','#b15bff'])
                this.packLayout = d3.pack()   //打包图初始化
                    .size([this.option.borderLength, this.option.borderLength])
                    .padding(10)
 
                /* 数据处理 */
                this.rootNode = d3.hierarchy(this.option.data)
                this.rootNode.sum(function (d) {
                    return d.value;
                });
                this.packLayout(this.rootNode);

                //绘制图形
                this.renderPack()
            },
            renderPack() {
            let that = this

            d3.select('svg g').selectAll('g').remove()
            that.nodes = null
            that.arr = []

            // 点击空白区域  reset
            d3.select('svg').on('click', function () {
                that.renderPack()
            })

            that.nodes = d3.select('svg g.cc')
                .selectAll('g')
                .data(that.rootNode.descendants())
                .enter()
                .append('g')
                .attr("class", 'c1')
                .attr('transform', function (d) {
                    that.arr.push(d)
                    return 'translate(' + [d.x, d.y] + ')'
                })
                .on("click", function (d, i, c) {

                    d3.event.stopPropagation();  //d3阻止冒泡事件
                    if(that.curObj && that.curObj.data.id == d.data.id){
                        /* 再次点击当前元素复原 */
                        that.arr.forEach(function(element, i1){
                        d3.select('svg g').selectAll('g').filter(`:nth-child(${i1 + 1})`)
                             .transition().duration(400)
                            .attr('transform', `translate(${element.x},${element.y}) scale(${1})`)
                      
                       });
                        that.curObj = null
                    }else{
                        that.curObj = d
                        let r = that.option.borderLength/2/ d.r
                        that.arr.forEach(function(element, i1){
                        let xb = (element.x - d.x) * r + that.option.borderLength/2
                        let yb = (element.y - d.y) * r + that.option.borderLength/2
                      
                        d3.select('svg g').selectAll('g').filter(`:nth-child(${i1 + 1})`)
                             .transition().duration(400)
                            .attr('transform', `translate(${xb},${yb}) scale(${r})`)
                      
                       });
                    }
                    
                });
       
            this.nodes
                .append('circle')
                .attr("fill", (d, i) => {
                    if(d.data.bgColor){
                        return d3.rgb(d.data.bgColor)
                    }else{
                        return that.colorScale(d.value/this.maxValue)
                    }
                    
                })
                .attr('r', function (d) { return d.r; })

            this.nodes
                .append('text')
                .attr('dy', 4)
                .text(function (d) {
                    return d.children === undefined ? d.data.name : '';
                })


        }

        },
        
    };
</script>

<style>
    .container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    /* .axis{
        border:1px solid black;
    } */
    .c1 {
        fill: red;
        stroke: white;
        stroke-width: 1px;
    }

    .c2 {
        fill: green;
        stroke: white;
        stroke-width: 1px;
    }
</style>