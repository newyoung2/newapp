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
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { Sky } from "three/examples/jsm/objects/Sky.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default {
  props: {},
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      sun: null,
      sky: null,
      controls: null,
      gui: null,
      effectController: null,
    };
  },
  computed: {},
  watch: {},
  components: {},
  created() {},
  mounted() {
    this.init();
    this.render();
  },
  beforeDestroy() {
      this.gui.destroy();
  },
  methods: {
    init() {
      let that = this;
      const container = document.getElementById("container1");
      that.camera = new THREE.PerspectiveCamera(
        60,
        container.clientWidth / container.clientHeight,
        100,
        2000000
      );
      that.camera.position.set(0, 100, 2000);

      that.scene = new THREE.Scene();

      const helper = new THREE.GridHelper(10000, 2, 0xffffff, 0xffffff);
      that.scene.add(helper);

      that.renderer = new THREE.WebGLRenderer();
      that.renderer.setPixelRatio(window.devicePixelRatio);
      that.renderer.setSize(container.clientWidth, container.clientHeight);
      that.renderer.outputEncoding = THREE.sRGBEncoding;
      that.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      that.renderer.toneMappingExposure = 0.5;
      container.appendChild(that.renderer.domElement);

      that.controls = new OrbitControls(that.camera, that.renderer.domElement);
      that.controls.addEventListener("change", that.render);
      //controls.maxPolarAngle = Math.PI / 2;
      that.controls.enableZoom = false;
      that.controls.enablePan = false;

      that.initSky();

      window.addEventListener("resize", that.onWindowResize, false);
    },
    initSky() {
      let that = this;
      // Add Sky
      that.sky = new Sky();
      that.sky.scale.setScalar(450000);
      that.scene.add(that.sky);

      that.sun = new THREE.Vector3();

      /// GUI

      that.effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        inclination: 0.49, // elevation / inclination
        azimuth: 0.25, // Facing front,
        exposure: that.renderer.toneMappingExposure,
      };

      that.gui = new GUI();

      that.gui
        .add(that.effectController, "turbidity", 0.0, 20.0, 0.1)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "rayleigh", 0.0, 4, 0.001)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "mieCoefficient", 0.0, 0.1, 0.001)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "mieDirectionalG", 0.0, 1, 0.001)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "inclination", 0, 1, 0.0001)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "azimuth", 0, 1, 0.0001)
        .onChange(that.guiChanged);
      that.gui
        .add(that.effectController, "exposure", 0, 1, 0.0001)
        .onChange(that.guiChanged);

      that.guiChanged();
    },
    guiChanged() {
      const that = this;
      const uniforms = that.sky.material.uniforms;
      uniforms["turbidity"].value = that.effectController.turbidity;
      uniforms["rayleigh"].value = that.effectController.rayleigh;
      uniforms["mieCoefficient"].value = that.effectController.mieCoefficient;
      uniforms["mieDirectionalG"].value = that.effectController.mieDirectionalG;

      const theta = Math.PI * (that.effectController.inclination - 0.5);
      const phi = 2 * Math.PI * (that.effectController.azimuth - 0.5);

      that.sun.x = Math.cos(phi);
      that.sun.y = Math.sin(phi) * Math.sin(theta);
      that.sun.z = Math.sin(phi) * Math.cos(theta);

      uniforms["sunPosition"].value.copy(that.sun);

      that.renderer.toneMappingExposure = that.effectController.exposure;
      that.renderer.render(that.scene, that.camera);
    },
    onWindowResize() {
      const that = this;
      that.camera.aspect = container.clientWidth / container.clientHeight;
      that.camera.updateProjectionMatrix();

      that.renderer.setSize(container.clientWidth, container.clientHeight);

      that.render();
    },

    render() {
      this.renderer.render(this.scene, this.camera);
    },
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
