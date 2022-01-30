import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// Debug
//const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl_tshirt')

// Scene
const scene = new THREE.Scene()

// Tshirt
var model;

// Default model woman
if (!modelToLoad){
    var modelToLoad = "tshirt-woman.gltf";
    }
if (!imageLinkTshirt) {
    var imageLinkTshirt = "image_tshirt_1.jpg";
}

function onDocumentMouseClick(e) {
    if (e.target.dataset.target) {
        if (e.target.classList.contains("tshirt")) {
        imageLinkTshirt = e.target.dataset.target;
          scene.remove(scene.children[3])
          loadObject()
        }
    }
    if (e.target.id == "#button_tshirt_man") {
      document.getElementById("#button_tshirt_man").classList.add("active");
      document.getElementById("#button_tshirt_woman").classList.remove("active");
      modelToLoad = 'tshirt-man.gltf';
      scene.remove(scene.children[3])
      loadObject()
    }
    if (e.target.id == "#button_tshirt_woman") {
      document.getElementById("#button_tshirt_woman").classList.add("active");
      document.getElementById("#button_tshirt_man").classList.remove("active");
      modelToLoad = 'tshirt-woman.gltf';
      scene.remove(scene.children[3])
      loadObject()
    }
}

document.addEventListener('click', onDocumentMouseClick)

function loadObject() {  
    const gltfloader = new GLTFLoader()
    var textureLoader = new THREE.TextureLoader();
    console.log("imglink")
    console.log(imageLinkTshirt);
    var texture = textureLoader.load(imageLinkTshirt);
    texture.flipY = false;
    gltfloader.load(modelToLoad,
        function (gltf) {
            model = gltf.scene
            //gui.add(model.rotation, 'x').min(0).max(9)
            //gui.add(model.rotation, 'y').min(0).max(9)
            //gui.add(model.rotation, 'z').min(0).max(9)
            model.position.set(0, -22, 0);
            model.rotation.set(0, 0, 0);
            model.traverse((o) => {
                if (o.isMesh) {
                    // note: for a multi-material mesh, `o.material` may be an array,
                    // in which case you'd need to set `.map` on each value.
                    if (o.material.name == "image") {
                        o.material.map = texture;
                    } else {
                        if (texture.image.src.includes("image_tshirt_2.jpg")) {
                            o.material.color.set(0xffffff);
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

loadObject()

// Size canvas

    //width: window.innerWidth,
    //height: window.innerHeight
if (window.innerWidth < 500) {
    var sizes = {
        width: 270,
        height: 270
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
camera.position.x = 15
camera.position.y = 0
camera.position.z = 70
//gui.add(camera.position, 'x').min(0).max(90)
//gui.add(camera.position, 'y').min(0).max(90)
//gui.add(camera.position, 'z').min(0).max(90)
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
renderer.setClearColor( 0xFAF9F7, 0 ); 
/**
 * Animate
 */
const clock = new THREE.Clock()

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0,0, 0);
controls.minPolarAngle = (Math.PI) / 6;
controls.maxPolarAngle = 3*(Math.PI) / 4;
controls.minDistance = 40;
controls.maxDistance = 80;
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
