import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "lil-gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Skybox
 */

const cube = new THREE.CubeTextureLoader().setPath( '/skybox/').load([
  'valley_ft.jpg',
  'valley_bk.jpg',
  'valley_up.jpg',
  'valley_dn.jpg',
  'valley_rt.jpg',
  'valley_lf.jpg',
]);

// 5 = gauche

cube.mapping = THREE.CubeRefractionMapping;
scene.background = cube;


/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/models/audi/scene.gltf",
  (gltf) => {
    console.log("success");
    console.log(gltf);

    gltf.scene.scale.set(0.5, 0.5, 0.5);
    gltf.scene.rotateY(-1.4);
    const voitureFolder = gui.addFolder("Voiture");
    voitureFolder.add(gltf.scene.position, "x");
    scene.add(gltf.scene);
    const box = new THREE.BoxHelper(gltf.scene, 0xffff00);
    scene.add(box);
  },
  (progress) => {
    console.log("progress");
    console.log(progress);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

const gltfLoader2 = new GLTFLoader();
gltfLoader2.load(
  "/models/highway/scene.gltf",
  (gltf) => {
    console.log("success");
    console.log(gltf);

    gltf.scene.scale.set(0.25, 0.25, 0.25);
    gltf.scene.position.set(0, -82.8, 0);
    const highwayFolder = gui.addFolder("Highway");
    highwayFolder.add(gltf.scene.position, "z");
    highwayFolder.add(gltf.scene.position, "y");
    highwayFolder.add(gltf.scene.position, "x");
    scene.add(gltf.scene);
    const box2 = new THREE.BoxHelper(gltf.scene, 0xffff00);
    scene.add(box2);
  },
  (progress) => {
    console.log("progress");
    console.log(progress);
  },
  (error) => {
    console.log("error");
    console.log(error);
  }
);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2);
scene.add(camera);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0x404040, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 80;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(-5, 5, 0);
console.log(directionalLight);
scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 0, 10);

const tick = () => {
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
