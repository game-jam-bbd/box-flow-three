import { initializeGame } from './utils/gameInit.js';
import { setupControls, keys } from './utils/controls.js';
import { createEnemy, createCoin } from './utils/createObject.js';
import { boxCollision, coinCollision } from './utils/box.js';
import { AudioManager } from './utils/audioManager.js';
import * as THREE from 'three';

let scene, camera, renderer, controls, boat, ocean;
let audioManager;
const enemies = [];
const coins = [];
let frames = 0;
let spawnRate = 250;
let animationId;
const clock = new THREE.Clock();

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('muteButton').addEventListener('click', toggleMute);

async function startGame() {
    const gameInit = initializeGame();
    scene = gameInit.scene;
    camera = gameInit.camera;
    renderer = gameInit.renderer;
    controls = gameInit.controls;
    boat = gameInit.boat;
    ocean = gameInit.ocean;

    setupControls();

    audioManager = new AudioManager();

    await audioManager.loadBackgroundMusic("./music/m4.mpeg");
    audioManager.playBackgroundMusic();

    document.getElementById('startOverlay').style.display = 'none';
    document.getElementById('gameOverlay').style.display = 'block';

    renderer.setAnimationLoop(animate);
}

function animate() {
    if (!renderer) return;

    renderer.render(scene, camera);

    ocean.material.uniforms[ 'time' ].value += 0.006;

    // movement update
    boat.velocity.x = 0; // for every frame, reset velocity
    boat.velocity.z = 0;

    if (keys.a.pressed) boat.velocity.x = -0.09;
    else if (keys.d.pressed) boat.velocity.x = 0.09;

    //if (keys.w.pressed) boat.velocity.z = -0.09;
    //else if (keys.s.pressed) boat.velocity.z = 0.09;

    if (keys.space.pressed) boat.velocity.y = -0.75;

    //camera.position.set(boat.position.x+2, boat.position.y + 4, boat.position.z+8);
    //camera.lookAt(boat.position.x, boat.position.y + 2, boat.position.z + 5);
    const deltaTime = clock.getDelta();
    boat.update(deltaTime);
    const time = performance.now() * 0.001;
    //controls.target.set(cube.position.x, cube.position.y, cube.position.z);
    enemies.forEach(enemy => {
        if (enemy.position.z >= 100) {
            scene.remove(enemy);
            const index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
        }
        else {
            enemy.update();
            enemy.rotation.x = time * 0.25;
            enemy.rotation.z = time * 0.51;
            //if (boxCollision({ box1: cube, box2: enemy })) {
            //    console.log("Game over chief!");
            //    renderer.setAnimationLoop(null);
            //}
        }
    });

    coins.forEach(coin => {
        if (coin.position.z >= 100) {
            //scene.remove(coin);
            coin.removeCoin();
            const index = coins.indexOf(coin);
            coins.splice(index, 1);
        }
        else {
            coin.update();
            //if (coinCollision({ box: cube, coin: coin  })) {
            //    coin.removeCoin();
            //    const index = coins.indexOf(coin);
            //    coins.splice(index, 1);
            //}
        }
    });

    if (frames % spawnRate === 0) {
        if (spawnRate > 20) spawnRate -= 20;

        if (Math.random() > 0.5) {
            const enemy = createEnemy();
            scene.add(enemy);
            enemies.push(enemy);
        }
        else {
            const coin = createCoin(scene);
            coins.push(coin);
        }
    }
    frames++;
}

function toggleMute() {
    if (audioManager.isMuted()) {
        audioManager.unmute();
        document.getElementById('muteButton').textContent = 'Mute';
    } else {
        audioManager.mute();
        document.getElementById('muteButton').textContent = 'Unmute';
    }
}

// Move this line into the startGame function
// renderer.setAnimationLoop(animate);
