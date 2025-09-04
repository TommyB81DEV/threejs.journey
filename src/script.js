import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

import {
  aspectRatio,
  axesHelper,
  createText,
  fit,
  rotation,
} from './api'

/* INIT */
const canvas = document.querySelector('canvas.webgl')
const helpers = {}
const scene = new THREE.Scene()

/* SETTINGS | Default */
const defaultObject = {
  // Commons
  color: '#cc17d9',

  // Light | Point
  pointLightDistance: 5,

  // Animation
  rotationSpeed: 0.1,

  // Fonts
  font: {
    color: 0xffffff,
    path: '/fonts/helvetiker_regular.typeface.json',
    settings: font => ({
      bevelEnabled: true,
      bevelOffset: 0,
      bevelSegments: 5,
      bevelSize: 0.02,
      bevelThickness: 0.03,
      curveSegments: 6,
      font,
      depth: 0.2,
      size: 0.5,
    }),
    text: 'Voice In The Desert',
  },

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

/* CLOCK */
const clock = new THREE.Clock()

/* FONTS */
const text = await createText(defaultObject.font)

/* CAMERA | Init */
const camera = (()=>{
  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
  camera.position.x = 6
  camera.position.y = 6
  camera.position.z = 6
  camera.lookAt(text.position)
  return camera
})()

/* CAMERA | Controls */
const controls = (()=>{
  const controls = new OrbitControls( camera , canvas )
        controls.enableDamping = true
  return controls
})()

/* HELPERS */
axesHelper({ 
  enable: debugObject.axesHelper,
  helpers,
  scene,
})

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
            .add(debugObject,'axesHelper')
            .onChange(enable => axesHelper({enable,helpers,scene}))
            .name('Axis Helper')

          folder
            .addColor(debugObject,'color')
            .onChange(() => text.material.color.set(debugObject.color))

          folder
            .add(debugObject,'rotationEnabled')
            .onChange(enable => enable ? rotationSpeedController.show() : rotationSpeedController.hide())

          const rotationSpeedController = (
            folder
              .add(defaultObject,'rotationSpeed')
              .min(0)
              .max(5)
              .step(0.1)
              .name('Rotation Speed')
              .hide()
          )

          if (debugObject.rotationEnabled) rotationSpeedController.show()

          folder
            .add(text.material,'wireframe')
            .name('Wireframe')

  })()

  return gui

})()

/* SCENE */
scene.add(camera)
scene.add(text)

/* ANIMATE */
function animate() {

  const elapsedTime = clock.getElapsedTime()

  rotation({
    active: debugObject.rotationEnabled,
    elapsedTime,
    meshes: [ text ],
    speed: defaultObject.rotationSpeed,
  })

  controls.update()

  renderer.render(scene,camera)
  window.requestAnimationFrame(animate)

} animate()