import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
//5scene.background = new THREE.Color(0xeaeae8);

// Mug
var model;

function onDocumentMouseClick(e) {
    if (e.target.dataset.target) {
        var imageLink = e.target.dataset.target;
        loadObject(imageLink)
    }
}

document.addEventListener('click', onDocumentMouseClick)

function loadObject(imageLink) {
    const gltfloader = new GLTFLoader()
    var textureLoader = new THREE.TextureLoader();
    if (!imageLink) { var imageLink = 'image1.jpeg' }
    var texture = textureLoader.load(imageLink);
    texture.flipY = false;
    gltfloader.load('mug.gltf',
        function (gltf) {
            model = gltf.scene

            //gui.add(model.rotation, 'x').min(0).max(9)
            //gui.add(model.rotation, 'y').min(0).max(9)
            //gui.add(model.rotation, 'z').min(0).max(9)
            model.position.set(0, -0.12, 0);
            model.rotation.set(0, 2, 0);
            model.traverse((o) => {
                if (o.isMesh) {
                    // note: for a multi-material mesh, `o.material` may be an array,
                    // in which case you'd need to set `.map` on each value.
                    if (o.material.name == "image") {
                        o.material.map = texture;
                    } else {
                        if (texture.image.src.includes("image3.jpeg")) {
                            o.material.color.set(0x07004a);
                        }
                    }
                    o.castShadow = true;
                }
            });

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

// Size canvas

    //width: window.innerWidth,
    //height: window.innerHeight
if (window.innerWidth < 500) {
    var sizes = {
        width: 300,
        height: 300
    }
} else {
    var sizes = {
        width: 500,
        height: 500
    }
}


window.addEventListener('resize', () => {
    // Update sizes
    if (window.innerWidth < 500) {
        sizes.width = 300
        sizes.height = 300
    }
    //sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0.4
camera.position.y = 1.2
camera.position.z = 1.2
scene.add(camera)

// Lights
const directionallight = new THREE.DirectionalLight(0xffffff, 1);
directionallight.position.x = 20
directionallight.position.y = 20
directionallight.position.z = 20
directionallight.castShadow = true;
//gui.add(directionallight.position, 'x').min(0).max(9)
//gui.add(directionallight.position, 'y').min(0).max(9)
//gui.add(directionallight.position, 'z').min(0).max(9)
//gui.add(directionallight, 'intensity').min(0).max(9).step(0.01)
scene.add(directionallight);
//scene.add(new THREE.CameraHelper(directionallight.shadow.camera));
//const directionallighthelper = new THREE.DirectionalLightHelper(directionallight, 1)
//scene.add(directionallighthelper)
const light2 = new THREE.HemisphereLight(0xffffff, 0x080820, 0.5);
scene.add(light2);


// Controls
// const controls = new OrbitControls(camera, canvas)
6// controls.enableDamping = true

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
controls.maxDistance = 3.9;
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
