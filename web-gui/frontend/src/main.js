import * as THREE from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { get_default_vectors } from './requests'


// dat gui settings object
const settings = {
  camera: {
    fov: 75, 
    aspect: innerWidth / innerHeight,
    near: 0.1,
    far: 1000
  }
}

// three js initial setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  settings.camera.fov,
  settings.camera.aspect,
  settings.camera.near,
  settings.camera.far,
);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();

new OrbitControls(camera, renderer.domElement);

renderer.setSize(innerWidth, innerHeight);

const gridHelper = new THREE.GridHelper( 100, 10 );
scene.add( gridHelper );

document.body.appendChild(renderer.domElement);

// the mesh representation of word vectors are here
const wordVectors = {
  objects: [],
  geometries: [],
  mesh: new THREE.Mesh(),
};

// this will show each vector as a sphere in 3D space
class vectorSphere {
  constructor(x,y,z,radius,label) {
    // sphere and text object initialization
    this.sphere = {};
    this.text = {};

    // sphere mesh
    this.sphere.geometry = new THREE.SphereGeometry(radius);
    this.sphere.geometry.translate(x, y, z);
    wordVectors.geometries.push(this.sphere.geometry);
    // text mesh
    if (label) {
      // load font, then use font to make text
      const loader = new THREE.FontLoader();
      loader.load('assets/fonts/helvetiker_regular.typeface.json', (font) => {
        this.text.geometry = new THREE.TextGeometry(label, {
          font: font,
          size: 0.5,
          height: 0.5,
        });
        this.text.material = new THREE.MeshPhongMaterial({
          color: 0x00ff00,
          flatShading: THREE.FlatShading,
        });
        this.text.mesh = new THREE.Mesh(this.text.geometry, this.text.material);
        this.text.mesh.position.x = x-1;
        this.text.mesh.position.y = y-1.5;
        this.text.mesh.position.z = z-0.5;
        scene.add(this.text.mesh);
      });
    }
  }
  update() {
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
  get_default_vectors().then(res => {
    const vectors = res;
    Object.keys(vectors).forEach(word => {
      const coords = vectors[word];
      wordVectors.objects.push(new vectorSphere(
        coords[0]/5,
        coords[1]/5,
        coords[2]/5,
        1,
        //word
      ));
    });

    wordVectors.bufferGeometry = BufferGeometryUtils.mergeBufferGeometries(wordVectors.geometries);
    wordVectors.material = new THREE.MeshPhongMaterial({
      color: 0xff0000,
      flatShading: THREE.FlatShading,
    });
    wordVectors.mesh = new THREE.Mesh(wordVectors.bufferGeometry, wordVectors.material);
    scene.add(wordVectors.mesh);
  });
}

// animation loop which will render all appropriate objects and update them each frame accordingly
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  wordVectors.objects.forEach(obj => {
    obj.update();
  });
}

init();
animate();

// event listeners

// TODO: event listener for changing browser dimensions, to fix the renderer to the appropriate sizes. 
// TODO: mouse event listener, to get mouse dimensions and create a raycaster