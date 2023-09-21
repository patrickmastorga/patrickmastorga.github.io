import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader'
import { MTLLoader } from 'MTLLoader'
//import { OrbitControls } from 'OrbitControls';

// Setup

const scene = new THREE.Scene();

const FOV = 75
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#background');
const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setX(0);
camera.position.setY(0);
camera.position.setZ(0);

renderer.render(scene, camera);

// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Helpers

//const lightHelper = new THREE.PointLightHelper(pointLight)
//const gridHelper = new THREE.GridHelper(200, 50);

//const controls = new OrbitControls(camera, renderer.domElement);

//content

const PATRICK_TEXTURE = new THREE.TextureLoader().load('../src/assets/images/patrick.jpg');
const HANDSOME_TEXTURES = [new THREE.TextureLoader().load('../src/assets/images/THE-BEST-BUZZCARD-PHOTO.jpg'), new THREE.TextureLoader().load('../src/assets/images/THE-WORST-BUZZCARD-PHOTO.jpg')];

const R_RANGE = [2, 100];
const THETA_RANGE = [-Math.PI / 2, Math.PI / 2];
const Y_RANGE = [-100, 50];

const DENSITY = 4;

const SPEED_LIMIT = 25;
const SPEED = 0.00005;

function addPatrick(element, index) {
  // Create the 3d object with patrick.jpg skin
  const geometry = new THREE.SphereGeometry(1, 24, 24);
  //const material = new THREE.MeshStandardMaterial({ map: PATRICK_TEXTURE });
  const material = new THREE.MeshStandardMaterial({ map: PATRICK_TEXTURE });
  const patrick = new THREE.Mesh(geometry, material);

  // Generate the position of the object (cylindrical coordinates)
  patrick.r = Math.sqrt(THREE.MathUtils.randFloat(R_RANGE[0] ** 2, R_RANGE[1] ** 2));
  patrick.theta = THREE.MathUtils.randFloat(THETA_RANGE[0], THETA_RANGE[1]);
  patrick.y = THREE.MathUtils.randFloat(Y_RANGE[0], Y_RANGE[1]);

  // Create velocity vector for the object
  patrick.vr = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;
  patrick.vtheta = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;
  patrick.vy = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;

  // Define the order of rotation
  patrick.rotation.order = 'YZX';

  patrick.position.set(patrick.r * Math.sin(patrick.theta), patrick.y, -patrick.r * Math.cos(patrick.theta));

  scene.add(patrick);
  return patrick;
}

const stars = Array(Math.trunc((Y_RANGE[1] - Y_RANGE[0]) * DENSITY)).fill().map(addPatrick);

// Add 3-d Objects

const objectLoader = new OBJLoader();
const materialLoader = new MTLLoader();

let rotatingObjects = new Array();

function addObject(materialSource, objectSource, x, y, z, scale, rotate) {
  // load a material
  materialLoader.load(
    // material URL
    materialSource,
    // called when the material is loaded
    (materials) => {
      materials.preload();
      objectLoader.setMaterials(materials);

      // load an object
      objectLoader.load(
        // resource URL
        objectSource,
        // called when resource is loaded
        (object) => {
          if (rotate) {
            rotatingObjects.push(object);
          }

          object.position.set(x, y, z);
          object.scale.multiplyScalar(scale);

          scene.add(object);
        },
        // called when loading is in progresses
        (xhr) => { console.log(`Object ${xhr.loaded / xhr.total * 100}% loaded`) },
        // called when loading has errors
        (error) => { console.log(`An error happened: ${error}`) }
      );

    },
    // called when loading is in progresses
    (xhr) => { console.log(`O-Letter material ${xhr.loaded / xhr.total * 100}% loaded`) },
    // called when loading has errors
    (error) => { console.log(`An error happened: ${error}`) }
  );
}

addObject('../src/assets/models/o-letter.mtl', '../src/assets/models/o-letter.obj', -30, 0, -50, 250, true);
addObject('../src/assets/models/s-letter.mtl', '../src/assets/models/s-letter.obj', 0, 0, -50, 250, true);
addObject('../src/assets/models/i-letter.mtl', '../src/assets/models/i-letter.obj', 30, 0, -50, 250, true);

// Background

scene.background = new THREE.Color('black');

// Rotation of objects

function updateRotation(delta) {
  stars.forEach((star) => {
    star.rotation.y = (3 * Math.PI / 2) - star.theta;
    star.rotation.z = -Math.atan((star.position.y - camera.position.y) / star.r);
  });
  rotatingObjects.forEach((obj) => {
    obj.rotation.y -= 0.001 * delta;
  });
}

// Movement of objects

function updateMovement(delta) {
  stars.forEach((star) => {
    // Add random acceleration to
    star.vr += 2 * Math.random() - 1;
    star.vtheta += 2 * Math.random() - 1;
    star.vy += 2 * Math.random() - 1;

    if (star.r < R_RANGE[0]) {
      star.vr = Math.abs(star.vr);
    }
    if (star.r > R_RANGE[1]) {
      star.vr = -Math.abs(star.vr);
    }
    if (star.theta < THETA_RANGE[0]) {
      star.vtheta = Math.abs(star.vtheta);
    }
    if (star.theta > THETA_RANGE[1]) {
      star.vtheta = -Math.abs(star.vtheta);
    }
    if (star.y < Y_RANGE[0]) {
      star.vy = Math.abs(star.vy);
    }
    if (star.y > Y_RANGE[1]) {
      star.vy = -Math.abs(star.vy);
    }

    if (Math.abs(star.vr) > SPEED_LIMIT) { star.vr = SPEED_LIMIT * Math.sign(star.vr) }
    if (Math.abs(star.vtheta) > SPEED_LIMIT) { star.vtheta = SPEED_LIMIT * Math.sign(star.vtheta) }
    if (Math.abs(star.vy) > SPEED_LIMIT) { star.vy = SPEED_LIMIT * Math.sign(star.vy) }

    star.r += star.vr * SPEED * delta;
    star.theta += star.vtheta * SPEED / star.r * delta;
    star.y += star.vy * SPEED * delta;

    star.position.set(star.r * Math.sin(star.theta), star.y, -star.r * Math.cos(star.theta));
  });
}

// Window Resize

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Scroll Animation

let distanceScrolled = 0;

document.body.onscroll = () => {
  distanceScrolled = document.body.getBoundingClientRect().top;
  camera.position.y = distanceScrolled * 0.01;
};

// Animation Loop

let isTabActive = true;

window.onfocus = function() {
  isTabActive = true;
};

window.onblur = function() {
  isTabActive = false;
};

let t1 = Date.now();
let t2, dt;

function animate() {
  requestAnimationFrame(animate);

  t2 = Date.now();
  dt = t2 - t1;
  t1 = t2;

  if (isTabActive) {

    updateRotation(dt);

    updateMovement(dt);

    //controls.update();

    renderer.render(scene, camera);
  } else {
    t1 = Date.now();
  }
}

animate();