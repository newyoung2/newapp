<template>
    <div id="svgBox" width="600" height="600">
        <div class="toolTip" v-show="tipBox">
            <div
                style="width: 100%;display: flex;justify-content: center;align-items: center;padding: 5px 0;font-size: 14px;">
                {{tipObj.name}}</div>
            <div style="width: 100%;display: flex;align-items: center;padding: 3px 20px;font-size: 13px;">
                经度：{{tipObj.lng}}</div>
            <div style="width: 100%;display: flex;align-items: center;padding: 3px 20px;font-size: 13px;">
                纬度：{{tipObj.lat}}</div>
        </div>
    </div>

</template>

<script>
    // import * as d3 from 'd3';
    import * as turf from '@turf/turf'
    export default {
        props: {
            optionProp: {
                type: Object,
                default: null
            }
        },
        data() {
            return {
                svg: null,
                map: null,
                projection: null,
                force:null,
                tipBox: null,
                tipObj: {
                    name: '',
                    lng: '',
                    lat: ''
                },
                path: null,
                color: null,
                groups: null,
                publicPath: process.env.BASE_URL,
                geoDataList: {
                    '贵州': `${process.env.BASE_URL}geoData/guizhou.geo.json`,
                },
                moveData: [],
                mapData: null,
                moveEntityArr: [],
                planeIconDate:{
                    path:'M706 689.9l140.8-92.6-19-19-151 26.6-147.1-147.1 303.2-115.4-49.5-49.5-342.5 68.5-133.2-140.8s-41.9-49.5-86.3-15.2c-34.2 44.4 15.2 86.3 15.2 86.3l140.8 133.2L309 767.3l49.5 49.5 115.4-303.2L621 660.7l-26.6 151 19 19L706 689.9z',
                    color:"#f4ea2a"
                }

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
                that.reDraw(`${this.publicPath}china.geo.json`)

            },
            reDraw(url, type) {
                let that = this
                d3.json(url, function (err, root) {
                    root.features = root.features.map(e => {
                        e.properties.duration = that.getRandomInt(3000, 10000)
                        return e
                    })
                    that.mapData = root
                    if (type == 'province') {
                        that.mapEasyProvince('#svgBox', root)
                    } else {
                        that.mapEasy('#svgBox', root)
                    }

                })
            },
            makeData(data, projection) {
                let index = data.findIndex(e => e.properties.name == '贵州')
                let arr = []

                data.map((e, i) => {
                    if (i % 3 == 0) {
                        const position = projection(data[index].properties.cp || [0, 0]);
                        const position1 = projection(e.properties.cp || [0, 0]);

                        /* var point1 = turf.point([144.834823, -37.771257]);
                        var point2 = turf.point([145.14244, -37.830937]);
                        var midpoint = turf.midpoint(point1, point2);
                        midpoint.geometry.coordinates[0] = midpoint.geometry.coordinates[0] + 0.001
                        midpoint.geometry.coordinates[1] = midpoint.geometry.coordinates[1] + 0.001 */
                        // const position3 = projection(midpoint.geometry.coordinates);
                        arr.push({
                            info: e,
                            data: [[position[0], position[1]], [position1[0], position1[1]]]
                        })
                    }

                })
                return arr
            },
            mapEasy(id, data) {
                let that = this
                that.svg = null
                that.map = null
                that.projection = null
                that.tipBox = null
                that.tipObj = {
                    name: '',
                    lng: '',
                    lat: ''
                }

                const width = 1000;
                const height = 1000;

                // that.force = d3.forceSimulation().force('size',[width, height]);
                
                // 画布
                that.svg = d3
                    .select(id)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                //敲黑板：投影方式。
                that.projection = d3
                    .geoMercator()
                    .center([107, 31])
                    .scale(800)
                    .translate([width / 2, height / 2]);

                const path = d3.geoPath(that.projection)

                const color = d3.schemeCategory10;

                that.moveData = that.makeData(data.features, that.projection)

                that.svg
                    .selectAll('g')
                    .data(data.features)
                    .enter()
                    .append('g')
                    .on("click", function (element, i, c) {  //鼠标点击下钻事件
                        if (that.geoDataList[element.properties.name]) {
                            that.tipBox = null
                            d3.select('#svgBox').selectAll('svg').remove()
                            that.reDraw(that.geoDataList[element.properties.name], 'province')
                        } else {
                            that.$message.warning('暂无当前区域数据')
                        }

                    })
                    .append('path')
                    .attr('d', path)
                    .attr('stroke', '#000')
                    .attr('stroke-width', 1)
                    .attr('opacity', 0.6)

                    .attr('fill', function (d, i) {
                        return '#367BF0'//color[i % 10];
                    })
                    .on('mouseover', function (element, i) {  //鼠标移入事件
                        d3.select(this).attr('opacity', 1)

                        /* 提示框 */
                        that.tipObj = {
                            name: element.properties.name,
                            lng: element.properties.cp[0],
                            lat: element.properties.cp[1]
                        }
                        if (!that.tipBox) {
                            that.tipBox = d3.select(".toolTip")
                                .style('left', d3.event.pageX - 180 + 'px')
                                .style('top', d3.event.pageY - 100 + 'px')
                        } else {
                            that.tipBox.style('left', d3.event.pageX - 180 + 'px')
                                .style('top', d3.event.pageY - 100 + 'px')
                        }

                    }).on('mouseout', function (element, i) {  //鼠标移出事件
                        d3.select(this).attr('opacity', 0.6)
                        that.tipBox = null
                    })

                // .call(d3.drag().on("drag", function(d) {
                //     console.log(d3.event.x,d3.event.y)
                //         d3.select('g').attr('transfrom',`translate(${d3.event.x},${d3.event.y})`)
                //     }))



                // 添加坐标
                /*  svg
                     .selectAll('g')
                     .append('text')
                     .attr('font-size', 12)
                     .attr('text-anchor', 'middle')
                     .attr('x', d => {
                        
                         const position = projection(d.properties.cp || [0, 0]);
                         console.log(position)
                         return position[0];
                     })
                     .attr('y', d => {
                         const position = projection(d.properties.cp || [0, 0]);
                         return position[1];
                     })
                     .attr('dy', d => {
                         //这里为什么这么写呢，因为澳门和香港重合了，挤到一起了。
                         if (d.properties.name === '澳门') {
                             return 15;
                         }
                     })
                     .text(d => d.properties.name); */
                /* 添加连线 */
                let linePath = d3.line().curve(d3.curveBasis)
                that.moveData.map(e => {
                    that.svg
                        .selectAll('g')
                        .append('path')
                        .attr('d', linePath(e.data))
                        .attr('stroke', '#FF0000')
                        .attr('stroke-width', '1px')
                        .attr('fill', 'none')
                })


                /* 添加五角星标注 */
                that.svg
                    .selectAll('g')
                    .filter(function (d, i) {
                        return i % 3 == 0
                    })
                    .append('path')
                    .attr('d', d3.symbol().type(d3.symbolStar).size(70))
                    .attr('stroke', '#FFFF00')
                    .attr('stroke-width', '2px')
                    .attr('fill', '#FFFF00')
                    .attr('transform', function (d) {
                        const position = that.projection(d.properties.cp || [0, 0]);
                        return `translate(${position[0]},${position[1]})`
                    })




                /* 添加迁徙图标 */
                that.moveEntityArr = that.svg
                    .selectAll('g')
                    .filter(function (d, i) {
                        return i % 3 == 0
                    })
                    .append('path')
                    .attr('d', d3.symbol().type(d3.symbolWye).size(20))
                    .attr('stroke', '#FFFF00')
                    .attr('stroke-width', '2px')
                    .attr('fill', '#FFFF00')
                    that.moveFunc()
                



            },
            getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            moveFunc() {
                let that = this
                that.moveEntityArr
                    .attr('transform', function (d, i, arr) {
                        let index = that.mapData.features.findIndex(e => e.properties.name == '贵州')
                        const position = that.projection(that.mapData.features[index].properties.cp || [0, 0]);
                        return `translate(${position[0]},${position[1]})`
                    })
                    .transition()
                    .duration(5000)
                    .ease(d3.easePolyInOut)
                    .delay(100)
                    .attr('transform', function (d) {
                        const position = that.projection(d.properties.cp || [0, 0]);
                        return `translate(${position[0]},${position[1]})`
                    })
                    .on('end', function () {
                        that.moveFunc()
                    })
                // that.moveData.map(e => {


                // })
            },
            mapEasyProvince(id, data) {
                let that = this
                that.svg = null
                that.map = null
                that.projection = null
                that.tipBox = null
                that.tipObj = {
                    name: '',
                    lng: '',
                    lat: ''
                }

                const width = 1000;
                const height = 1000;
                // 画布
                const svg = d3
                    .select(id)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                //敲黑板：投影方式。
                const projection = d3
                    .geoMercator()
                    .center([106.6113, 26.9385])
                    .scale(8000)
                    .translate([width / 2, height / 2.5]);

                const path = d3.geoPath(projection)

                const color = d3.schemeCategory10;


                svg
                    .selectAll('g')
                    .data(data.features)
                    .enter()
                    .append('g')
                    .on("click", function (element, i, c) {  //鼠标点击下钻事件
                        that.tipBox = null
                        d3.select('#svgBox').selectAll('svg').remove()
                        that.reDraw(`${that.publicPath}china.geo.json`)

                    })
                    .append('path')
                    .attr('d', path)
                    .attr('stroke', '#000')
                    .attr('stroke-width', 1)
                    .attr('opacity', 0)
                    .transition()
                    .duration(1000)
                    .attr('opacity', 0.6)
                    .attr('fill', function (d, i) {
                        return color[i % 10];
                    })
            }

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