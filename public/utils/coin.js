import * as THREE from 'three';
import { coinCollision } from './box.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class Coin {

    constructor({
        scene,
        scale = {
            x: 0.002,
            y: 0.002,
            z: 0.002
        },
        position = {
            x: 0,
            y: 0,
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
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('../models/coin.glb', (gltf) => {
            this.mesh = gltf.scene;
            this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);

            this.mesh.castShadow = true;
            this.scene.add(this.mesh);
        });
    }

    update() {

        if (this.mesh) {
            if (this.zAcceleration) {
                this.velocity.z += 0.00001;
            }

            this.velocity.z += 0.001;
            this.mesh.position.z += this.velocity.z; 
            this.position.z = this.mesh.position.z;
            this.mesh.rotation.y += 0.05; 
        }
    }

    removeCoin() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
        }
    }
    
}

