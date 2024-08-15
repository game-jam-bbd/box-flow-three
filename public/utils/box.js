import * as THREE from 'three';

export class Box extends THREE.Mesh {
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
        },
        isEnemy,
        zAcceleration = false
    }) {
        super(
            new THREE.BoxGeometry( width, height, depth ), 
            new THREE.MeshStandardMaterial( { color } )
        );
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.color = color;
        this.isEnemy = isEnemy;

        this.position.set(position.x, position.y, position.z);

        this.bottom = this.position.y - this.height / 2;
        this.top = this.position.y + this.height / 2;

        this.right = this.position.x + this.width / 2;
        this.left = this.position.x - this.width / 2;

        this.front = this.position.z + this.depth / 2;
        this.back = this.position.z - this.depth / 2;

        this.velocity = velocity;
        this.gravity = -0.002;

        this.zAcceleration = zAcceleration;
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

        if (this.zAcceleration) {
            this.velocity.z += 0.00001;
        }

        this.velocity.z += 0.001;
        
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