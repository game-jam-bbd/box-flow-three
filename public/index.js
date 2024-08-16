import { initializeGame } from './js/gameInit.js';
import { setupControls, keys } from './js/controls.js';
import { Box } from './utils/box.js';
import { enemyMaterial } from './utils/cubeMaterial.js';
import { boxCollision } from './utils/box.js';
import { AudioManager } from './utils/audioManager.js';

const { scene, camera, renderer, controls, cube, ground } = initializeGame();
setupControls();

const audioManager = new AudioManager();

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

function animate() {
    //const deltaTime = time - lastTime;

    //const animationId = window.requestAnimationFrame( animate );
    //const animationId = renderer.requestAnimationFrame( animate );
    //cube.rotation.x += 0.05;
    //cube.rotation.y += 0.05;
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

renderer.setAnimationLoop( animate );
