import { initializeGame } from './utils/gameInit.js';
import { setupControls, keys } from './utils/controls.js';
import { createEnemy, createCoin, createShip } from './utils/createObstacle.js';
import { boxCollision, coinCollision } from './utils/box.js';
import { AudioManager } from './utils/audioManager.js';
import * as THREE from 'three';

let scene, camera, renderer, controls, dolphin, ocean;
let audioManager;
const enemies = [];
const coins = [];
const ships = [];
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
    dolphin = gameInit.dolphin;
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
    dolphin.velocity.x = 0; // for every frame, reset velocity
    dolphin.velocity.z = 0;

    if (keys.a.pressed) dolphin.velocity.x = -0.1;
    else if (keys.d.pressed) dolphin.velocity.x = 0.1;

    if (keys.w.pressed) dolphin.velocity.z = -0.09;
    else if (keys.s.pressed) dolphin.velocity.z = 0.09;

    if (keys.space.pressed) dolphin.velocity.y = -0.75;

    camera.position.set(dolphin.position.x, dolphin.position.y + 4, dolphin.position.z + 8);
    //camera.lookAt(dolphin.position.x, dolphin.position.y + 2, dolphin.position.z + 5);
    const deltaTime = clock.getDelta();
    dolphin.update(deltaTime);
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
            if (boxCollision({ box1: dolphin, box2: enemy })) {
                console.log("Game over chief!");
                renderer.setAnimationLoop(null);
            }
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
            if (coinCollision({ box: dolphin, coin: coin  })) {
                console.log("Wabamba akfani");
                coin.removeCoin();
                const index = coins.indexOf(coin);
                coins.splice(index, 1);
            }
        }
    });

    ships.forEach(ship => {
        if (ship.position.z >= 100) {
            scene.remove(ship);
            const index = enemies.indexOf(ship);
            ships.splice(index, 1);
        }
        else {
            ship.update();
            //ship.mesh.rotation.z = time * 0.51;
            if (boxCollision({ box1: dolphin, box2: ship })) {
                console.log("Game over chief!");
                renderer.setAnimationLoop(null);
            }
        }
    });

    if (frames % spawnRate === 0) {
        if (spawnRate > 10) spawnRate -= 10;

        if (Math.random() > 0.5 && Math.random() < 0.5) {
            const enemy = createEnemy();
            scene.add(enemy);
            enemies.push(enemy);
        }
        else {
            if(Math.random() > 0.5 && Math.random() < 0.5) {
                const coin = createCoin(scene);
                coins.push(coin);
            }
            //else {
            //    const ship = createShip(scene);
            //    ships.push(ship);
            //}
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
