import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { groundMaterial } from './groundMaterial.js';
import { Box } from './box.js';
import { cubeMaterial } from './cubeMaterial.js';
import { boxCollision } from './box.js';
import { AudioManager } from './audioManager.js';

export const initializeGame = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const cube = new Box({
        width: 1, 
        height: 1, 
        depth: 1,
        color: 0x00ff00,
        velocity: { 
            x: 0, 
            y: -0.00005, 
            z: 0 
        },
        isEnemy: false
    });
    cube.castShadow = true;
    cube.material = cubeMaterial();
    scene.add(cube);

    const ground = new Box({
        width: 10, 
        height: 0.5, 
        depth: 50,
        color: "#0369a1",
        position: { 
            x: 0, 
            y: -2, 
            z: 0 
        },
        isEnemy: false
    });
    ground.material = groundMaterial();
    ground.receiveShadow = true;
    scene.add(ground);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.castShadow = true;
    light.position.set(0, 4, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    camera.position.z = 5;

    const audioManager = new AudioManager();

    return { scene, camera, renderer, controls, cube, ground, audioManager };
};
