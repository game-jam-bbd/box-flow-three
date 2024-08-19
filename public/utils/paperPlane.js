import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export class PaperPlane {
    constructor ({ 
        scene,
        scale = {
            x: 0.0005,
            y: 0.0005,
            z: 0.0005
        },
        velocity = {
            x: 0,
            y: 0,
            z: 0
        },
        position = {
            x: 0,
            y: -1,
            z: 0
        },
        zAcceleration = false,
        change = false
    }) {
        this.scene = scene;
        this.mesh = null;
        this.scale = scale;
        this.position = position;
        this.velocity = velocity;
        this.zAcceleration = zAcceleration;
        this.change = change;
        this.loadModel();
    }

    loadModel() {
        const loader = new GLTFLoader();
        loader.load('../models/paper_plane.glb', (gltf) => {
            this.mesh = gltf.scene;
            //this.mesh.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.mesh.position.set(this.position.x, this.position.y, this.position.z);
            this.mesh.rotation.y += 3.12;
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

            this.mesh.position.x += this.velocity.x; 
            this.position.x = this.mesh.position.x;
            //this.mesh.rotation.y += 0.05; 
        }
    }
};

export const planeCoinCollision = ({ plane, coin }) => {
    // detect collision on box from every angle
    const xCollision = plane.position.x >= coin.position.x && plane.position.x <= coin.position.x;
    const yCollision =
    plane.position.y <= coin.position.y && plane.position.y >= coin.position.y;
    const zCollision = plane.position.z >= coin.position.z && plane.position.z <= coin.position.z;
 
    return xCollision && yCollision && zCollision;
};

export const planeBoxCollision = ({ box, plane }) => {
    // detect collision on box from every angle
    const xCollision = box.right >= plane.position.x && box.left <= plane.position.x;
    const yCollision =
        box.bottom + box.velocity.y <= plane.position.y && box.top >= plane.position.y;
    const zCollision = box.front >= plane.position.z && box.back <= plane.position.z;
 
    return xCollision && yCollision && zCollision;
};
