<template>
    <div id="svgBox" width="600" height="600">

    </div>

</template>

<script>
    // import * as d3 from 'd3';
    import * as turf from '@turf/turf'
    let simulation = null
    export default {
        props: {
            optionProp: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                nodes: [{ name: "桂林" }, { name: "广州" },
                { name: "厦门" }, { name: "杭州" },
                { name: "上海" }, { name: "青岛" },
                { name: "天津" }],
                links: [{ source: 0, target: 1 }, { source: 0, target: 2 },
                { source: 0, target: 3 }, { source: 1, target: 4 },
                { source: 1, target: 5 }, { source: 1, target: 6 }],
                svg: null,
                circle: null


            };
        },
        computed: {

        },
        watch: {

        },
        mounted() {
            this.init()

        },
        methods: {
            init() {
                let that = this
                var width = 1000;
                var height = 1000;
                var color = d3.scaleOrdinal(d3.schemeCategory20);

                //初始化力学仿真器，通过布局函数格式化数据    
                simulation = d3.forceSimulation(that.nodes)
                    .force("link", d3.forceLink(that.links).distance(300))   //distance设置连线距离
                    .force("charge", d3.forceManyBody().strength(-100))  //注1> 
                    .force("center", d3.forceCenter(width / 2, height / 2))  //设置力学仿真器的中心
                    .on("tick", function () {

                        d3.selectAll('.circle')
                            .attr('cx', function (d) {
                                return d.x
                            })
                            .attr('cy', function (d) {
                                return d.y
                            })

                        d3.selectAll('.text')
                            .attr('x', function (d) {
                                return d.x
                            })
                            .attr('y', function (d) {
                                return d.y
                            })

                        d3.selectAll('.line')
                            .attr("x1", function (d) {
                                return d.source.x;
                            })
                            .attr("y1", function (d) {
                                return d.source.y;
                            })
                            .attr("x2", function (d) {
                                return d.target.x;
                            })
                            .attr("y2", function (d) {
                                return d.target.y;
                            });
                    });

                // console.log(that.nodes)
                // console.log(that.links)

                that.svg = d3.select('#svgBox').append('svg').attr('width', width).attr('height', height).append('g')

                /* 添加文本 */
                that.svg.selectAll('line')
                    .data(that.links)
                    .enter()
                    .append('line')
                    .classed('line', true)
                    .style("stroke", "#ccc")
                    .style("stroke-width", 3)


                /* 添加节点 */
                that.svg.selectAll('circle')
                    .data(that.nodes)
                    .enter()
                    .append('circle')
                    .classed('circle', true)
                    .attr("r", 40)
                    .style("fill", function (d, i) {
                        return color(i);
                    })
                    .call(d3.drag().on("start", function (d) {
                        if (!d3.event.active) simulation.alphaTarget(0.3).restart(); //alpha是动画的冷却系数，运动过程中会不断减小，直到小于0.005为止，此时动画会停止。
                        d.fx = d.x;    //fx为固定坐标，x为初始坐标  注3>  
                        d.fy = d.y;
                    })
                        .on("drag", function (d) {
                            d.fx = d3.event.x;  //fevent.x为拖拽移动时的坐标
                            d.fy = d3.event.y;
                        })
                        .on("end", function (d) {
                            if (!d3.event.active) simulation.alphaTarget(0);
                            d.fx = null;        //固定坐标清空
                            d.fy = null;
                        }));


                /* 添加文本 */
                that.svg.selectAll('text')
                    .data(that.nodes)
                    .enter()
                    .append('text')
                    .classed('text', true)
                    .style("fill", "white")
                    .attr("dx", -15)
                    .attr("dy", 8)
                    .text(function (d) {
                        return d.name;
                    });

                

            },



        },

    };
</script>

<style>
    #svgBox {
        position: relative;
    }

    .text {
        pointer-events: none;
    }

    .toolTip {
        position: absolute;
        z-index: 1000;
        width: 130px;
        height: 77px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 15px;
        color: white;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .toolTipText {
        font-size: 12px;
        letter-spacing: 1px;
        margin: 2px 0;
    }
</style>