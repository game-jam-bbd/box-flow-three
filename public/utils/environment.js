import * as THREE from 'three';

export class Ground extends THREE.Mesh {
    constructor ({
        width,
        height,
        depth,
        color,
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

        this.position.set(position.x, position.y, position.z);

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }

    updateSides() {
        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;
    }
}