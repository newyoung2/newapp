<template>
    <div id="svgBox" width="1000" height="1000">
        <svg width="1000" height="1000">
            <clipPath id="clipCircle">
                <circle r="40" cx="40" cy="40" />
            </clipPath>
            <defs>
                <pattern id="raduisImage" patternUnits="userSpaceOnUse" width="40" height="40">
                    <image xlink:href="https://img1.baidu.com/it/u=623994087,1173615898&fm=26&fmt=auto&gp=0.jpg" x="0"
                        y="0" width="40" height="40" />
                </pattern>
            </defs>

        </svg>
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
                nodes: [{ name: "大娃" }, { name: "二娃" },
                { name: "三娃" }, { name: "四娃" },
                { name: "五娃" }, { name: "六娃" },
                { name: "七娃" }],
                links: [{ source: 0, target: 1 }, { source: 0, target: 2 },
                { source: 0, target: 3 }, { source: 1, target: 4 },
                { source: 1, target: 5 }, { source: 1, target: 6 }],
                svg: null,
                circle: null,
                curDom: null


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
                            .attr('x', function (d) {
                                return d.x - 50
                            })
                            .attr('y', function (d) {
                                return d.y - 80
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

                that.svg = d3.select('svg').append('g')

                /* 添加文本 */
                that.svg.selectAll('line')
                    .data(that.links)
                    .enter()
                    .append('line')
                    .classed('line', true)
                    .style("stroke", "#ccc")
                    .style("stroke-width", 3)


                /* 添加节点 */
                that.svg.selectAll('image')
                    .data(that.nodes)
                    .enter()
                    .append('image')
                    .classed('circle', true)
                    .attr('width', 100)
                    .attr('height', 100)
                    .attr('xlink:href', 'img/0.png')
                    .on('mouseover', function (d, i) {
                        d3.select(this).attr('xlink:href', 'img/1.png').transition().duration(200).attr('width', 200).attr('height', 200)

                        let arr = []
                        that.links.map(e => {
                            if (d.index == e.source.index) {
                                arr.push(e.target.index)
                            } else if (d.index == e.target.index) {
                                arr.push(e.source.index)
                            }
                        })

                        that.svg.selectAll('image').filter(function (d) {
                            return arr.includes(d.index)
                        }).attr('xlink:href', 'img/1.png')


                    })
                    .on('mouseout', function (d, i) {
                        d3.select(this).attr('xlink:href', 'img/0.png').transition().duration(200).attr('width', 100).attr('height', 100)
                        let arr = []
                        that.links.map(e => {
                            if (d.index == e.source.index) {
                                arr.push(e.target.index)
                            } else if (d.index == e.target.index) {
                                arr.push(e.source.index)
                            }
                        })

                        that.svg.selectAll('image').filter(function (d) {
                            return arr.includes(d.index)
                        }).attr('xlink:href', 'img/0.png')
                    })
                    // .attr('clip-path','url(#clipCircle)')
                    // .attr("r", 40)
                    // .style("fill", function (d, i) {
                    //     return 'url(#raduisImage)'//color(i);
                    // })
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
                    .style("fill", "black")
                    .attr("dx", -15)
                    .attr("dy", -90)
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