<template>
    <div id="svgBox" width="600" height="600">

    </div>

</template>

<script>
    // import * as d3 from 'd3';
    import mapEasy from './chinaMap.js'
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
                path: null,
                color: null,
                groups: null,
                publicPath: process.env.BASE_URL


            };
        },
        computed: {

        },
        watch: {

        },
        mounted() {
            console.log(mapEasy)
            // d3.json(`${this.publicPath}china.json`, function(err, root){
            //     mapEasy('#svgBox',root)
            //     })


            this.init()
        },
        methods: {
            init() {
                let that = this

                that.svg = d3.select("#svgBox")

                that.projection = d3.geoMercator().center([107, 31]).scale(50).translate([600 / 2, 600 / 2]);
                that.path = d3.geoPath(that.projection)
                that.color = d3.schemeCategory10 // d3.scaleOrdinal(d3.schemeCategory20)
                d3.json(`${that.publicPath}china.json`, function (err, root) {

                    that.map = that.svg
                        .selectAll('path')
                        .data(root.features)
                        .enter()
                        .append('path')
                        .attr('d', that.path)

                    // console.log(that.map)
                    that.map.attr('fill', function (d, i) {
                        return that.color[i % 10];
                        // return that.color(i / 35)
                    })
                        .attr('stroke', 'rgba(255, 255, 255, 1)')
                        .attr('stroke-width', 1);
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