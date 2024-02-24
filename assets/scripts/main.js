import * as THREE from './three.module.js';
import { FontLoader } from './FontLoader.js';
import { TextGeometry } from './TextGeometry.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 10, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//variables
let firstNameMesh = new THREE.Mesh();
let stars, starGeo;


//functions
lighting();
firstName();
particles();


function particles() {
    const points = [];

    for ( let i = 0; i < 6000; i++ ) {
        let star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        );
        points.push(star);
    }

    starGeo = new THREE.BufferGeometry().setFromPoints(points);

    let sprite = new THREE.TextureLoader().load("assets/images/star.png");
    let starMaterial = new THREE.PointsMaterial( {color: 0xffb6c1, size: 0.7, map: sprite } );

    stars = new THREE.Points( starGeo, starMaterial );
    stars.material.color.setRGB(Math.random(256), Math.random(256), Math.random(256));
    scene.add( stars );

}

function animateParticles() {
    starGeo.verticesNeedUpdate = true;
    stars.position.z -= 1;

    if ( stars.position.z < -400 ) {
        stars.position.z = 100;
        stars.material.color.setRGB(Math.random(256), Math.random(256), Math.random(256));
    }
}


function firstName() {
    const texture = new THREE.TextureLoader().load( "../assets/textures/wooden.jpg" );
    const loader = new FontLoader();

    loader.load( '../assets/fonts/lemonmilk.json', function ( font ) {
        const textGeometry = new TextGeometry( 'Mavvis', {
            font: font,
            size: 5,
            height: 1,
        })
        textGeometry.center();

        const textMaterial = new THREE.MeshBasicMaterial( {map: texture} );
        firstNameMesh = new THREE.Mesh( textGeometry, textMaterial );
        scene.add( firstNameMesh );
    });
    camera.position.z = 25;

}

function lighting() {
    const light = new THREE.HemisphereLight( 0x780a44, 0x1c3020, 1 );
    scene.add( light );

    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 0, 0, 15 );
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;
    scene.add( spotLight );
}

function animate() {
    requestAnimationFrame( animate );
    
    firstNameMesh.rotation.x += 0.02;
    firstNameMesh.rotation.y += 0.02;
    firstNameMesh.rotation.z += 0.02;

    animateParticles();
    renderer.render( scene, camera );
}

setInterval( animateParticles, 3000 );


animate();