import * as THREE from 'three';
import { TGALoader } from 'three/addons/loaders/TGALoader.js';


export const cubeMaterial = () => {
    // returns the floor material
    const loader = new TGALoader();
    const texture = loader.load( 'textures/crate_color8.tga' );
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );

    return material;
};

export const enemyMaterial = () => {
    // returns the floor material
    const loader = new TGALoader();
    const texture = loader.load( 'textures/crate_grey8.tga' );
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture } );

    return material;
};