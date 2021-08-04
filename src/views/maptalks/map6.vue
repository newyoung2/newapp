<template>
  <div id="map">

  </div>
</template>

<script>
import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import * as maptalks from "maptalks";
import { ThreeLayer,ThreeRenderer } from "maptalks.three";
import axios from "axios";
import LineTrail from './LineTrail'
var lines = null;
var map = null;
var lineStrings = null
var lineTrails = null
var lines = null

export default {
  props: {},
  data() {
    return {
      threeLayer: null,
      material: null,
      ballElectric: null,
      meshes:[],
      lines:null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initMap();
      this.initThreeLayer();
      //    this.initModel()
    },
    //初始化地图
    initMap() {
       map = new maptalks.Map("map", {
            center: [115.63373210417001, 34.87688357015699],
            zoom: 4,
            // pitch: 70,
            // bearing: 180,
            centerCross: true,
            doubleClickZoom: false,
            // baseLayer: new maptalks.TileLayer('tile', {
            //     urlTemplate: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            //     subdomains: ['a', 'b', 'c', 'd'],
            //     attribution: '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
            // })
        });
    },
    //初始化threejs图层
    initThreeLayer() {
      const that = this;
      that.threeLayer = new ThreeLayer('t', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true,
            // animation: true
        });
         that.threeLayer.prepareToDraw = function (gl, scene, camera) {

             that.addLines();
        };
         that.threeLayer.addTo(map);
    },
    addLines(){
        let that = this
       let material = new THREE.LineBasicMaterial({
            linewidth: 1,
            color: '#fff',
            opacity: 0.2,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        let lineMaterial = new THREE.LineBasicMaterial({
            linewidth: 1,
            color: '#0d37ff',
            opacity: 0.1,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
       axios.get('./data/lines.json').then(res => {
            let geojson = res.data
              lineStrings = geojson.map(function (feature) {
                    var coordinates = feature.coordinates;
                    var [from, to] = coordinates;
                    var lnglats = [[parseFloat(from[0]), parseFloat(from[1])], [parseFloat(to[0]), parseFloat(to[1])]]
                    return new maptalks.LineString(lnglats);
                });

                var timer = 'generate line time';
                console.time(timer);
                var list = [];
                lineStrings.forEach(lineString => {
                    list.push({
                        lineString,
                        len: lineLength(lineString)
                    });
                });
                list = list.sort(function (a, b) {
                    return b.len - a.len
                });

                var offset = 2000;
                lineTrails = list.slice(0, offset).map(d => {
                    var line = new LineTrail(d.lineString, {
                        chunkLength: d.len / 100,
                        trail: 5,
                        speed: 1,
                        altitude: 100,
                    }, material, that.threeLayer)
                    return line;
                });
                 lines = list.slice(0, offset).map(d => {
                    return that.threeLayer.toLine(d.lineString, {}, lineMaterial);
                });


                console.log('lines.length:', lineTrails.length);
                console.timeEnd(timer);
                that.threeLayer.addMesh(lines);
                that.threeLayer.addMesh(lineTrails);
                that.animation();
       })
    },
    animation() {
            if (!map.isInteracting()) {
                this.threeLayer._needsUpdate = !this.threeLayer._needsUpdate;
                if (this.threeLayer._needsUpdate) {
                    this.threeLayer.renderScene();
                }
            } else {
                this.threeLayer.renderScene();
            }
            requestAnimationFrame(this.animation);
        }
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
