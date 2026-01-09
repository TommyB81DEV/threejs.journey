import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import { Timer } from 'three/src/core/Timer.js'

import GUI from 'lil-gui'

import {
  defaultObject,
  debugObject,
  lightsReset,
  objectsReset,
  showGui,
  useBakedShadows,
  useNativeShadows,
  useSimpleShadow,
} from './config/'

import {
  aspectRatio,
  axesHelper,
  fit,
  rotation,
} from './utils/commons'

import {
  getFog,
  getLights,
  getSky,
  randomlyRotatingLights,
  toggleLightsAndControllers,
  updateLightControllers,
} from './utils/lights'

import {
  bounceShadow,
  getObjects,
} from './utils/objects'

/* INIT */
const canvas = document.querySelector('canvas.webgl')
const helpers = {}
const scene = new THREE.Scene()

/* VARS */
let lights
let objects
let sizes = fit()

/* TEXTURES */
const textureLoader = new THREE.TextureLoader()

/* OBJECTS */
objects = getObjects({
  scene, textureLoader,
  config: defaultObject,
  objects: objectsReset,
})

/* LIGHTS */
lights = getLights({
  objects , scene,
  config: defaultObject,
  lights: lightsReset,
})

/* CLOCK */
const timer = new Timer()

/* CAMERA */
const { camera , cameraControls } = (()=>{

  const lookAtPosition = (
    useSimpleShadow 
      ? objects.meshes.house.position 
      : objects.meshes.house.position
  )

  const camera = new THREE.PerspectiveCamera(75, aspectRatio(sizes) , 0.1 , 100)
        camera.position.x = 4
        camera.position.y = 2
        camera.position.z = 5
        camera.lookAt(lookAtPosition)

  scene.add(camera)

  const cameraControls = new OrbitControls( camera , canvas )
        cameraControls.enableDamping = true

  return { camera , cameraControls }

})()

/* RENDERER */
const renderer = (()=>{

  const renderer = new THREE.WebGLRenderer({canvas})
        renderer.setSize(sizes.width,sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFShadowMap

  return renderer

})()

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

/* GUI */
if (showGui) {

  /* EVENT | GUi Toggler */
  window.addEventListener('keydown',e => {
    if (e.key === 'h') {    
      if (gui._hidden) gui.show()
      else gui.hide()
    }
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

      folder
        .add(debugObject,'customLights')
        .onChange(enable => {

          const settings = {
            gui, lights, scene,
            settings: defaultObject,
          }

          if (enable)  toggleLightsAndControllers({ ...settings, action: 'on' })
          if (!enable) toggleLightsAndControllers({ ...settings, action: 'off' })

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

    })()

    const lightsDebug = (() => {
      lights.controller = updateLightControllers('on', lights, gui)
    })()

    const objectsDebug = (() => {

      const floorTextureFolder = gui.addFolder('Floor').close()
  
      floorTextureFolder
        .add(objects.meshes.floor.material, 'displacementBias')
        .min(-1)
        .max(1)
        .step(0.001)
      floorTextureFolder
        .add(objects.meshes.floor.material, 'displacementScale')
        .min(0)
        .max(1)
        .step(0.001)

    })()

    return gui

  })()


}

/* HELPERS */
axesHelper({ 
  helpers, scene,
  enable: debugObject.axesHelper,
})

/* SHADOWS */
const shadows = (() => {

  let bakedShadow = false

  if(useBakedShadows) {

    const textureLoader = new THREE.TextureLoader()

    bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
    bakedShadow.colorSpace = THREE.SRGBColorSpace

    objects.meshes.floor.material = new THREE.MeshBasicMaterial({ map: bakedShadow })

  }

  if (useNativeShadows) {  
    for (const [ name , _ ] of Object.entries(objects.meshes)) {
      if (name === 'floor') {
        objects.meshes[name].receiveShadow = true
      }
      else {
        objects.meshes[name].castShadow = true
        objects.meshes[name].receiveShadow = true
      }
    }
  }

  return bakedShadow ? { bakedShadow } : null

})()

/* SKY */
const sky = getSky(scene)

/* FOG */
getFog(scene)

/* ANIMATE */
function animate() {

  // Updates
  cameraControls.update()
  timer.update()
  
  // Constants
  const elapsedTime = timer.getElapsed()
  const ghosts = lights.light.ghosts.api

  // Objects
  const rotatingObjects = (
    Object
      .entries(objects.meshes)
      .filter(([ name , mesh ]) => Boolean(mesh) && name != 'floor' )
      .map(el => el[1])
  )
  
  // Animations
  bounceShadow({
    active: useSimpleShadow,
    elapsedTime,
    object: objects.meshes.sphere,
    shadow: objects.meshes.sphereSimpleShadow,
  })
  randomlyRotatingLights({
    active: defaultObject.ghostLight.active,
    angle: elapsedTime,
    lights: [
      [ ghosts.light[0] , ghosts.y(0,elapsedTime) , ghosts.speed(0) , ghosts.radius(0) ],
      [ ghosts.light[1] , ghosts.y(1,elapsedTime) , ghosts.speed(1) , ghosts.radius(1) ],
      [ ghosts.light[2] , ghosts.y(2,elapsedTime) , ghosts.speed(2) , ghosts.radius(2) ],
      [ ghosts.light[3] , ghosts.y(3,elapsedTime) , ghosts.speed(3) , ghosts.radius(3) ],
    ],
  })
  rotation({
    active: debugObject.rotationEnabled,
    elapsedTime,
    meshes: useSimpleShadow ? [ sphere ] : rotatingObjects,
    speed: defaultObject.rotationSpeed,
  })

  // Render
  renderer.render(scene,camera)
  window.requestAnimationFrame(animate)

} animate()