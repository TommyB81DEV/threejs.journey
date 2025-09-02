import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'
import { ThreeMFLoader } from 'three/examples/jsm/Addons.js'

// INIT
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Default
const defaultObject = {

  // Commons
  color: '#cc17d9',

  // Cube
  cubeColor: '#cc17d9',
  cubeWidthSegments: 2,

}

// Debug
const debugObject = {
  color: defaultObject.cubeColor,
  widthSegments: defaultObject.cubeWidthSegments,
  subdivision: 2,
}

// API
function aspectRatio(input){
  return (input.width / input.height)
}
function fit(){
  return { height: window.innerHeight, width: window.innerWidth }
}

// Constants
const cursor = { x: 0, y: 0 }

// Vars
let controls = null
let sizes = fit()

// TEXTURES
const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader(loadingManager)

const textureColor = textureLoader.load('/textures/door/color.jpg')
      textureColor.colorSpace = THREE.SRGBColorSpace
const textureAlpha = textureLoader.load('/textures/door/alpha.jpg')
const textureAmbientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const textureHeight = textureLoader.load('/textures/door/height.jpg')
const textureMetalness = textureLoader.load('/textures/door/metalness.jpg')
const textureNormal = textureLoader.load('/textures/door/normal.jpg')
const textureRoughness = textureLoader.load('/textures/door/roughness.jpg')

const texture = textureColor

// Materials
const material = new THREE.MeshBasicMaterial({map:texture})
      material.flatShading = false
      material.opacity = 1
      material.side = THREE.DoubleSide
      material.transparent = true
      material.wireframe = false

// Geometries
const planeGeometry = new THREE.PlaneGeometry(2,2)
const sphereGeometry = new THREE.SphereGeometry()
const torusGeometry = new THREE.TorusGeometry(0.8)

// Objects
const plane = (new THREE.Mesh(
  planeGeometry,
  material
))
const torus = (new THREE.Mesh(
  torusGeometry,
  material
))
const sphere = new THREE.Mesh(sphereGeometry, material)

// Camera
const camera = (()=>{
  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
  camera.position.x = 6
  camera.position.y = 6
  camera.position.z = 6
  camera.lookAt(plane.position)
  return camera
})()

// Renderer
const renderer = (()=>{
  const renderer = (new THREE.WebGLRenderer({ canvas }))
  renderer.setSize(sizes.width,sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  return renderer
})()

// Helpers
const axesHelper = new THREE.AxesHelper()

// Controls
controls = new OrbitControls( camera , canvas )
controls.enableDamping = true

// Init placements
torus.position.x = 2.5
sphere.position.x = -2.5

// Scene
scene.add(axesHelper)
scene.add(camera)
scene.add(plane)
scene.add(sphere)
scene.add(torus)

// Cursor
window.addEventListener('mousemove', e => {
  cursor.x = ( e.clientX / sizes.width ) - 0.5
  cursor.y = -( e.clientY / sizes.height - 0.5)
})

// Debugger
window.addEventListener('keydown', e => {
  if (e.key === 'h') gui.show()
})

// Fullscreen
window.addEventListener('dblclick',e => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    canvas.requestFullscreen()
  }
})

// Resizing
window.addEventListener('resize', e => {

  sizes = fit()

  camera.aspect = aspectRatio(sizes)
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)

})

// Debug GUI
const gui = (() => {

  const gui = new GUI()
        gui.close()
        gui.hide()

  // GENERAL   
  gui
    .addColor(debugObject, 'color')
    .onChange(() => {
      material.color.set(debugObject.color)
    })

  gui
    .add(material, 'flatShading')
    .name('Flat Shading')
  
  gui
    .add(material, 'opacity')
    .min(0)
    .max(1)
    .step(0.1)
    .name('Opacity')

  gui
    .add(material, 'transparent')
    .name('Transparent')

  gui
    .add(material, 'wireframe')
    .name('Wireframe')

  return gui

})()

// Animate
function animate() {
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
} animate()