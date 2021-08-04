<template>
  <div id="map">

  </div>
</template>

<script>
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import axios from "axios";
import buildings from "./buildings";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';
import ArcLine from './ArcLine'
import ElectricShield from './ElectricShield'
var lines1 = null;
var lines = null;
var lineTrails = null
var meshs = null;
var map = null;
var group = null;
var threeLayer = null;
var ballElectric = null
export default {
  props: {},
  data() {
    return {
      material: null,
      camera:null,
    };
  },
  computed: {},
  watch: {},
  components: {},
  created() {},
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
        center: [13.416935229170008, 52.529564137540376],
        zoom: 15,
        pitch: 70,
        bearing: 180,

        centerCross: true,
        doubleClickZoom: false,
        baseLayer: new maptalks.TileLayer("tile", {
          urlTemplate:
            "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
          subdomains: ["a", "b", "c", "d"],
          attribution:
            '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
        }),
      });
    },
    //初始化threejs图层
    async initThreeLayer() {
      const that = this;
      let geojson = await that.getRoadsData();
      // features to draw
      // the ThreeLayer to draw buildings
      threeLayer = new ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        // animation: true
      });

      threeLayer.prepareToDraw = function (gl, scene, camera) {
        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, -10, 10).normalize();
        scene.add(light);

        that.addBuilding();
        that.addRoad(geojson);
        that.addElectricShield();
        // that.loadRoad('./data/nanshan-road1.geojson', './data/nanshan-road1.png');
      };
      threeLayer.addTo(map);
      threeLayer.config("animation", true);
    },
    //添加房屋建筑
    addBuilding() {
      let that = this;
      let features = [];
      buildings.forEach(function (b) {
        features = features.concat(b.features);
      });

      meshs = [];
      const material = new THREE.MeshBasicMaterial({
        color: "red",
        transparent: true,
      });
      const highlightmaterial = new THREE.MeshBasicMaterial({
        color: "yellow",
        transparent: true,
      });
      const lineMaterial = new THREE.LineBasicMaterial({
        // 线的颜色
        color: "rgb(15,159,190)",
        transparent: true,
        linewidth: 1,
        opacity: 0.7,
        //depthTest: true,
      });
      //解决z-flighting
      lineMaterial.polygonOffset = true;
      lineMaterial.depthTest = true;
      lineMaterial.polygonOffsetFactor = 1;
      lineMaterial.polygonOffsetUnits = 1.0;
      // const material = new THREE.MeshBasicMaterial({ color: '#3e35cf' });
      // material.vertexColors = THREE.VertexColors;
      features.forEach(function (g) {
        const heightPerLevel = 10;
        const levels = g.properties.levels || 1;
        const mesh = threeLayer.toExtrudePolygon(
          maptalks.GeoJSON.toGeometry(g),
          {
            height: levels * heightPerLevel,
            topColor: "#fff",
          },
          material
        );

        //tooltip test
        mesh.setToolTip(levels * heightPerLevel, {
          showTimeout: 0,
          eventsPropagation: true,
          dx: 10,
        });

        //infowindow test
        mesh.setInfoWindow({
          content: "hello world,height:" + levels * heightPerLevel,
          title: "message",
          animationDuration: 0,
          autoOpenOn: false,
        });

        // mesh.getInfoWindow().addTo(map);

        //event test
        [
          "click",
          "mousemove",
          "mouseout",
          "mouseover",
          "mousedown",
          "mouseup",
          "dblclick",
          "contextmenu",
        ].forEach(function (eventType) {
          mesh.on(eventType, function (e) {
            // console.log(e.type, e);
            // console.log(this);
            if (e.type === "mouseout") {
              this.setSymbol(material);
            }
            if (e.type === "mouseover") {
              this.setSymbol(highlightmaterial);
            }
          });
        });
        // initVertexColors(mesh.geometry, '#2d2f61', '#fff');
        meshs.push(mesh);
        // if (Array.isArray(mesh)) {
        //     scene.add.apply(scene, mesh);
        // } else {
        //     scene.add(mesh);
        // }
      });
      threeLayer.addMesh(meshs);
      //  group.add(meshs)
      meshs[0].on("show hide symbolchange", function (e) {
        console.log(e.type, e);
      });
    },
    //添加街道
    addRoad(geojson) {
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
                    var line = threeLayer.toExtrudeLine(d.lineString, { altitude: 0, width: 3, height: 1 }, material);
                    return line;
                });
                lineTrails = lineStrings.slice(0, 300).map(function (d) {
                    var line = threeLayer.toExtrudeLineTrail(d.lineString, { altitude: 0, width: 3, height: 2, chunkLength: d.len / 40, speed: 1, trail: 6 }, highlightmaterial);
                    return line;
                });

                console.log('lines.length:', lines.length);
                console.timeEnd(timer);
                threeLayer.addMesh(lines);
                threeLayer.addMesh(lineTrails);
    },
    //获取街道数据
    getRoadsData() {
      return axios.get("./data/berlin-roads.txt");
    },
    addElectricShield() {
      this.material = this.getMaterial();
      ballElectric = new ElectricShield(
        map.getCenter(),
        { radius: 1200 },
        this.material,
        threeLayer
      );
      //    group.add(this.ballElectric)
      threeLayer.addMesh(ballElectric);
      //   this.animation();
    },
    getMaterial() {
      var ElectricShield = {
        uniforms: {
          time: {
            type: "f",
            value: 0,
          },
          color: {
            type: "c",
            value: new THREE.Color("green"),
          },
          opacity: {
            type: "f",
            value: 1,
          },
        },
        vertexShaderSource: "\n  precision lowp float;\n  precision lowp int;\n  "
          .concat(
            THREE.ShaderChunk.fog_pars_vertex,
            "\n  varying vec2 vUv;\n  void main() {\n    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n    vUv = uv;\n    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n    "
          )
          .concat(THREE.ShaderChunk.fog_vertex, "\n  }\n"),
        fragmentShaderSource: `
                #if __VERSION__ == 100
                 #extension GL_OES_standard_derivatives : enable
                #endif
                uniform vec3 color;
                uniform float opacity;
                uniform float time;
                varying vec2 vUv;
                #define pi 3.1415926535
                #define PI2RAD 0.01745329252
                #define TWO_PI (2. * PI)
                float rands(float p){
                    return fract(sin(p) * 10000.0);
                }
                float noise(vec2 p){
                    float t = time / 20000.0;
                    if(t > 1.0) t -= floor(t);
                    return rands(p.x * 14. + p.y * sin(t) * 0.5);
                }
                vec2 sw(vec2 p){
                    return vec2(floor(p.x), floor(p.y));
                }
                vec2 se(vec2 p){
                    return vec2(ceil(p.x), floor(p.y));
                }
                vec2 nw(vec2 p){
                    return vec2(floor(p.x), ceil(p.y));
                }
                vec2 ne(vec2 p){
                    return vec2(ceil(p.x), ceil(p.y));
                }
                float smoothNoise(vec2 p){
                    vec2 inter = smoothstep(0.0, 1.0, fract(p));
                    float s = mix(noise(sw(p)), noise(se(p)), inter.x);
                    float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
                    return mix(s, n, inter.y);
                }
                float fbm(vec2 p){
                    float z = 2.0;
                    float rz = 0.0;
                    vec2 bp = p;
                    for(float i = 1.0; i < 6.0; i++){
                    rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
                    z *= 2.0;
                    p *= 2.0;
                    }
                    return rz;
                }
                void main() {
                    vec2 uv = vUv;
                    vec2 uv2 = vUv;
                    if (uv.y < 0.5) {
                    discard;
                    }
                    uv *= 4.;
                    float rz = fbm(uv);
                    uv /= exp(mod(time * 2.0, pi));
                    rz *= pow(15., 0.9);
                    gl_FragColor = mix(vec4(color, opacity) / rz, vec4(color, 0.1), 0.2);
                    if (uv2.x < 0.05) {
                    gl_FragColor = mix(vec4(color, 0.1), gl_FragColor, uv2.x / 0.05);
                    }
                    if (uv2.x > 0.95){
                    gl_FragColor = mix(gl_FragColor, vec4(color, 0.1), (uv2.x - 0.95) / 0.05);
                    }
                }`,
      };
      let material = new THREE.ShaderMaterial({
        uniforms: ElectricShield.uniforms,
        defaultAttributeValues: {},
        vertexShader: ElectricShield.vertexShaderSource,
        fragmentShader: ElectricShield.fragmentShaderSource,
        blending: THREE.AdditiveBlending,
        depthWrite: !1,
        depthTest: !0,
        side: THREE.DoubleSide,
        transparent: !0,
      });
      return material;
    },
    loadRoad(geojsonURL, textureURL) {
        let that = this
            axios.get(geojsonURL).then(res => {
                
                let geojson = res.data
                const texture = new THREE.TextureLoader().load(textureURL);
                
                // texture.anisotropy = 16;
                // texture.wrapS = THREE.RepeatWrapping;
                // texture.wrapT = THREE.RepeatWrapping;
                that.camera = threeLayer.getCamera();
                
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
                   
                    lines1 = multiLineString._geometries.filter(lineString => {
                      
                        const len = lineLength(lineString);
                        return len > 800 ;
                    }).map(lineString => {
                     
                        const len = lineLength(lineString)
                         console.log(lineString)
                        return new ArcLine(lineString, { altitude: 0, height: len / 3, speed: len / 100000 }, material, threeLayer);
                    });
                    // console.log(that.lines)
                    threeLayer.addMesh(lines1);
                    // that.meshes = that.meshes.concat(lines);
                }
            })
            
        },
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
