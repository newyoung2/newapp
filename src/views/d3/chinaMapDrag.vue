<template>
    <div id="svgBox" width="1000" height="1000">
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
                nodes: [],
                links: [],
                svg: null,
                map: null,
                projection: null,
                force: null,
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
                planeIconDate: {
                    path: 'M706 689.9l140.8-92.6-19-19-151 26.6-147.1-147.1 303.2-115.4-49.5-49.5-342.5 68.5-133.2-140.8s-41.9-49.5-86.3-15.2c-34.2 44.4 15.2 86.3 15.2 86.3l140.8 133.2L309 767.3l49.5 49.5 115.4-303.2L621 660.7l-26.6 151 19 19L706 689.9z',
                    color: "#f4ea2a"
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
                    that.mapEasy('#svgBox', root)
                })
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
                var color = d3.scaleOrdinal(d3.schemeCategory20);



                const width = 1000;
                const height = 1000;

                // 画布
                that.svg = d3
                    .select(id)
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                     //设置缩放范围

                //敲黑板：投影方式。
                that.projection = d3
                    .geoMercator()
                    .center([107, 31])
                    .scale(800)
                    .translate([width / 2, height / 2]);

                const path = d3.geoPath(that.projection)

                // const color = d3.schemeCategory10;

                data.features.forEach(function (d, i) {
                    var centroid = path.centroid(d);
                    let obj = {
                        x: centroid[0],
                        y: centroid[1],
                        feature: d
                    }
                    that.nodes.push(obj);
                });

                 console.log(that.nodes)
                //初始化力学仿真器，通过布局函数格式化数据    
                simulation = d3.forceSimulation(that.nodes)
                    .force("charge", d3.forceManyBody().strength(0))  //注1> 
                    .force("center", d3.forceCenter(width / 2, height / 2))  //设置力学仿真器的中心
                    // .on("tick", function () {
                    //     d3.selectAll('.gclass').attr("transform", function (d) {
                    //         console.log(d)
                    //         return "translate(" + d.x + "," + d.y + ")";
                    //     });
                    // })

                that.svg
                    .selectAll('g')
                    .data(that.nodes)
                    .enter()
                    .append('g')
                    .call(d3.zoom()
                    // .scaleExtent([-5, 2])
                    .on('zoom',function(d) {
                        d3.select(this).attr('transform',d3.event.transform)
                    }))
                    .append('path')
                    // .call(d3.drag().on("start", function (d) {
                    //     if (!d3.event.active) simulation.alphaTarget(0.3).restart(); //alpha是动画的冷却系数，运动过程中会不断减小，直到小于0.005为止，此时动画会停止。
                    //     d.fx = d.x;    //fx为固定坐标，x为初始坐标  注3>  
                    //     d.fy = d.y;
                    // })
                    //     .on("drag", function (d) {
                    //         // console.log(dd3)
                    //         // d3.select(this).attr('transform',"translate(" + d.x + "," + d.y + ")")
                    //         d.fx = d3.event.x;  //fevent.x为拖拽移动时的坐标
                    //         d.fy = d3.event.y;
                    //     })
                    //     .on("end", function (d) {
                    //         if (!d3.event.active) simulation.alphaTarget(0);
                    //         d.fx = null;        //固定坐标清空
                    //         d.fy = null;
                    //     }))
                    .classed('gclass', true)
                    .attr('d', function (d) {
                        return path(d.feature);
                    })
                    .attr('stroke', '#000')
                    .attr('stroke-width', 1)
                    .attr('opacity', 1)
                    .attr('fill', function (d, i) {
                        return color(i)
                    })



            },
            edge(a, b) {
                var dx = a[0] - b[0], dy = a[1] - b[1];
                return {
                    source: a,
                    target: b,
                    distance: Math.sqrt(dx * dx + dy * dy)
                };
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