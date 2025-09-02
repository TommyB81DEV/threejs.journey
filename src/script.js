import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import gsap from 'gsap'

// INIT
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Config
const config = {
  animation: true,
  customCameraControl: false,
  wireframe: false,
}

// Defual
const defaultObject = {

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
function spin(object){
  gsap.to(object.rotation, { y: object.rotation.y + Math.PI * 2 })
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

// Materials
const basicMaterial = new THREE.MeshBasicMaterial({
  // color: debugObject.color,
  map: textureColor,
  wireframe: config.wireframe,
})

// Geometries
const cubeGeometry = (new THREE.BoxGeometry(
  1 , 1 , 1 ,
  defaultObject.cubeWidthSegments,
  defaultObject.cubeWidthSegments,
  defaultObject.cubeWidthSegments,
))

// Objects | Cube
const cube = (new THREE.Mesh(
  cubeGeometry,
  basicMaterial
))

// Objects | Custom Geometry Test
const customGeo = (() => {

  const geometry = new THREE.BufferGeometry()
  
  const count = 5000

  const depth = count * 3 * 3

  const positionsArray = new Float32Array(depth)
  for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = Math.random()
  }
  
  const positionsAttribute = new THREE.BufferAttribute(positionsArray,3)
  
  geometry.setAttribute('position',positionsAttribute)
  
  return (new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x3bcb03ff, wireframe: config.wireframe })
  ))

})()

// Camera
const camera = (()=>{
  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
  camera.position.x = 2
  camera.position.y = 2
  camera.position.z = 2
  camera.lookAt(cube.position)
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
if (!config.customCameraControl) {
  controls = new OrbitControls( camera , canvas )
  controls.enableDamping = true
}

// Scene
scene.add(axesHelper) 
scene.add(camera)
// scene.add(customGeo)
scene.add(cube)

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

  debugObject.spin = () => spin(cube)

  const generalTwekas = gui.addFolder('General')
        generalTwekas.close()

  const cubeTweaks = gui.addFolder('Cube')
        cubeTweaks.close()

  // GENERAL
  generalTwekas
    .add(config, 'customCameraControl')

  // CUBE
  cubeTweaks
    .add(cube.position, 'y').min(-3).max(3).step(0.01).name('elevation')

  cubeTweaks
    .add(cube, 'visible')
  
  cubeTweaks
    .add(basicMaterial, 'wireframe').name('Wireframe')

  cubeTweaks
    .addColor(debugObject, 'color').onChange(() => {
    basicMaterial.color.set(debugObject.color)
  })

  cubeTweaks
    .add(debugObject, 'widthSegments')
    .name('Width Segments')
    .min(2)
    .max(20)
    .step(1)
    .onFinishChange(() => {
      cube.geometry.dispose()
      cube.geometry = new THREE.BoxGeometry(
        1,
        1,
        1,
        debugObject.widthSegments,
        debugObject.widthSegments,
        debugObject.widthSegments
      )
    })

  cubeTweaks
    .add(debugObject, 'spin').name('Cube Spin')

  return gui

})()

// Animate
function animate() {

    if (config.customCameraControl) {
      camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5
      camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5
      camera.position.y = cursor.y * 5
      camera.lookAt(cube.position)
    }

    else controls.update()

    renderer.render(scene, camera)

    if (config.animation) window.requestAnimationFrame(animate)

} animate()