<template>
  <div id="map">

  </div>
</template>

<script>
import * as THREE from "three";

import * as maptalks from "maptalks";
import { ThreeLayer,ThreeRenderer } from "maptalks.three";
import * as mt from "maptalks.three";
import axios from "axios";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import ArcLine from './ArcLine'
var lines = null;
var map = null;

export default {
  props: {},
  data() {
    return {
      threeLayer: null,
      material: null,
      ballElectric: null,
      meshes:[],
      camera:null,
    };
  },
  mounted() {
    console.log(mt)
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
            center: [113.93258, 22.51829],
            zoom: 15,
            pitch: 70,
            bearing: 180,
            centerCross: true,
            doubleClickZoom: false,
            baseLayer: new maptalks.TileLayer('tile', {
                urlTemplate: 'http://mt0.google.cn/vt/lyrs=m&x={x}&y={y}&z={z}',
                cssFilter: 'sepia(100%) invert(90%)'
            })
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

            scene.add(new THREE.AmbientLight(0xffffff, 0.6));
            camera.add(new THREE.SpotLight(0xffffff, 0.6, 0, Math.PI));

            that.loadRoad('./data/nanshan-road1.geojson', './data/nanshan-road1.png');
            // that.loadRoad('./data/nanshan-road2.geojson', './data/nanshan-road2.png');
            // that.loadRoad('./data/nanshan-road3.geojson', './data/nanshan-road3.png');
            that.animation();
        };
        that.threeLayer.addTo(map);
    },
    loadRoad(geojsonURL, textureURL) {
        let that = this
            axios.get(geojsonURL).then(res => {
                
                let geojson = res.data
                const texture = new THREE.TextureLoader().load(textureURL);
                
                // texture.anisotropy = 16;
                // texture.wrapS = THREE.RepeatWrapping;
                // texture.wrapT = THREE.RepeatWrapping;
                that.camera = that.threeLayer.getCamera();
                
                const material = new MeshLineMaterial({
                    map: texture,
                    useMap: true,
                    lineWidth: 13,
                    sizeAttenuation: false,
                    transparent: true,
                    near: that.camera.near,
                    far: that.camera.far
                });
                console.log(material)
                const multiLineStrings = maptalks.GeoJSON.toGeometry(geojson);
               
                for (const multiLineString of multiLineStrings) {
                   
                    lines = multiLineString._geometries.filter(lineString => {
                      
                        const len = lineLength(lineString);
                        return len > 2300 ;
                    }).map(lineString => {
                     
                        const len = lineLength(lineString)
                         console.log(lineString)
                        return new ArcLine(lineString, { altitude: 0, height: len / 3, speed: len / 100000 }, material, that.threeLayer);
                    });
                    // console.log(that.lines)
                    that.threeLayer.addMesh(lines);
                    // that.meshes = that.meshes.concat(lines);
                }
            })
            
        },
    animation() {
            // layer animation support Skipping frames
            // console.log(this.threeLayer._needsUpdate)
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
#map {
  width: 100%;
  height: 100%;
}
</style>
