///////////////////////////////
// Big Imports
///////////////////////////////

import './index.html';
import './style.css'

import * as THREE from 'three'; // Import everything from Three.js
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'; // Import OBJLoader
//import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'; // Import MTLLoader
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Import GTLFLoader

import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css'; // Import Swiper styles

import GT_LOGO_GOLD_IMAGE from './assets/images/GT_LOGO_GOLD.webp';
import BUZZ_IMAGE from './assets/images/BUZZ.webp';
import PATRICK_OBJECT from './assets/models/PATRICK.glb';
import ASTORGA_OBJECT from './assets/models/ASTORGA.glb';
import WELCOME_OBJECT from './assets/models/welcome.glb';

///////////////////////////////
// Include Resume
///////////////////////////////

import resume from './assets/documents/Patrick Astorga Resume.pdf'; // Import the PDF
document.querySelector('.btn-center a').href = resume; // Set the href attribute

///////////////////////////////
// Initialize Swiper
///////////////////////////////

// Initialize Swiper
const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: false,

    slidesPerView: 1,  // Show only one slide at a time
  
    // Pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
  
    // Navigation
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

///////////////////////////////
// Fix Header
///////////////////////////////

var menu = document.querySelector('#navigation');

document.onscroll = function() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop >= window.innerHeight) {
        menu.classList.add('nav-wrap');
        document.querySelector('#about').classList.add('exp');
    } else {
        menu.classList.remove('nav-wrap'); // Remove 'nav-wrap' class
        document.querySelector('#about').classList.remove('exp');
    }
};

///////////////////////////////
// 3D Backround
///////////////////////////////

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const FOV = 75
const camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.querySelector('#background');
const renderer = new THREE.WebGLRenderer({ canvas });

camera.position.setX(0);
camera.position.setY(document.body.getBoundingClientRect().top * 0.01);
camera.position.setZ(0);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// Add lights to scene
const directional_light = new THREE.DirectionalLight(0xffffff, 1); // Strong white light
directional_light.position.set(1, 1, 1).normalize();

const ambient_light = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(directional_light, ambient_light);

// Add Starts to the scene
const GT_LOGO_TEXTURE = new THREE.TextureLoader().load( GT_LOGO_GOLD_IMAGE );
const GT_LOGO_MATERIAL = new THREE.SpriteMaterial( { map: GT_LOGO_TEXTURE } );
const GT_LOGO_ASPECT = 510 / 318;
const BUZZ_TEXTURE = new THREE.TextureLoader().load( BUZZ_IMAGE );
const BUZZ_MATERIAL = new THREE.SpriteMaterial( { map: BUZZ_TEXTURE } );
const BUZZ_ASPECT = 400 / 440;

const R_RANGE = [2, 75];
const THETA_RANGE = [-Math.PI / 3, Math.PI / 3];
const Y_RANGE = [-70, 50];

const DENSITY = 3;

const SPEED_LIMIT = 25;
const SPEED = 0.00005;

function generate_star_position(star) {
    // Generate the position of the object (cylindrical coordinates)
    star.r = Math.sqrt(THREE.MathUtils.randFloat(R_RANGE[0] ** 2, R_RANGE[1] ** 2));
    star.theta = THREE.MathUtils.randFloat(THETA_RANGE[0], THETA_RANGE[1]);
    star.y = THREE.MathUtils.randFloat(Y_RANGE[0], Y_RANGE[1]);

    // Create velocity vector for the object
    star.vr = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;
    star.vtheta = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;
    star.vy = Math.random() * SPEED_LIMIT - SPEED_LIMIT / 2;

    star.position.set(star.r * Math.sin(star.theta), star.y, -star.r * Math.cos(star.theta));
}

function add_star(element, index) {
    if (index % 2 == 0) {
        const GTSprite = new THREE.Sprite( GT_LOGO_MATERIAL );
        GTSprite.scale.set(GT_LOGO_ASPECT * 1.5, 1.5, 1);  // You can adjust the scaling here if necessary
        scene.add( GTSprite );

        generate_star_position(GTSprite);
        return GTSprite
    } else {
        const GTSprite = new THREE.Sprite( BUZZ_MATERIAL );
        GTSprite.scale.set(BUZZ_ASPECT * 2, 2, 1);  // You can adjust the scaling here if necessary
        scene.add( GTSprite );

        generate_star_position(GTSprite);
        return GTSprite
    }
}

let stars = Array(Math.trunc((Y_RANGE[1] - Y_RANGE[0]) * DENSITY)).fill().map(add_star);


// Add 3-d Objects to the scene

let rotating_objects = new Array();
const gltf_loader = new GLTFLoader();

function add_object(object_source, x, y, z, scale, rotx, roty, rotz, rotate) {
   // Load the GLB model
   gltf_loader.load(
        // resource URL
        object_source, // This should be the path to your .glb file
        // called when resource is loaded
        (gltf) => {
            const object = gltf.scene; // The loaded model is stored in gltf.scene

            if (rotate) {
                rotating_objects.push(object);
            }
            object.scale.multiplyScalar(scale);
            object.position.set(x, y, z);
            object.rotation.set(rotx, roty, rotz);

            // Add the object to the scene
            scene.add(object);
        },
        // called when loading is in progress
        (xhr) => {
            console.log(`Model ${xhr.loaded / xhr.total * 100}% loaded`);
        },
        // called when loading has errors
        (error) => {
            console.error(`An error happened: ${error}`);
        }
    );
}

let scaleDown = window.innerWidth / window.innerHeight < 0.78;

add_object(PATRICK_OBJECT, (scaleDown ? -16.8 : -28), 10, -50, (scaleDown ? 12 : 20), Math.PI / 2, 0, 0, false);
add_object(ASTORGA_OBJECT, (scaleDown ? -18 : -30), (scaleDown ? 0 : -5), -50, (scaleDown ? 12 : 20), Math.PI / 2, 0, 0, false);
add_object(WELCOME_OBJECT, (scaleDown ? -3.02 : -4.02), (scaleDown ? -2 : -3), -7.8, (scaleDown ? 0.6 : 0.8), Math.PI / 2, 0, 0, false);

// Movement of objects
function update_movement(delta) {
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

// Update on resize
window.addEventListener('resize', () => {
    // three.js stuff
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

// Scroll animation
let distance_scrolled
document.body.onscroll = () => {
  distance_scrolled = document.body.getBoundingClientRect().top;
  camera.position.y = distance_scrolled * 0.01;
};

// Animation loop
let t1 = Date.now();
let t2, dt;

function animate() {
    requestAnimationFrame(animate);

    t2 = Date.now();
    dt = t2 - t1;
    t1 = t2;

    update_movement(dt);

    renderer.render(scene, camera);
}

animate();