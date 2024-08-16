import * as THREE from 'three';
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Box } from './utils/box.js';
import { groundMaterial } from './utils/groundMaterial.js';
import { enemyMaterial } from './utils/cubeMaterial.js';
import { cubeMaterial } from './utils/cubeMaterial.js';
import { boxCollision } from './utils/box.js';
import { AudioManager } from './utils/audioManager.js';

const scene = new THREE.Scene();
const audioManager = new AudioManager();
const camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 
    1000 
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.shadowMap.enabled = true;
renderer.setSize( 
    window.innerWidth, 
    window.innerHeight 
);


document.body.appendChild( renderer.domElement );

const controls = new OrbitControls(camera, renderer.domElement);

const cube = new Box({
    width: 1,      // x
    height: 1,     // y
    depth: 1,      // z
    color: 0x00ff00,
    velocity: {
        x: 0,
        y: -0.00005,
        z: 0
    },
    isEnemy: false
});

cube.material = cubeMaterial();

cube.castShadow = true;
scene.add( cube );

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
scene.add( ground );

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.y = 4;
light.position.z = 1;
scene.add( light );

scene.add( new THREE.AmbientLight(0xffffff, 0.5) );

camera.position.z = 5;

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    space: {
        pressed: false
    }
};

window.addEventListener('keydown', (event) => {
    //console.log(event.code);
    switch (event.code) {
        case 'KeyA':
            keys.a.pressed = true;
            break;
        case 'KeyD':
            keys.d.pressed = true;
            break;
        case 'KeyW':
            keys.w.pressed = true;
            break;
        case 'KeyS':
            keys.s.pressed = true;
            break;
        case 'Space':
            keys.space.pressed = true;
            break;
        
    }
});

window.addEventListener('keyup', (event) => {
    //console.log(event.code);
    switch (event.code) {
        case 'KeyA':
            keys.a.pressed = false;
            break;
        case 'KeyD':
            keys.d.pressed = false;
            break;
        case 'KeyW':
            keys.w.pressed = false;
            break;
        case 'KeyS':
            keys.s.pressed = false;
            break;
        case 'Space':
            keys.space.pressed = false;
            break;
    }
});

const enemies = [];

let frames = 0;
let spawnRate = 200;

async function initGame() {
    await audioManager.loadBackgroundMusic('/audio/background_music.mp3');
    audioManager.playBackgroundMusic();
    animate();
}

function animate() {
    renderer.render( scene, camera );

    // movement update
    cube.velocity.x = 0; // for every frame, reset velocity
    cube.velocity.z = 0;
    if (keys.a.pressed) {
        cube.velocity.x = -0.09; // only move cube if key is pressed
    }
    else if (keys.d.pressed) {
        cube.velocity.x = 0.09;
    }

    if (keys.w.pressed) {
        cube.velocity.z = -0.09;
    }
    else if (keys.s.pressed) {
        cube.velocity.z = 0.09;
    }

    if (keys.space.pressed) {
        cube.velocity.y = -0.13;
    }

    cube.update(ground);
    enemies.forEach(enemy => {
        enemy.update(ground);
        if (boxCollision( { box1: cube, box2: enemy })) {
            //window.cancelAnimationFrame(animationId);
            //renderer.setAnimationLoop(null);
            //renderer.stop
            console.log("Game over chief!");
            renderer.setAnimationLoop( null );
        }
    });
    if (frames % spawnRate === 0) {
        if (spawnRate > 20) {
            spawnRate -= 20;
        }
        const enemy = new Box({
            width: 1,      // x
            height: 1,     // y
            depth: 1,      // z
            color: 'red',
            velocity: {
                x: 0,
                y: 0.001,
                z: 0.008
            },
            position: {
                x: (Math.random() - 0.5) * 10,
                y: 0,
                z: -20
            },
            isEnemy: true,
            zAcceleration: true
        });

        enemy.material = enemyMaterial();
        
        enemy.castShadow = true;
        scene.add(enemy);
        enemies.push(enemy);
    }
    frames++;
    //cube.position.y -= 0.01;
}

document.getElementById('startButton').addEventListener('click', () => {
    document.getElementById('startOverlay').style.display = 'none';
    initGame();
});
