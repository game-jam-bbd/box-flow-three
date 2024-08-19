import * as THREE from 'three';
import { Water } from 'three/addons/objects/Water.js';
import { Sky } from 'three/addons/objects/Sky.js';

export const createWater = (scene) => {
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
    const water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load('../textures/waternormals.jpg', function(texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );
    water.rotation.x = -Math.PI / 2;
    //scene.add(water);
    return water;
};

export const createSky = () => {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    //scene.add(this.sky);

    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.005;
    skyUniforms['mieDirectionalG'].value = 0.8;

    return sky;
};

export const createSun = (renderer, sky, water) => {

    const sunParameters = {
        elevation: 0.075,
        azimuth: 180
    };

    const sun = new THREE.Vector3();
    const phi = THREE.MathUtils.degToRad(90 - sunParameters.elevation);
    const theta = THREE.MathUtils.degToRad(sunParameters.azimuth);

    sun.setFromSphericalCoords(0.25, phi, theta);

    sky.material.uniforms['sunPosition'].value.copy(sun);
    water.material.uniforms['sunDirection'].value.copy(sun).normalize();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const sceneEnv = new THREE.Scene();
    sceneEnv.background = sky;
    const renderTarget = pmremGenerator.fromScene(sceneEnv);
    //scene.environment = renderTarget.texture;
    return renderTarget.texture;
};
