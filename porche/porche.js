import "../style.css";
import * as THREE from "three";

// To get the Orbital controls, import it from three
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader"
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


// First make a scene, this is where all 3D geometry is put.
const scene = new THREE.Scene();
// We make a new scene for the models, so that we can transform all these models separately.
const modelScene = new THREE.Scene();

// Camera Settings

const FOV = 35;
const aspect_ratio = window.innerWidth / window.innerHeight;
const clip_start = 0.1;
const clip_end = 1000;

const xOffset = 0;
const yOffset = 0;
const zOffset = 6;

const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio, clip_start, clip_end);

camera.position.setX(xOffset);
camera.position.setY(yOffset);
camera.position.setZ(zOffset);

// Make the HDRI
const Hdri = new RGBELoader();
Hdri.load("./assets/hdris/studio.hdr", function (hdri) {
  hdri.mapping = THREE.EquirectangularReflectionMapping;
  // We want the color of the background to be a constant white.
  // If we wanted the color of the HDRI texture on the background,
  // we would set the background to the hdri as well.
  scene.background = new THREE.Color(0xFFFFFF);

  // The environment is the light that is cast onto the model.
  // We want the HDRI to light the model, to we set this as the HDRI.

  scene.environment = hdri;

  // Set mapping
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 5;
})


// Renderer

// Make the renderer, and give it the HTML element we wish the render to take place.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);


// Load the custom GLB model

const modelLoader = new GLTFLoader();
const modelName = "porche";
const modelPath = "./assets/models/" + modelName + ".glb";

modelLoader.load(modelPath, function (data) {
  
  const model = data.scene;

  modelScene.translateY(-0.6);
  modelScene.translateX(-0.1);
  modelScene.add(model);

}, undefined, function () {

  // If the model fails to load, then create a sphere
  const sphere_radius = 10;
  const sphere_width_segments = 30;
  const sphere_height_segments = 30;

  const model = new THREE.SphereGeometry(sphere_radius, sphere_width_segments, sphere_height_segments);

  const material = new THREE.MeshStandardMaterial({
    color: 0xFF0000
  });

  const mesh = new THREE.Mesh(model, material);
  scene.add(mesh);

});

scene.add(modelScene);

// Use the orbital controls by passing it the scene and renderer dom element.
// It uses the dom element to listen to mouse events, so it updates.



const orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;
orbit_controls.enableDamping = true;
orbit_controls.minDistance = 3;
orbit_controls.maxDistance = 18;

// This is called when the window is resized. In here we want to set the aspect ratio
// and the window size again.
window.onresize = function () {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

};


// This tick function, (often called Animate) recursively calls itself,
//making it the "tick" event for 3js
function tick(){
  requestAnimationFrame(tick);

  // To update the controls, use the update function in tick
  orbit_controls.update();
  renderer.render(scene, camera);

}

tick()



