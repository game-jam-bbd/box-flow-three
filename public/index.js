import { initializeGame } from './utils/gameInit.js';
import { setupControls, keys } from './utils/controls.js';
import { Box } from './utils/box.js';
import { enemyMaterial } from './utils/cubeMaterial.js';
import { boxCollision } from './utils/box.js';
import { AudioManager } from './utils/audioManager.js';

let scene, camera, renderer, controls, cube, ground;
let audioManager;
const enemies = [];
let frames = 0;
let spawnRate = 200;
let animationId;

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('muteButton').addEventListener('click', toggleMute);

async function startGame() {
    const gameInit = initializeGame();
    scene = gameInit.scene;
    camera = gameInit.camera;
    renderer = gameInit.renderer;
    controls = gameInit.controls;
    cube = gameInit.cube;
    ground = gameInit.ground;

    setupControls();

    audioManager = new AudioManager();
    try {
        await audioManager.loadBackgroundMusic("./music/m4.mpeg");
        audioManager.playBackgroundMusic();
    } catch (error) {
        console.error("Failed to load and play music:", error);
    }

    document.getElementById('startOverlay').style.display = 'none';
    document.getElementById('gameOverlay').style.display = 'block';

    if (renderer) {
        renderer.setAnimationLoop(animate);
    } else {
        console.error("Renderer is not initialized");
    }
}

function animate() {
    if (!renderer) return;

    renderer.render(scene, camera);

    // movement update
    cube.velocity.x = 0; // for every frame, reset velocity
    cube.velocity.z = 0;

    if (keys.a.pressed) cube.velocity.x = -0.09;
    else if (keys.d.pressed) cube.velocity.x = 0.09;

    if (keys.w.pressed) cube.velocity.z = -0.09;
    else if (keys.s.pressed) cube.velocity.z = 0.09;

    if (keys.space.pressed) cube.velocity.y = -0.13;

    cube.update(ground);
    enemies.forEach(enemy => {
        enemy.update(ground);
        if (boxCollision({ box1: cube, box2: enemy })) {
            console.log("Game over chief!");
            renderer.setAnimationLoop(null);
        }
    });

    if (frames % spawnRate === 0) {
        if (spawnRate > 20) spawnRate -= 20;
        const enemy = new Box({
            width: 1, 
            height: 1, 
            depth: 1,
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
