<template>
    <div id="map">
      
    </div>
</template>

<script>
import * as THREE from 'three';
import * as maptalks from 'maptalks';
import { ThreeLayer } from 'maptalks.three';
import axios from "axios";
var bars = null
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
           this.initModel()
        },
        //初始化地图
        initMap(){
            map = new maptalks.Map("map", {
            center: [19.06325670775459, 42.16842479475318],
            zoom: 4,
            pitch: 60,
            // bearing: 180,

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
        initThreeLayer(){
            this.threeLayer = new ThreeLayer('t', {
            forceRenderOnMoving: true,
            forceRenderOnRotating: true
              // animation: true
           });
        this.threeLayer.prepareToDraw = function (gl, scene, camera) {
            var light = new THREE.AmbientLight(0xffffff);
            light.position.set(0, -10, 10).normalize();
            scene.add(light);

            // addBars(scene);

        };
         this.threeLayer.addTo(map);
        },
        initModel(){
            let that = this
            
           let material = new THREE.MeshBasicMaterial({ color: '#fff', transparent: true });
           let highlightmaterial = new THREE.MeshBasicMaterial({ color: 'yellow', transparent: true });
            axios.get('./data/population.json').then(response => {
                 console.log(response)
                 bars = response.data.filter(function (dataItem) {
                    return dataItem[2] > 500;
                }).map(function (dataItem) {
                    return {
                        coordinate: dataItem.slice(0, 2),
                        height: dataItem[2]
                    }
                }).map(function (d) {
                    let bar = that.threeLayer.toBar(d.coordinate, {
                        height: d.height * 200,
                        radius: 15000,
                        topColor: '#fff',
                        // radialSegments: 4
                    }, material);

                    // tooltip test
                    bar.setToolTip(d.height * 400, {
                        showTimeout: 0,
                        eventsPropagation: true,
                        dx: 10
                    });


                    //infowindow test
                    bar.setInfoWindow({
                        content: 'hello world,height:' + d.height * 400,
                        title: 'message',
                        animationDuration: 0,
                        autoOpenOn: false
                    });


                    //event test
                    ['click', 'mouseout', 'mouseover', 'mousedown', 'mouseup', 'dblclick', 'contextmenu'].forEach(function (eventType) {
                        bar.on(eventType, function (e) {
                            console.log(e.type, e);
                            // console.log(this);
                            if (e.type === 'mouseout') {
                                this.setSymbol(material);
                            }
                            if (e.type === 'mouseover') {
                                this.setSymbol(highlightmaterial);
                            }
                        });
                    });
                    
                    bar.animateShow({
                           duration: 3000
                     });
                    return bar;
                });

                that.threeLayer.addMesh(bars);
                that.threeLayer.config('animation', true);
                });
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
