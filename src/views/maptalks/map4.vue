<template>
  <div id="map">

  </div>
</template>

<script>
import * as THREE from "three";
import * as maptalks from "maptalks";
import { ThreeLayer } from "maptalks.three";
import axios from "axios";
import ElectricShield from './ElectricShield'
var lines = null;
var map = null;

export default {
  props: {},
  data() {
    return {
      threeLayer: null,
      material: null,
      ballElectric: null,
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
      map = map = new maptalks.Map("map", {
        center: [122.05868611616324, 37.38234727127778],
        zoom: 16,
        pitch: 60,
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
    initThreeLayer() {
      const that = this;
      that.threeLayer = new ThreeLayer("t", {
        forceRenderOnMoving: true,
        forceRenderOnRotating: true,
        // animation: true
      });
      console.log(that.threeLayer)
      that.threeLayer.prepareToDraw = function (gl, scene, camera) {
        var light = new THREE.DirectionalLight(0xffffff);
        light.position.set(0, -10, 10).normalize();
        scene.add(light);
        that.addElectricShield();
      };
      that.threeLayer.addTo(map);
    },
    addElectricShield() {
      this.material = this.getMaterial();
      this.ballElectric = new ElectricShield(
        map.getCenter(),
        { radius: 500 },
        this.material,
        this.threeLayer
      );
      this.threeLayer.addMesh(this.ballElectric);
      this.animation();
    },
    animation() {
      // layer animation support Skipping frames
      if (this.threeLayer._needsUpdate) {
        this.threeLayer.renderScene();
      }
      requestAnimationFrame(this.animation);
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
            value: new THREE.Color("red"),
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
  },
};
</script>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>
