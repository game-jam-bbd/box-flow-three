import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Ship {

    constructor({
        scene,
        scale = {
            x: 2,
            y: 2,
            z: 2   
        },
        position = {
            x: 0,
            y: 2.5, //4
            z: 0
        },
        velocity = {
            x: 0,
            y: 0,
            z: 0
        },
        zAcceleration = false
    }) {
        this.scene = scene;
        this.mesh = null;
        this.scale = scale;
        this.position = position;
        this.velocity = velocity;
        this.zAcceleration = zAcceleration;
        this.gravity = -0.015;
        this.boundingBox = new THREE.Box3();
        this.dimensions = { 
            width: 0, 
            height: 0, 
            depth: 0 
        };

        this.bottom = 0;
        this.top = 0;

        this.right = 0;
        this.left = 0;

        this.front = 0;
        this.back = 0;

        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('../models/ship_x.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            this.mesh.castShadow = true;
            //this.mesh.rotation.z += 3.12;
            //this.mesh.rotation.x += 3.12;
            this.mesh.rotation.y += 1.56;
            this.scene.add(this.mesh);

            this.boundingBox.setFromObject(this.mesh);
            const size = new THREE.Vector3();
            this.boundingBox.getSize(size);

            this.dimensions.width = size.x;
            this.dimensions.height = size.y;
            this.dimensions.depth = size.z;
            this.updateSides();

        });
    }

    updateSides() {
        this.right = this.mesh.position.x + this.dimensions.width / 2;
        this.left = this.mesh.position.x - this.dimensions.width / 2;

        this.bottom = this.mesh.position.y - this.dimensions.height / 2;
        this.top = this.mesh.position.y + this.dimensions.height / 2;

        this.front = this.mesh.position.z + this.dimensions.depth / 2;
        this.back = this.mesh.position.z - this.dimensions.depth / 2;
    }

    update() {

        if (this.mesh) {

            this.updateSides();

            if (this.zAcceleration) {
                this.velocity.z += 0.00001;
            }

            this.velocity.z += 0.001;
            this.mesh.position.z += this.velocity.z; 
            this.position.z = this.mesh.position.z;

            this.applyGravity();

        }
    }

    applyGravity() {
        this.velocity.y += this.gravity;
        if (this.bottom + this.velocity.y <= -0.75) {
            const friction = 0.5;
            this.velocity.y *= friction;
            this.velocity.y = -this.velocity.y;
        }
        else {
            this.mesh.position.y += this.velocity.y;
            this.position.y = this.mesh.position.y;
        }
    }

    removeShip() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
    }
    
}

