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
            that.addRoad(geojson)
            that.threeLayer.addMesh(lines);
            
        };
        that.threeLayer.addTo(map);
        that.threeLayer.config('animation', true);
        },
        addRoad(geojson){
            let that = this
           let material = new THREE.MeshPhongMaterial({ color: 0x00ffff, transparent: true });
            let highlightmaterial = new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true });
            
            
            geojson = LZString.decompressFromBase64(geojson.data);
            
                geojson = JSON.parse(geojson);
               
                var lineStrings = maptalks.GeoJSON.toGeometry(geojson);
              
                var timer = 'generate line time';
                lines = lineStrings.map(function (lineString) {
                    var line = that.threeLayer.toExtrudeLine(lineString, { altitude: 0, width: 3, height: 1 }, material);

                    //tooltip test
                    line.setToolTip(line.getId(), {
                        showTimeout: 0,
                        eventsPropagation: true,
                        dx: 10
                    });

                    //infowindow test
                    line.setInfoWindow({
                        content: 'hello world,id:' + line.getId(),
                        title: 'message',
                        animationDuration: 0,
                        autoOpenOn: false
                    });

                    //event test
                    ['click', 'mouseout', 'mouseover', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function (eventType) {
                        line.on(eventType, function (e) {
                            // console.log(e.type, e);
                            // console.log(this);
                            if (e.type === 'mouseout') {
                                this.setSymbol(material);
                            }
                            if (e.type === 'mouseover') {
                                this.setSymbol(highlightmaterial);
                            }
                        });
                    });
                    return line;
                });
        },
        //获取街道数据
        getRoadsData(){
            return axios.get('./data/berlin-roads.txt')
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
