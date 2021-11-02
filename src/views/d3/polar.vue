<template>
    <div id="svgBox" style="background-color: black;height: 98vh;">

    </div>
</template>

<script>
    let width = 800
    let height = 800
    var color = d3.scaleOrdinal(d3.schemeCategory10);
    let svg = null
    let polarData = []
    let picData = []
    let picData1 = []
    let gPolarAxis
    import * as turf from '@turf/turf'
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
            init() {
                
                this.makeData()

                svg = d3.select('#svgBox').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svgb')
                    .style('background', 'black')

                // this.renderPolarAxis()
                this.renderShape()
                
                // setInterval(() => {
                //     this.reDraw()
                // }, 3000);

            },
            reDraw(){
                
                this.picData = []
                this.picData1 = []
                this.makeData()

                svg = d3.select('#svgBox').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svgb')
                    .style('background', 'black')

                // this.renderPolarAxis()
                this.renderShape()
            },
            renderShape() {
                
                let gShape = svg.append('g').attr('class', 'gShape')
                let linePath = d3.line().x(function (d) {
                  
                    return d[0]
                }).y(function (d) {
                    return d[1]
                })
                .curve(d3.curveBasis)
                // .tension(0.8)
                picData.map((e,i) => {
                    
                    e.map((e1,i1) => {
                       
                            gShape.append('path').attr('class', 'gShapeLine')
                            .attr('stroke', '#00FFFF')
                            .attr('stroke-width', 2)
                            .attr('fill', 'black')
                            .attr('d', linePath(picData1[i][i1]))
                            .transition()
                            .duration(3000)
                            .attr('d', linePath(e1))
                        
                    })
                    
                    //-----------------------
                   
                    svg.append('text').attr('class','textt').attr('x',e[1][1][0]).attr('y',e[1][1][1]).attr('fill','#00FFFF').text('测试')
                    // .attr('dx',50)
                    // .attr('dy',-50)

                })
            },
            // 绘制极坐标
            renderPolarAxis() {
                let gPolarAxis = svg.append('g').attr('class', 'polarAxis')
                polarData.map(function (d) {
                    gPolarAxis.append('line')
                        .attr('class', 'polarAxisLine')
                        .attr('stroke', 'rgb(190,190,190)')
                        .attr('stroke-width', 2)
                        .attr('stroke-dasharray', '10 10')
                        .attr('x1', d.startPosition.x)
                        .attr('y1', d.startPosition.y)
                        .attr('x2', d.endPosition.x)
                        .attr('y2', d.endPosition.y)
                })
            },
            random(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            },

            // 造数据
            makeData() {
                // 造极坐标数据
                let degreeArr = [0, 45, 90, 135, 180, 225, 270, 315, 360]
                degreeArr.map(e => {
                    polarData.push({
                        startPosition: {
                            x: width / 2,
                            y: height / 2
                        },
                        endPosition: this.getPositionByLenRotate(e, 350, width / 2, height / 2)
                    })
                })


                // 造图数据
                picData = []
                picData1 = []
                let newData = d3.pairs(degreeArr)
                newData = newData.map(e => {
                    e.splice(1, 0, (e[0] + e[1]) / 2)
                    return e
                })

                newData.map(e => {
                    let arr = []
                    let arr1 = []
                    let random = this.random(20, 70)
                    for (let i = 0; i < 5; i++) {
                        let obj = {
                            start: this.getPositionByLenRotate(e[0], 50, width / 2, height / 2),
                            mid: this.getPositionByLenRotate(e[1], 50 + random * 5 - i * random, width / 2, height / 2),
                            end: this.getPositionByLenRotate(e[2], 50, width / 2, height / 2),
                        }
                        arr.push([[obj.start.x * 1, obj.start.y * 1],
                        [obj.mid.x * 1, obj.mid.y * 1],
                        [obj.end.x * 1, obj.end.y * 1]])

                        let obj1 = {
                            start: this.getPositionByLenRotate(e[0], 50, width / 2, height / 2),
                            mid: this.getPositionByLenRotate(e[1], 50, width / 2, height / 2),
                            end: this.getPositionByLenRotate(e[2], 50, width / 2, height / 2),
                        }
                        arr1.push([[obj1.start.x * 1, obj1.start.y * 1],
                        [obj1.mid.x * 1, obj1.mid.y * 1],
                        [obj1.end.x * 1, obj1.end.y * 1]])
                    }
                    picData.push(arr)
                    picData1.push(arr1)
                })
                
            },
            //已知起始点  角度 长度   求目标点位置
            getPositionByLenRotate(degree, len, x1, y1) {
                let obj = {
                    x: '',
                    y: ''
                }
                obj.x = (Math.cos(Math.PI / 180 * degree) * len + x1).toFixed(0)
                obj.y = (Math.sin(Math.PI / 180 * degree) * len + y1).toFixed(0)
                return obj
            }
        },
    };
</script>

<style scoped>
    .svgb {
        background: black;
    }
</style>