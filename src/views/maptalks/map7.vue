<template>
    <div id="map">
      
    </div>
</template>

<script>
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import axios from "axios";
var lines = null
var lineTrails = null
var map = null
export default {
    props: {

    },
    data() {
        return {
           threeLayer:null,
           
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
        init(){
           this.initMap()
           this.initThreeLayer()
        //    this.initModel()
        },
        //初始化地图
        initMap(){
             map = new maptalks.Map("map", {
            center: [13.416935229170008, 52.529564137540376],
            zoom: 15,
            pitch: 70,
            bearing: 180,
            centerCross: true,
            doubleClickZoom: false,
            baseLayer: new maptalks.TileLayer('tile', {
                urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c', 'd'],
                attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            })
        });
        },
        //初始化threejs图层
        async initThreeLayer(){
        const that = this
        let geojson = await that.getRoadsData()
            // features to draw

        // the ThreeLayer to draw buildings
        that.threeLayer = new ThreeLayer('t', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true
            // animation: true
        });

        that.threeLayer.prepareToDraw = function (gl, scene, camera) {
            const light = new THREE.DirectionalLight(0xffffff);
            light.position.set(0, -10, 10).normalize();
            scene.add(light);
            that.addLines(geojson);
            
        };
        that.threeLayer.addTo(map);
        that.threeLayer.config('animation', true);
        },
        addLines(geojson){
            let that = this
           let material = new THREE.MeshBasicMaterial({ color: 0xd3887, transparent: true });
        let highlightmaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true });
            console.log(geojson)
            geojson = LZString.decompressFromBase64(geojson.data);
                geojson = JSON.parse(geojson);
                var lineStrings = maptalks.GeoJSON.toGeometry(geojson);
                var timer = 'generate line time';
                console.time(timer);
                const list = [];
                lineStrings.forEach(lineString => {
                    list.push({
                        lineString,
                        len: lineLength(lineString)
                    });
                });
                lineStrings = list.sort(function (a, b) {
                    return b.len - a.len
                });

                lines = lineStrings.slice(0, 1000).map(d => {
                    var line = that.threeLayer.toExtrudeLine(d.lineString, { altitude: 0, width: 3, height: 1 }, material);
                    return line;
                });
                lineTrails = lineStrings.slice(0, 300).map(function (d) {
                    var line = that.threeLayer.toExtrudeLineTrail(d.lineString, { altitude: 0, width: 3, height: 2, chunkLength: d.len / 40, speed: 1, trail: 6 }, highlightmaterial);
                    return line;
                });

                console.log('lines.length:', lines.length);
                console.timeEnd(timer);
                that.threeLayer.addMesh(lines);
                that.threeLayer.addMesh(lineTrails);
                that.animation();
        },
        //获取街道数据
        getRoadsData(){
            return axios.get('./data/berlin-roads.txt')
        },
        animation() {
            // layer animation support Skipping frames
            this.threeLayer._needsUpdate = !this.threeLayer._needsUpdate;
            if (this.threeLayer._needsUpdate) {
                this.threeLayer.renderScene();
            }
            requestAnimationFrame(this.animation);
        }

    },
};
</script>

<style scoped>

#map{
    width: 100%;
    height: 100%;
}

</style>
