import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import {
  defaultObject,
  debugObject,
  lights,
  lightsNames,
  objects,
  objectsNames,
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
  getLights,
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

/* FLAGS */
const showGUI = true

/* VARS */
let sizes = fit()

/* MATERIALS */
const material = (() => {
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7
  return material
})()

/* LIGHTS */
getLights({
  lights, lightsNames, scene,
  config: defaultObject,
})

/* OBJECTS */
const { cube , plane , sphere , sphereSimpleShadow, torus } = getObjects({
  material, objects, objectsNames, scene,
  config: defaultObject,
})

/* CLOCK */
const clock = new THREE.Clock()

/* CAMERA */
const { camera , cameraControls } = (()=>{

  const lookAtPosition = useSimpleShadow ? sphere.position : cube.position

  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
        camera.position.x = 6
        camera.position.y = 6
        camera.position.z = 6
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
        renderer.shadowMap.enabled = useNativeShadows
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
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
if (showGUI) {

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

      material.color.set(debugObject.color)
      folder
        .addColor(debugObject, 'color')
        .onChange(() => material.color.set(debugObject.color))
        .name('Color')

      lights.controller = updateLightControllers('on',lights,gui)   
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

      folder
        .add(material,'wireframe')
        .name('Wireframe')

    })()

    return gui

  })()

}

/* HELPERS */
axesHelper({ 
  helpers, scene,
  enable: debugObject.axesHelper,
})

/* INIT | SHADOWS */
const shadows = (() => {

  let bakedShadow = false

  if(useBakedShadows) {

    const textureLoader = new THREE.TextureLoader()

    bakedShadow = textureLoader.load('/textures/bakedShadow.jpg')
    bakedShadow.colorSpace = THREE.SRGBColorSpace

    plane.material = new THREE.MeshBasicMaterial({ map: bakedShadow })

  } 

  if (useNativeShadows) {
    cube.castShadow = true
    cube.receiveShadow = true
    plane.receiveShadow = true
    sphere.castShadow = true
    sphere.receiveShadow = true
    torus.castShadow = true
    torus.receiveShadow = true
  }

  return { bakedShadow }

})()

/* ANIMATE */
function animate() {

  const elapsedTime = clock.getElapsedTime()

  if (useSimpleShadow) {
    bounceShadow({
      elapsedTime,
      object: sphere,
      shadow: sphereSimpleShadow,
    })
  }

  rotation({
    active: debugObject.rotationEnabled,
    elapsedTime,
    meshes: useSimpleShadow ? [ sphere ] : [ cube , sphere , torus ],
    speed: defaultObject.rotationSpeed,
  })

  cameraControls.update()

  renderer.render(scene,camera)
  window.requestAnimationFrame(animate)

} animate()