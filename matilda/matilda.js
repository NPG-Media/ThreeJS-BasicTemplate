import "../style.css";
import * as THREE from "three";

// To get the Orbital controls, import it from three
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"


// First make a scene, this is where all 3D geometry is put.
const scene = new THREE.Scene();
const modelScene = new THREE.Scene();



// Camera Settings

const FOV = 35;
const aspect_ratio = window.innerWidth / window.innerHeight;
const clip_start = 0.1;
const clip_end = 5000;

const xOffset = 0;
const yOffset = 0;
const zOffset = 500;

const camera = new THREE.PerspectiveCamera(FOV, aspect_ratio, clip_start, clip_end);

camera.position.setX(xOffset);
camera.position.setY(yOffset);
camera.position.setZ(zOffset);


// Renderer

// Make the renderer, and give it the HTML element we wish the render to take place.
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg")
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);



// Shape

const sphere_radius = 10;
const sphere_width_segments = 30;
const sphere_height_segments = 30;

// First make the geometry we want to display

const modelLoader = new GLTFLoader();
const modelName = "matilda";
const modelPath = "./assets/models/" + modelName + ".glb";

modelLoader.load(modelPath, function (data) {
  
  scene.background = new THREE.Color(0xf5e2d8);
  modelScene.translateY(-100);
  modelScene.add(data.scene);

}, undefined, function () {

  const model = new THREE.SphereGeometry(sphere_radius, sphere_width_segments, sphere_height_segments);

  const material = new THREE.MeshStandardMaterial({
    color: 0xFF0000
  });

  const mesh = new THREE.Mesh(model, material);
  scene.add(mesh);

});

scene.add(modelScene);

// Add lights to make sure your mesh is visible in the scene

const light_color = THREE.Color.NAMES.sunLight;
const light_intensity = 10;
const sunLight = new THREE.DirectionalLight(light_color, light_intensity);

const light_offset = new THREE.Vector3(0,1,1);
sunLight.position.set(20,10,0);

// Add an ambient light to light the rest of the scene

const ambient_light_color = THREE.Color.NAMES.white;
const ambient_light_intensity = 1;
const ambient_light = new THREE.AmbientLight(ambient_light_color, ambient_light_intensity);

// You can add several things to the scene at once
scene.add(ambient_light, sunLight);


// Make a grid helper to see the ground plane.
const ground_grid = new THREE.GridHelper(200, 50);
//scene.add(ground_grid);


// We can also make a helper for the light to show where it is

const light_helper = new THREE.DirectionalLightHelper(sunLight, 10, 0xFFFFFF);
//scene.add(light_helper);

// Use the orbital controls by passing it the scene and renderer dom element.
// It uses the dom element to listen to mouse events, so it updates.

const orbit_controls = new OrbitControls(camera, renderer.domElement);
orbit_controls.enablePan = false;
orbit_controls.enableZoom = false;
orbit_controls.enableDamping = true;
orbit_controls.autoRotate = true;
orbit_controls.autoRotateSpeed = 5;



// Animate recursively calls itself, making it the "tick" event for 3js
function tick(){
  requestAnimationFrame(tick);

  rotateMesh();

  // To update the controls, use the update function in tick
  orbit_controls.update();
  renderer.render(scene, camera);

}


function rotateMesh(){

  const pitchRate = 0.05;
  const rollRate = 0.05;
  const yawRate = 0.05;

  if (modelScene && false) {
    modelScene.rotation.x += pitchRate;
    modelScene.rotation.y += rollRate;
    modelScene.rotation.z += yawRate;
  }
}

tick()



