import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import {
  aspectRatio,
  axesHelper,
  fit,
  rotation,
  toggleCustomLights,
} from './api'

/* INIT */
const canvas = document.querySelector('canvas.webgl')
const helpers = {}
const lights = {}
const scene = new THREE.Scene()

/* SETTINGS | Default */
const defaultObject = {

  // Commons
  color: '#cc17d9',

  // Lights
  ambientLight: {
    params: [0xffffff,1.5],
    position: [0, 0, 5],
  },
  lights: [ 'AmbientLight' , 'PointLight' ],
  pointLight: {
    params: [0xffffff, 50],
    position: [0, 0, 5],
  },

  // Animation
  rotationSpeed: 0.1,

}

/* SETTINGS | Debug */
const debugObject = {
  axesHelper: true,
  color: defaultObject.color,
  customLights: true,
  rotationEnabled: false,
}

/* VARS */
let sizes = fit()

/* MATERIALS */
const material = new THREE.MeshStandardMaterial()
      material.roughness = 0.4

/* LIGHTS */
const { ambientLight, pointLight } = toggleCustomLights(true,scene,defaultObject)
lights.ambientLight = ambientLight
lights.pointLight = pointLight

/* OBJECTS */
const cube = (new THREE.Mesh(
  new THREE.BoxGeometry(0.75, 0.75, 0.75),
  material
))
const plane = (new THREE.Mesh(
  new THREE.PlaneGeometry(5,5),
  material
))
const sphere = (new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  material
))
const torus = (new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 32, 64),
  material
))

/* CLOCK */
const clock = new THREE.Clock()

/* CAMERA | Init */
const camera = (()=>{
  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
        camera.position.x = 6
        camera.position.y = 6
        camera.position.z = 6
        camera.lookAt(cube.position)
  return camera
})()

/* CAMERA | Controls */
const controls = (()=>{
  const controls = new OrbitControls( camera , canvas )
        controls.enableDamping = true
  return controls
})()

/* RENDERER */
const renderer = (()=>{
  const renderer = new THREE.WebGLRenderer({canvas})
        renderer.setSize(sizes.width,sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
  return renderer
})()

/* EVENT | Debugger */
window.addEventListener('keydown',e => {
  if (e.key === 'h') {
    if (gui._hidden) gui.show()
    else gui.hide()
  }
})

/* EVENT | Full Screen */
window.addEventListener('dblclick',e => {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
  else {
    canvas.requestFullscreen()
  }
})

/* EVENT | Resizing */
window.addEventListener('resize',e => {

  sizes = fit()

  camera.aspect = aspectRatio(sizes)
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)

})

/* DEBUG */
const gui = (() => {

  const gui = new GUI()
        // gui.close()
        gui.hide()

  // GENERAL
  const debug = (() => {

    const folder = gui.addFolder('Debug')

    folder
      .add(debugObject, 'axesHelper')
      .onChange(enable => axesHelper({ enable, helpers, scene }))
      .name('Axis Helper')

    folder
      .addColor(debugObject, 'color')
      .onChange(() => text.material.color.set(debugObject.color))

    folder
      .add(debugObject,'customLights')
      .onChange(enable => {
        if (enable) {

          const {
            ambientLight,
            pointLight,
          } = toggleCustomLights(enable,scene,defaultObject)

          lights.ambientLight = ambientLight
          lights.pointLight = pointLight

        }
        else {
          toggleCustomLights(enable,scene,defaultObject)
        }
      })
      .name('Custom Lights')

    folder
      .add(debugObject, 'rotationEnabled')
      .onChange(enable => enable ? rotationSpeedController.show() : rotationSpeedController.hide())

    const rotationSpeedController = (
      folder
        .add(defaultObject, 'rotationSpeed')
        .min(0)
        .max(5)
        .step(0.1)
        .name('Rotation Speed')
        .hide()
    )

    if (debugObject.rotationEnabled) rotationSpeedController.show()

    folder
      .add(material,'wireframe')
      .name('Wireframe')

  })()

  // AMBIENT LIGHT
  const ambientLightDebug = (() => {
    
    const folder = gui.addFolder('Ambient Light')

    folder
      .addColor(lights.ambientLight,'color')
      .name('Color')

  })()

  // POINT LIGHT
  const pointLightDebug = (() => {

    const folder = gui.addFolder('Point Light')

    folder
      .addColor(lights.pointLight,'color')
      .name('Color')

    folder
      .add(lights.pointLight.position,'x')
      .min(0)
      .max(10)
      .step(0.1)
      .name('Position X')

    folder
      .add(lights.pointLight.position,'y')
      .min(0)
      .max(10)
      .step(0.1)
      .name('Position Y')

    folder
      .add(lights.pointLight.position,'z')
      .min(2)
      .max(10)
      .step(0.1)
      .name('Position Z')

  })()

  return gui

})()

/* HELPERS */
axesHelper({ 
  enable: debugObject.axesHelper,
  helpers,
  scene,
})

/* INIT | Positioning */
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65
sphere.position.x = - 1.5
torus.position.x = 1.5

/* SCENE */
scene.add(camera)
scene.add(cube)
scene.add(plane)
scene.add(sphere)
scene.add(torus)

/* ANIMATE */
function animate() {

  const elapsedTime = clock.getElapsedTime()

  rotation({
    active: debugObject.rotationEnabled,
    elapsedTime,
    meshes: [ cube , sphere , torus ],
    speed: defaultObject.rotationSpeed,
  })

  controls.update()

  renderer.render(scene,camera)
  window.requestAnimationFrame(animate)

} animate()