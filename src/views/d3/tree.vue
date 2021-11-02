<template>
    <div id="svgBox">

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

                let data = {
                    name: '0',
                    children: [{
                        name: 'A',
                        children: [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }]
                    }, {
                        name: 'B',
                        children: [{ name: 'B1' }, { name: 'B2' }, { name: 'B3' }]
                    }]
                }

                svg = d3.select('#svgBox').append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'svgb')

                /* 数据准备 */
                // 创建一个树生成器
                var tree = d3
                    .tree()
                    .size([width, height - 200])
                    .separation(function (a, b) {
                        return (a.parent == b.parent ? 1 : 2);
                    });

                // 创建一个层级布局
                var hierarchyData = d3.hierarchy(data).sum(function (d) {
                    return d.value;
                });

                var treeData = tree(hierarchyData)
                var nodes = treeData.descendants();   //生成节点的数据
                var links = treeData.links();    //生成连线的数据
                console.log(nodes)
                console.log(links)
                /* 绘制线条 */
                //创建一个贝塞尔生成曲线生成器
                var generator = d3
                    .linkVertical()
                    .x(function (d) {
                        return d.x;
                    })
                    .y(function (d) {
                        return d.y + 50;
                    });

                //绘制线条
                svg.append("g")
                    .selectAll(".linePath")
                    .data(links)
                    .enter()
                    .append("path")
                    .attr('class', 'linePath')
                    .attr("d", function (d) {
                        var start = { x: d.source.x, y: d.source.y };
                        var end = { x: d.target.x, y: d.target.y };
                        return generator({ source: start, target: end });
                    })
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr('opacity', function (d) {

                        return d.source.depth < 0 ? '1' : '0'
                    })


                /* 绘制节点 */
                var gNode = svg.selectAll('.node').data(nodes).enter().append('g').attr('class', 'node').attr('transform', function (d) {

                    return `translate(${d.x},${d.y + 50})`
                })

                gNode.append('circle').attr('r', 5).attr("fill", "white")
                    .attr("stroke", "#000")
                    .attr("stroke-width", 1)
                    .attr('opacity', function (d) {
                        return d.depth < 1 ? '1' : '0'
                    })
                    .on('click', function (d, i) {
                        console.log()
                        if (!d.show) {
                            gNode.selectAll('circle').filter(function (d1) {

                                return d1.parent && d1.parent.data.name == d.data.name
                            })
                                .attr('opacity', '0')
                                .transition()
                                .duration(500)
                                .attr('opacity', '1')


                            gNode.selectAll('text').filter(function (d1) {

                                return d1.parent && d1.parent.data.name == d.data.name
                            })
                                .attr('opacity', '0')
                                .transition()
                                .duration(500)
                                .attr('opacity', '1')

                            svg.selectAll('.linePath').filter(function (d1) {
                                return d1.source.data.name == d.data.name
                            })
                                .attr('opacity', '1')
                                .attr("d", function (d) {
                                    var start = { x: d.source.x, y: d.source.y };
                                    var end = { x: d.source.x, y: d.source.y };
                                    return generator({ source: start, target: end });
                                })
                                .transition()
                                .duration(500)
                                .attr("d", function (d) {
                                    var start = { x: d.source.x, y: d.source.y };
                                    var end = { x: d.target.x, y: d.target.y };
                                    return generator({ source: start, target: end });
                                })
                            d.show = true
                        } else {
                            gNode.selectAll('circle').filter(function (d1) {

                                return d1.parent && d1.parent.data.name == d.data.name
                            })
                                .attr('opacity', '1')
                                .transition()
                                .duration(500)
                                .attr('opacity', '0')

                            gNode.selectAll('text').filter(function (d1) {

                                return d1.parent && d1.parent.data.name == d.data.name
                            })
                                .attr('opacity', '1')
                                .transition()
                                .duration(500)
                                .attr('opacity', '0')

                            svg.selectAll('.linePath').filter(function (d1) {
                                return d1.source.data.name == d.data.name
                            })
                                .attr('opacity', '1')
                                .attr("d", function (d) {
                                    var start = { x: d.source.x, y: d.source.y };
                                    var end = { x: d.target.x, y: d.target.y };
                                    return generator({ source: start, target: end });
                                })
                                .transition()
                                .duration(500)
                                .attr("d", function (d) {
                                    var start = { x: d.source.x, y: d.source.y };
                                    var end = { x: d.source.x, y: d.source.y };
                                    return generator({ source: start, target: end });
                                })
                                .attr('opacity', '0')
                            d.show = false
                        }






                    })

                gNode.append('text').text(function (d) {
                    return d.data.name
                })
                    .attr("dx", function (d) {
                        return d.children ? -20 : -7
                    })
                    .attr("dy", function (d) {
                        return d.children ? 5 : 30
                    })
                    .attr('opacity', function (d) {
                        return d.depth < 1 ? '1' : '0'
                    })


            }



        },
    };
</script>

<style scoped>
    .svgb {}
</style>