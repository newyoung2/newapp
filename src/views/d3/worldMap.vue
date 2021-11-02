<template>
    <div id="svgBox" width="1000" height="1000">
        <div class="toolTip" v-show="tipObj.name">
            <div
                style="width: 100%;display: flex;justify-content: center;align-items: center;padding: 5px 0;font-size: 14px;">
                {{tipObj.name}}</div>
           
        </div>
    </div>

</template>

<script>
    // import * as d3 from 'd3';
    import * as turf from '@turf/turf'
    let simulation = null
    let rotateX = 0
    let movePosition = 0
    export default {
        props: {
            optionProp: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                tipBox: null,
                tipObj: {
                    name: '',
                },
                endPoint: 0,
                features: null,
                projection: null,
                isStop: false,
                publicPath: process.env.BASE_URL,


            };
        },
        computed: {

        },
        watch: {

        },
        mounted() {
            this.init()
            requestAnimationFrame(this.redraw)
        },
        methods: {

            //  重绘函数
            redraw() {
                let that = this
                if (!that.isStop) {
                    //  旋转地图角度
                    let proj = that.projection.rotate([rotateX, 0, 0])
                    let path = d3.geoPath().projection(that.projection)
                    //  这里只需要更新
                    that.svg.select('g.map')
                        .selectAll('.country')
                        .attr('d', path)
                    rotateX += 1
                    //  准备执行下次动画

                }
                requestAnimationFrame(that.redraw)
            },

            init() {
                let that = this
                var width = 800,
                    height = 800;

                that.svg = d3
                    .select("#svgBox")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height);

                that.projection = d3
                    .geoOrthographic()
                    .scale(330)
                    .translate([width / 2, height / 2])
                    .rotate([0, 0, 0])

                let path = d3.geoPath().projection(that.projection);

                /* 渲染一个圆形  填充颜色当做地球海洋的底色 */
                var geoCircle = d3.geoCircle()
                that.svg.append('g')
                    .attr('class', 'geoCircle')
                    .append('path')
                    .datum(geoCircle)
                    .attr('class', 'graticule')
                    .attr('d', path)
                    .attr('fill', '#00B2EE')
                    .on('mouseover', function (d) {
                        that.isStop = true
                    })
                    .on('mouseout', function (d) {
                        that.isStop = false
                    })
                    .call(d3.drag().on("start", function (d) {  //鼠标拖动地球
                        movePosition = d3.event.x
                    })
                        .on("drag", function (d) {

                            if (d3.event.x > movePosition) {
                                rotateX += 1
                            } else {
                                rotateX -= 1
                            }

                            let proj = that.projection.rotate([rotateX, 0, 0])
                            that.path = d3.geoPath().projection(that.projection)
                            //  这里只需要更新
                            that.svg.select('g.map')
                                .selectAll('.country')
                                .attr('d', that.path)
                            movePosition = d3.event.x
                        })
                        .on("end", function (d) {
                            movePosition = 0
                        }));

                // //  渲染方格
                // var graticule = d3
                //     .geoGraticule()
                // that.svg.append('g')
                //     .attr('class', 'grid')
                //     .append('path')
                //     .datum(graticule)
                //     .attr('class', 'graticule')
                //     .attr('d', that.path)
                //     .attr('stroke-width', '1px')
                //     .attr('stroke', '#EEE')

                var color = d3.schemeCategory10;

                var url = `${this.publicPath}geoData/countries.geo.json`;
                d3.json(url).then(root=>{
                    that.features = root.features
                    // 渲染地图
                    that.svg.append('g')
                        .attr('class', 'map')
                        .selectAll('.country')
                        .data(that.features)
                        .enter()
                        .append('path')
                        .attr('class', 'country')
                        .attr('d', path)
                        .style("fill", function (d, i) {
                            return color[i % 10];
                        })
                        .attr('opacity', 0.8)
                        .on('mouseover', function (d) {
                            console.log(d)
                            d3.select(this).attr('opacity', 1)
                            that.isStop = true

                            /* 提示框 */
                        that.tipObj.name = d.properties.name
                        if (!that.tipBox) {
                            that.tipBox = d3.select(".toolTip")
                                .style('left', d3.event.pageX - 180 + 'px')
                                .style('top', d3.event.pageY - 100 + 'px')
                        } else {
                            that.tipBox.style('left', d3.event.pageX - 180 + 'px')
                                .style('top', d3.event.pageY - 100 + 'px')
                        }

                        })
                        .on('mouseout', function (d) {
                            d3.select(this).attr('opacity', 0.8)
                            that.isStop = false
                            that.tipObj.name = ''
                        })
                        .call(d3.drag().on("start", function (d) {   //鼠标拖动地球
                            movePosition = d3.event.x
                        })
                            .on("drag", function (d) {

                                if (d3.event.x > movePosition) {
                                    rotateX += 1
                                } else {
                                    rotateX -= 1
                                }

                                let proj = that.projection.rotate([rotateX, 0, 0])
                                that.path = d3.geoPath().projection(that.projection)
                                //  这里只需要更新
                                that.svg.select('g.map')
                                    .selectAll('.country')
                                    .attr('d', that.path)
                                movePosition = d3.event.x
                            })
                            .on("end", function (d) {
                                movePosition = 0
                            }));
                })

            },
        },

    };
</script>

<style>
    #svgBox {
        position: relative;
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