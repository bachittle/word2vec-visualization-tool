import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import * as DAT from 'dat.gui';
const datgui = new DAT.GUI();

import Stats from 'stats.js';
const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
const statsParent = document.getElementById('statsParent');
statsParent.appendChild( stats.dom );
const statsAll = statsParent.querySelectorAll('canvas');
statsAll.forEach(stat => {
  stat.style.width = '120px';
  stat.style.height = '72px';
});

import * as req from './requests';


// dat gui settings object
const settings = {
  camera: {
    fov: 75, 
    aspect: innerWidth / innerHeight,
    near: 0.1,
    far: 1000,
    position: {
      x:0,
      y:30,
      z:70
    }
  },
  wordVectors: {
    distanceApart: 5,
  }
}

datgui.add(settings.wordVectors, 'distanceApart', 1, 1000).onChange(updateGeometries);

// three js initial setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  settings.camera.fov,
  settings.camera.aspect,
  settings.camera.near,
  settings.camera.far,
);
camera.position.x = settings.camera.position.x;
camera.position.y = settings.camera.position.y;
camera.position.z = settings.camera.position.z;
const renderer = new THREE.WebGLRenderer();

new OrbitControls(camera, renderer.domElement);

renderer.setSize(innerWidth, innerHeight);

const gridHelper = new THREE.GridHelper( 100, 10 );
scene.add( gridHelper );

document.body.appendChild(renderer.domElement);

// the mesh representation of word vectors are here
const wordVectors = {
  vectors: undefined,
  objects: [],
  geometries: [],
  mesh: new THREE.Mesh(),
  // separate object for text to be sent via WebGL. 2 queries isn't bad.
  text: {
    geometries: [],
    mesh: new THREE.Mesh(),
  },
};


// this will show each vector as a sphere in 3D space
class vectorSphere {
  constructor(x,y,z,radius,font,label) {
    // sphere and text object initialization
    this.sphere = {};
    this.text = {};

    this.radius = radius;
    this.x = x;
    this.y = y;
    this.z = z;
    // sphere mesh
    this.sphere.geometry = new THREE.SphereGeometry(radius);
    this.sphere.geometry.translate(x, y, z);
    wordVectors.geometries.push(this.sphere.geometry);
    // text mesh
    if (label) {
      // load font, then use font to make text
      this.text.geometry = new THREE.TextGeometry(label, {
        font: font,
        size: 0.5,
        height: 0.5,
      });
      this.text.geometry.translate(x-1, y-1.5, z-0.5);
      wordVectors.text.geometries.push(this.text.geometry);
    }
  }
  update() {
  }

  // efficient updating of geometry on settings changes
  updateGeometry(x,y,z) {
    this.sphere.geometry.translate(x-this.x, y-this.y, z-this.z);
    if (this.text.geometry) {
      this.text.geometry.translate(x-this.x, y-this.y, z-this.z);
    }
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

const lights = {}

lights.front = new THREE.DirectionalLight(0xffffff, 1);
lights.front.position.set(0,0,5);
scene.add(lights.front);

lights.back = new THREE.DirectionalLight(0xffffff, 1);
lights.back.position.set(0,0,-5);
scene.add(lights.back);

function init() {

  // get vector data from axios request

  // add the data to the wordVectorsObjects array, as the object of choice (in this instance: sphere)
  //wordVectors.objects.push(new vectorSphere(0,0,1,1,'test'))

  // get vector data via request, then when the data appears, add to wordVectors.objects as spheres. 
  req.get_cached_vectors().then(res => {
      wordVectors.vectors = res;
      Object.keys(wordVectors.vectors).forEach(word => {
        const coords = wordVectors.vectors[word];
        wordVectors.objects.push(new vectorSphere(
          coords[0]/(1/(settings.wordVectors.distanceApart)),
          coords[1]/(1/(settings.wordVectors.distanceApart)),
          coords[2]/(1/(settings.wordVectors.distanceApart)),
          1,
		  null,
          //word
        ));
      });

      const bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(wordVectors.geometries);
      console.log(bufferGeometry);
      wordVectors.material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        flatShading: THREE.FlatShading,
      });
      wordVectors.mesh = new THREE.Mesh(bufferGeometry, wordVectors.material);
      scene.add(wordVectors.mesh);
      

      console.log(wordVectors.text.geometries);
      const textBufferGeometry = BufferGeometryUtils.mergeBufferGeometries(wordVectors.text.geometries);
      console.log(textBufferGeometry);
      wordVectors.text.material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        flatShading: THREE.FlatShading,
      });
      wordVectors.text.mesh = new THREE.Mesh(textBufferGeometry, wordVectors.text.material);
      scene.add(wordVectors.text.mesh);
  });
}

// when a setting is changed, update the geometry with the necessary changes
function updateGeometries() {
  wordVectors.mesh.geometry.dispose();
  const words = Object.keys(wordVectors.vectors);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const coords = wordVectors.vectors[word];
    const obj = wordVectors.objects[i];
    obj.updateGeometry(
      coords[0]/settings.wordVectors.distanceApart,
      coords[1]/settings.wordVectors.distanceApart,
      coords[2]/settings.wordVectors.distanceApart,
    );
    wordVectors.geometries[i] = obj.sphere.geometry; 
    if (obj.text.geometry) {
      wordVectors.text.geometries[i] = obj.text.geometry; 
    }
  }
  wordVectors.mesh.geometry = BufferGeometryUtils.mergeBufferGeometries(wordVectors.geometries);
  if (wordVectors.text.geometries.length !== 0) {
    wordVectors.text.mesh.geometry = BufferGeometryUtils.mergeBufferGeometries(wordVectors.text.geometries);
  }
}

// animation loop which will render all appropriate objects and update them each frame accordingly
function animate() {
  stats.begin();
  renderer.render(scene, camera);
  
  wordVectors.objects.forEach(obj => {
    obj.update();
  });
  stats.end();
  requestAnimationFrame(animate);
}

init();
animate();

// event listeners

// TODO: event listener for changing browser dimensions, to fix the renderer to the appropriate sizes. 
// TODO: mouse event listener, to get mouse dimensions and create a raycaster
