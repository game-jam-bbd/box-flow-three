import { Coin } from './coin.js';
import { Box } from './box.js';
import { Dolphin } from './dolphin.js';
import { Ship } from './ship.js';
import { enemyMaterial, cubeMaterial } from './cubeMaterial.js';

export const createDolphin = (scene) => {

    const lilBoat = new Dolphin({
        scene,
        velocity: {
            x: 0,
            y: -0.000005,
            z: 0
        },
    }); 

    return lilBoat;
};

export const createCoin = (scene) => {

    const coin = new Coin({
        scene,
        position: { 
            x: (Math.random() - 0.5) * 20, 
            y: 3.5, 
            z: -40 
        },
        velocity: {
            x: 0,
            y: 0,
            z: 0.008 
        },
        zAcceleration: true
    }); 

    return coin;
};

export const createEnemy = () => {
    const enemy = new Box({
        width: 1, 
        height: 1, 
        depth: 1,
        velocity: { 
            x: 0, 
            y: 0, 
            z: 0.008 
        },
        position: { 
            x: (Math.random() - 0.5) * 20, 
            y: 2, 
            z: -40 
        },
        isEnemy: true,
        zAcceleration: true
    });
    enemy.material = cubeMaterial();
    enemy.castShadow = true;
    return enemy;
};

export const createShip = (scene) => {

    const ship = new Ship({
        scene,
        velocity: {
            x: 0,
            y: 0,
            z: 0.008 
        },
        position: { 
            x: (Math.random() - 0.5) * 20, 
            y: 7, 
            z: -40 
        },
        isEnemy: true,
        zAcceleration: true
    }); 

    return ship;
};
