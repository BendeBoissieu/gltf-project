import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
//const gui = new dat.GUI()
console.log("hello world")
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x080820);

// Mug
var model;

function loadObject() {
    const gltfloader = new GLTFLoader()
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load('custom_image.png');
    texture.flipY = false;
    gltfloader.load('mug.gltf',
        function (gltf) {
            model = gltf.scene

            //gui.add(model.rotation, 'x').min(0).max(9)
            //gui.add(model.rotation, 'y').min(0).max(9)
            //gui.add(model.rotation, 'z').min(0).max(9)
            model.position.set(0, 0, 0);
            model.traverse((o) => {
                if (o.isMesh) {
                    // note: for a multi-material mesh, `o.material` may be an array,
                    // in which case you'd need to set `.map` on each value.
                    o.material.map = texture;
                    o.castShadow = true;
                }
            });

            model.receiveShadow = true;
            model.castShadow = true;
            scene.add(model)

            animate();
        },
        // called while loading is progressing
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        // called when loading has errors
        function (error) {
            console.log('An error happened');
        }
    )
}

var plane;
function loadBackground() {
    const gltfloader = new GLTFLoader()
    gltfloader.load('table.gltf',
        function (gltf) {
            plane = gltf.scene
            plane.position.set(0, 0, 0);
            plane.receiveShadow = true;
            plane.traverse((o) => {
                if (o.isMesh) {
                    // note: for a multi-material mesh, `o.material` may be an array,
                    // in which case you'd need to set `.map` on each value.
                    o.receiveShadow = true;
                }
            });
            scene.add(gltf.scene)
        },
        // called when loading has errors
        function (error) {
            console.log('An error happened');
        }
    )
}

loadObject()
loadBackground()



// Lights
//const pointLight = new THREE.PointLight(0xffffff, 0.1)
//pointLight.position.x = 0
//pointLight.position.y = 9
//pointLight.position.z = 6.7
//pointLight.intensity = 1.70
//scene.add(pointLight)
//gui.add(pointLight.position, 'x').min(0).max(9)
//gui.add(pointLight.position, 'y').min(0).max(9)
//gui.add(pointLight.position, 'z').min(0).max(9)
//gui.add(pointLight, 'intensity').min(0).max(9).step(0.01)

//const pointlighthelper = new THREE.PointLightHelper(pointLight, 1)
//scene.add(pointlighthelper)

//const light = new THREE.HemisphereLight( 0xffffff, 0x080820, 1 );
//scene.add( light );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true;
/**
 * Animate
 */
const clock = new THREE.Clock()

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.minPolarAngle = 0
controls.maxPolarAngle = 1.71
controls.minDistance = 1.2;
controls.maxDistance = 4;
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const animate = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(animate)
}


const directionallight = new THREE.DirectionalLight(0xffffff, 1);
directionallight.position.x += 20
directionallight.position.y += 20
directionallight.position.z += 20
directionallight.castShadow = true;
scene.add(directionallight);
//scene.add(new THREE.CameraHelper(directionallight.shadow.camera));
//const directionallighthelper = new THREE.DirectionalLightHelper(directionallight, 1)
//scene.add(directionallighthelper)

const light2 = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
scene.add(light2);