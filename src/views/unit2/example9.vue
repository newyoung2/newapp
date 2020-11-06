<template>
  <div
    class="unit2_example1"
    id="container1"
  >
  </div>
</template>

<script>
import * as THREE from "THREE";
import dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
export default {
  props: {},
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      ambientLight: null,
      spotLight: null,
      gui: null,
      knot: null,
      step: 0,
      manager: null,
      mouseX: 0,
      mouseY: 0,
      windowHalfX: 0,
      windowHalfY: 0,
      controls: null,
      mixer:null,
      clock:null,
      dirLight:null,
      dracoLoader:null,
	  loader:null,
	  publicPath: process.env.BASE_URL
    };
  },
  computed: {},
  watch: {},
  components: {},
  created() {},
  mounted() {
    this.init();
  },
  beforeDestroy() {
  },
  methods: {
    init(){
       let that = this
			that.clock = new THREE.Clock();
			const container = document.getElementById( 'container1' );

			

			that.renderer = new THREE.WebGLRenderer( { antialias: true } );
			that.renderer.setPixelRatio( window.devicePixelRatio );
			that.renderer.setSize( container.clientWidth, container.clientHeight );
			that.renderer.outputEncoding = THREE.sRGBEncoding;
			container.appendChild( that.renderer.domElement );

			that.scene = new THREE.Scene();
			that.scene.background = new THREE.Color( 0xbfe3dd );

			that.camera = new THREE.PerspectiveCamera( 40, container.clientWidth / container.clientHeight, 1, 100 );
			that.camera.position.set( 5, 2, 8 );

			that.controls = new OrbitControls( that.camera, that.renderer.domElement );
			that.controls.target.set( 0, 0.5, 0 );
			that.controls.update();
			that.controls.enablePan = false;
			that.controls.enableDamping = true;

			that.scene.add( new THREE.HemisphereLight( 0xffffff, 0x000000, 0.4 ) );

			that.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
			that.dirLight.position.set( 5, 2, 8 );
			that.scene.add( that.dirLight );

			// envmap
			const path = `${that.publicPath}textures/cube/Park2/`;
			const format = '.jpg';
			const envMap = new THREE.CubeTextureLoader().load( [
				path + 'posx' + format, path + 'negx' + format,
				path + 'posy' + format, path + 'negy' + format,
				path + 'posz' + format, path + 'negz' + format
			] );

			that.dracoLoader = new DRACOLoader();
			that.dracoLoader.setDecoderPath( `${that.publicPath}lib/libs/draco/gltf/` );

			that.loader = new GLTFLoader();
			that.loader.setDRACOLoader( that.dracoLoader );
			that.loader.load( `${that.publicPath}models1/gltf/LittlestTokyo.glb`, function ( gltf ) {
                console.log(gltf)
				const model = gltf.scene;
				model.position.set( 1, 1, 0 );
				model.scale.set( 0.01, 0.01, 0.01 );
				model.traverse( function ( child ) {

					if ( child.isMesh ) child.material.envMap = envMap;

				} );

				that.scene.add( model );

				that.mixer = new THREE.AnimationMixer( model );
				that.mixer.clipAction( gltf.animations[ 0 ] ).play();

				that.animate();

			}, undefined, function ( e ) {

				console.error( e );

			} );


			// window.onresize = function () {

			// 	that.camera.aspect = window.innerWidth / window.innerHeight;
			// 	that.camera.updateProjectionMatrix();

			// 	that.renderer.setSize( window.innerWidth, window.innerHeight );

			// };


			
    },
    animate() {
          let that = this
				requestAnimationFrame( that.animate );

				const delta = that.clock.getDelta();

				that.mixer.update( delta );

				that.controls.update();

				

				that.renderer.render( that.scene, that.camera );

			}
  },
};
</script>

<style scoped>
.unit2_example1 {
  width: 100%;
  height: 100%;
}

.gl {
  width: 100%;
  height: 100%;
}
</style>
