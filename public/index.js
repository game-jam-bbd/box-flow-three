import * as THREE from 'three';
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { reduce } from '../eslint.config';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize( 
    window.innerWidth, 
    window.innerHeight 
);
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshStandardMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.castShadow = true;
scene.add( cube );

const ground = new THREE.Mesh( 
    new THREE.BoxGeometry( 5, 0.5, 10 ), 
    new THREE.MeshStandardMaterial( { color: 0x0000ff } ) 
);
ground.receiveShadow = true;
ground.position.y = -2;
scene.add( ground );

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.y = 4;
light.position.z = 3;
scene.add( light );

camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.05;
    cube.rotation.y += 0.05;
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );
