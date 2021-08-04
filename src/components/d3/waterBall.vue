<template>
    <div class="containerBox" :style="{'width':boxWidth+'px','height':boxWidth+'px'}">
        <span class="valueText" :style="{'fontSize':boxWidth*0.25+'px','color':option.wave.color}">{{option.wave.height}}%</span>
        <div class="container" id="root" :style="{'width':boxWidth+'px','height':boxWidth+'px'}"></div>
    </div>

</template>

<script>
    import * as d3 from 'd3';
    let max
    let width    //svg宽度
    let hight    //svg高度
    let value  //水的高度
    let waveColor   //海浪颜色
    let textColor   //文本颜色
    let outCircleColor   //外环颜色

    let areaData
    let waveShape
    let area
    let defs
    let waveText
    let svg
    export default {
        props: {
            optionProp:{
                type:Object,
                default:null
            }
        },
        data() {
            return {
                svg: null,
                area: null,
                areaData:null,
                waveShape: null,
                defs: null,
                waveText: null,
                option:{
                    // svg相关字段
                    svgWidth:'500',  //svg宽度
                    svgHeight:'500', //svg高度
                    // 海浪动画相关配置属性
                    wave:{
                        height:'50', //海浪高度
                        color:'#4876FF',  //海浪颜色
                        speed:100,  //海浪流动速度   值越大速度越慢
                    },
                    outCircle:{   //外环配置
                         color:'#4876FF'  //外环颜色
                    },
                    text:{  //文本配置
                        color:'#4876FF',   //文本颜色
                        fontSize:'', //文本大小
                        x:'', //横坐标
                        y:'', //纵坐标
                    }
                },
          
                boxWidth: '500',
                // textColor: "#4876FF",
                // value: '50'
            };
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
                   d3.select("svg").remove()
                   this.init()
               }
            }
        },
        mounted() {
            this.init()
            this.animate();  //实现波浪动画
        },
        methods: {
            init() {
                const that = this
                 that.areaData = that.makeData(that.option.wave.height)
                 that.svg = d3.select("#root").append("svg")              //创建svg
                    .attr("width", that.option.svgWidth + 'px')  //长
                    .attr("height", that.option.svgHeight + 'px') //高
                    .attr('class', 'svg_style')
                that.renderArea()
                that.renderPie()
                // that.renderText()
            },
            renderArea() {
                let that = this
                that.area = d3.area()
                    .x(function (d, i) {
                        if (i != (that.areaData.length - 1)) {
                            return i * (that.option.svgWidth / that.option.wave.speed)
                        } else {
                            return i * (that.option.svgWidth /  that.option.wave.speed * 2)
                        }

                    })
                    .y0(that.option.svgWidth - that.option.svgWidth / 2 * 0.16)
                    .y1(function (d, i) { return that.option.svgHeight - d })
                    .curve(d3.curveBasis)


                that.defs = that.svg.append('defs')
                    .append("clipPath").attr('id', 'clip')
                    .append("circle").attr('cx', that.option.svgWidth / 2).attr('cy', that.option.svgWidth / 2).attr('r', that.option.svgWidth / 2 * 0.84)

                    that.waveShape = that.svg.append("path")
                    .attr("id", "wave")
                    .attr("class", 'pathArea')
                    .attr("fill", that.option.wave.color)
                    .attr("d", that.area(that.areaData))
                    .attr("style", "clip-path: url(#clip);")   //用圆形 裁剪波浪动画
            },
            renderPie() {
                let that = this
                let arc = d3.arc().outerRadius(that.option.svgWidth * 0.46).innerRadius(that.option.svgWidth * 0.44);
                let pie = d3.pie();
                let pieData = pie([1])
                that.svg.append("path").data(pieData)
                    .attr("transform", `translate(${that.option.svgWidth / 2},${that.option.svgWidth / 2})`)
                    .attr("d", d => arc(d))
                    .attr("fill", that.option.outCircle.color)
            },
            renderText() {
                let that = this
                that.waveText = that.svg.append("text").append('tspan')
                    .attr("x", that.option.svgWidth * 0.3)
                    .attr("y", that.option.svgWidth * 0.56)
                    .classed("ts", true)
                    //  .attr('fontSize','500px')
                    .attr("fill", that.option.text.color)
                    .text(that.option.wave.height + '%')
            },
            makeData(val) {
                let that = this
                let arr0 = []
                for (let i = 0; i < that.option.wave.speed; i++) {
                    let r = i / that.option.wave.speed * 2;
                    arr0.push(r);
                }

                let d = that.option.svgWidth / (arr0.length - 1);
                let wave_height = 3;     //波浪高度
                let area_data = arr0.map(function (y, i) {
                    return [that.option.svgHeight * (1 - (wave_height * Math.sin(y * Math.PI) + (100 - val)) / 100)]; //+2将范围[-1,1]转成[1,3]
                });
                return area_data
            },
            sum(m, n) {
                let num = Math.floor(Math.random() * (m - n) + n);
                return num
            },
            getNextData(data) {
                var r = data.slice(1);
                r.push(data[0]);
                return r;
            },
            renderWave() {
    
                this.areaData = this.getNextData(this.areaData);
                this.waveShape.attr("d", this.area(this.areaData))
                requestAnimationFrame(this.renderWave);
            },
            animate() {
                requestAnimationFrame(this.renderWave);
            }
        },
    };
</script>

<style>
    .containerBox {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
    }

    .valueText {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        /* top: 50%;
      left: 50%;
      font-size: 30px; */
        z-index: 1;
        -webkit-text-stroke: 2px white;
    }

    .ts {
        font-size: 100px;
        stroke: #ffffff;
        stroke-width: 2px;
        font-weight: bold;
    }

    /* .axis{
        border:1px solid black;
    } */

    .svg_style {
        display: flex;
        justify-content: center;
        align-items: center;

        /* -moz-box-shadow:0px 0px 20px #333333;
        -webkit-box-shadow:0px 0px 20px #333333;
        box-shadow:0px 0px 20px #333333; */
    }


    .zoom {
        width: 700px;
        height: 700px;
        position: absolute;
        background-color: red;
        top: 0;
        right: 0;
        animation: myfirst 0.5s;
    }

    @keyframes myfirst {
        from {
            width: 0;
            height: 0;
        }

        to {
            width: 700px;
            height: 700px;
        }
    }

    @-webkit-keyframes myfirst

    /* Safari and Chrome */
        {
        from {
            width: 0;
            height: 0;
        }

        to {
            width: 700px;
            height: 700px;
        }
    }
</style>