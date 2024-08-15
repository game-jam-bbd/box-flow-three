import * as THREE from 'three';
import { CameraHelper } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

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

class Box extends THREE.Mesh {
    constructor ({ 
        width, 
        height, 
        depth, 
        color, 
        velocity = {
            x: 0,
            y: 0,
            z: 0
        },
        position = {
            x: 0,
            y: 0,
            z: 0
        }
    }) {
        super(
            new THREE.BoxGeometry( width, height, depth ), 
            new THREE.MeshStandardMaterial( { color } )
        );
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.color = color;

        this.position.set(position.x, position.y, position.z);

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;

        this.velocity = velocity;
        this.gravity = -0.002;
    }

    updateSides() {
        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }

    update(ground) {

        this.updateSides();
        
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z; // will uncomment if we want cube to move to the front

        // detect collision for x axis
        const xCollision = this.right >= ground.left && this.left <= ground.right;
        const zCollision = this.front <= ground.front && this.back >= ground.back;
        if (xCollision && zCollision) {
            //this.velocity.x = 0;

        }

        this.applyGravity(ground);
    }

    applyGravity(ground) {
        this.velocity.y += this.gravity;

        //if (this.bottom + this.velocity.y <= ground.top) {
        //    // everytime we hit the ground
        //    //this.velocity.y *= 0.8; // increase the decelaration 
        //    this.velocity.y = -this.velocity.y;
        //}
        //else {
        //    // otherwise, keep fallin
        //    this.position.y += this.velocity.y;
        //}
        if (this.boxCollision({
            box1: this,
            box2: ground
        })) {
            this.velocity.y *= 0.8;
            this.velocity.y = -this.velocity.y;
        }
        else {
            this.position.y += this.velocity.y;
        }
    }

    boxCollision({ box1, box2 }) {
        // detect collision on box from every angle
        const xCollision = box1.right >= box2.left && box1.left <= box2.right;
        const yCollision = (box1.bottom + box1.velocity.y) <= box2.top && box1.top >= box2.bottom;
        const zCollision = box1.front <= box2.front && box1.back >=box2.back;

        return xCollision && yCollision && zCollision;
    }
}

const cube = new Box({
    width: 1,      // x
    height: 1,     // y
    depth: 1,      // z
    color: 0x00ff00,
    velocity: {
        x: 0,
        y: -0.00005,
        z: 0
    }
});
cube.castShadow = true;
scene.add( cube );

const ground = new Box({
    width: 5,
    height: 0.5,
    depth: 10,
    color: 0x0000ff,
    position: {
        x: 0,
        y: -2,
        z: 0
    }
});

ground.receiveShadow = true;
scene.add( ground );

const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.y = 4;
light.position.z = 3;
scene.add( light );

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
    }
};

window.addEventListener('keydown', (event) => {
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
        
    }
});

window.addEventListener('keyup', (event) => {
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
    }
});


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
        x: 0,
        y: 0,
        z: -4
    }
});

enemy.castShadow = true;
scene.add(enemy);

const enemies = [enemy];

let msPrev = window.performance.now();
const fps = 60;
const msPerFrame = 1000 / fps;
let frames = 0;

function animate() {

    const msNow = window.performance.now();
    const msPassed = msNow - msPrev;

    if (msPassed < msPerFrame) return;

    const excessTime = msPassed % msPerFrame;
    msPrev = msNow - excessTime;

    frames++;
    const animationId = window.requestAnimationFrame(animate);
    renderer.render(scene, camera);

    // Movement update
    cube.velocity.x = 0;
    cube.velocity.z = 0;

    if (keys.a.pressed) {
        cube.velocity.x = -0.05;
    } else if (keys.d.pressed) {
        cube.velocity.x = 0.05;
    }

    if (keys.w.pressed) {
        cube.velocity.z = -0.05;
    } else if (keys.s.pressed) {
        cube.velocity.z = 0.05;
    }

    cube.update(ground);

    enemies.forEach(enemy => {
        enemy.update(ground);
        if (enemy.boxCollision({ box1: cube, box2: enemy })) {
            console.log("collision detected");
            window.cancelAnimationFrame(animationId);
            
        }
    });
}

renderer.setAnimationLoop(animate); // This handles the loop internally

setInterval(() => {
    console.log(frames);
}, 1000);
