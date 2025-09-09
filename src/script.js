import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import {
  defaultObject,
  debugObject,
  lights,
} from './config'

import {
  aspectRatio,
  axesHelper,
  fit,
  rotation,
  toggleCustomLights,
  updateLightControllers,
} from './api'

/* INIT */
const canvas = document.querySelector('canvas.webgl')
const helpers = {}
const lightsNames = [ 'point' , 'directional', 'hemisphere', 'rectarea' ]
const scene = new THREE.Scene()

/* VARS */
let sizes = fit()

/* MATERIALS */
const material = new THREE.MeshStandardMaterial()
      material.roughness = 0.4

/* LIGHTS */
lights.activations = lightsNames
const lightsActivations = toggleCustomLights({
  lights,
  scene,
  settings: defaultObject,
})
lights.light = { ...lightsActivations }

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
        gui.close()
        gui.hide()

  // GENERAL
  const debug = (() => {

    const folder = gui.addFolder('Debug').close()

    folder
      .add(debugObject, 'axesHelper')
      .onChange(enable => axesHelper({ enable, helpers, scene }))
      .name('Axis Helper')

    material.color.set(debugObject.color)
    folder
      .addColor(debugObject, 'color')
      .onChange(() => material.color.set(debugObject.color))
      .name('Color')

    lights.controller = updateLightControllers('on',lights,gui)
    folder
      .add(debugObject,'customLights')
      .onChange(enable => {
        if (enable) {

          const lightsActivations = toggleCustomLights({
            scene,
            lights: { ...lights, activations: lightsNames },
            settings: defaultObject,
          })
          lights.light = { ...lightsActivations }

          if (lightsActivations) updateLightControllers('on',lights,gui)

        }
        else {
          toggleCustomLights({
            scene,
            lights: { ...lights , activations: [] },
            settings: defaultObject,
          })
          updateLightControllers('off',{ ...lights, activations: lightsNames },gui)
        }
      })
      .name('Custom Lights')

    const rotationSpeedController = (
      folder
        .add(defaultObject, 'rotationSpeed')
        .min(0)
        .max(5)
        .step(0.1)
        .name('Rotation Speed')
        .hide()
    )
    folder
      .add(debugObject,'rotationEnabled')
      .onChange(enable => enable ? rotationSpeedController.show() : rotationSpeedController.hide())
      .name('Rotation Enabled')

    if (debugObject.rotationEnabled) rotationSpeedController.show()

    folder
      .add(material,'wireframe')
      .name('Wireframe')

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