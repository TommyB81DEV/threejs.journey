import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import {
  aspectRatio,
  axesHelper,
  fit,
  rotation,
  toggleCustomLights,
} from './api'
import { shininess } from 'three/tsl'

/* INIT */
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

/* SETTINGS | Default */
const defaultObject = {

  // Commons
  color: '#cc17d9',

  // Cube
  cubeColor: '#cc17d9',
  cubeWidthSegments: 2,

  // Light | Point
  pointLightDistance: 5,

  // Animation
  rotationSpeed: 0.1,

}

/* SETTINGS | Debug */
const debugObject = {
  axesHelper: false,
  color: defaultObject.cubeColor,
  customLights: true,
  widthSegments: defaultObject.cubeWidthSegments,
  subdivision: 2,
}

/* CONSTANTS */
const cursor = { x: 0, y: 0 }

/* VARS */
let sizes = fit()

/* CLOCK */
const clock = new THREE.Clock()

/* ENVIRONMENT */
const rgbeLoader = (()=>{

  const rgbeLoader = new RGBELoader()
        rgbeLoader.load('./textures/environmentMap/2k.hdr', envMap => {
          envMap.mapping = THREE.EquirectangularReflectionMapping
          scene.background = envMap
          scene.environment = envMap
        })

  return rgbeLoader

})()

/* TEXTURES */
const textures = (()=>{
  
  const loadingManager = new THREE.LoadingManager()
  const textureLoader = new THREE.TextureLoader(loadingManager)

  const textures = {}

  textures.textureDoorAlpha = textureLoader.load('/textures/door/alpha.jpg')
  textures.textureDoorAmbientOcclusion = textureLoader.load('/textures/door/ambientOcclusion.jpg')
  textures.textureDoorColor = textureLoader.load('/textures/door/color.jpg')
  textures.textureDoorColor.colorSpace = THREE.SRGBColorSpace
  textures.textureDoorHeight = textureLoader.load('/textures/door/height.jpg')
  textures.textureDoorMetalness = textureLoader.load('/textures/door/metalness.jpg')
  textures.textureDoorNormal = textureLoader.load('/textures/door/normal.jpg')
  textures.textureDoorRoughness = textureLoader.load('/textures/door/roughness.jpg')

  textures.textureGradient = textureLoader.load('/textures/gradients/5.jpg')
  textures.textureGradient.magFilter = THREE.NearestFilter

  textures.textureMatcap = textureLoader.load('/textures/matcaps/6.png')

  return textures

})()

/* MATERIALS */
const material = (() => {

  // Standard &/or Phisical Material
  const material = new THREE.MeshPhysicalMaterial()

        material.flatShading = false
        material.opacity = 1
        material.side = THREE.DoubleSide
        material.wireframe = false

        // Mapping
        material.map = textures.textureDoorColor

        material.aoMap = textures.textureDoorAmbientOcclusion
        material.aoMapIntensity = 1

        material.alphaMap = textures.textureDoorAlpha
        material.transparent = true

        material.displacementMap = textures.textureDoorHeight
        material.displacementScale = 0.1

        material.metalnessMap = textures.textureDoorMetalness
        material.metalness = 1

        material.roughnessMap = textures.textureDoorRoughness
        material.roughness = 0

        material.normalMap = textures.textureDoorNormal
        material.normalScale.set(1,1)

        // Phisical Material specific
        material.clearcoat = 1
        material.clearcoatRoughness = 0

        material.sheen = 1
        material.sheenColor.set(1,1,1)
        material.sheenRoughness = 0.25

        material.iridescence = 1
        material.iridescenceIOR = 1
        material.iridescenceThicknessRange = [ 100 , 100 ]

        material.transmission = 1
        material.ior = 1.5
        material.thickness = 0.5

  return material

})()

/* OBJECTS | Geometries */
const planeGeometry = new THREE.PlaneGeometry(4,4,100,100)
const sphereGeometry = new THREE.SphereGeometry(1.5,64,64)
const torusGeometry = new THREE.TorusGeometry(1,0.5,100,200,Math.PI*2)

/* OBJECTS | Meshes */
const plane = (new THREE.Mesh(
  planeGeometry,
  material
))
const torus = (new THREE.Mesh(
  torusGeometry,
  material
))
const sphere = new THREE.Mesh(sphereGeometry, material)

/* CAMERA | Init */
const camera = (()=>{
  const camera = new THREE.PerspectiveCamera(45, aspectRatio(sizes) , 0.1 , 100)
  camera.position.x = 6
  camera.position.y = 6
  camera.position.z = 6
  camera.lookAt(plane.position)
  return camera
})()

/* CAMERA | Controls */
const controls = (()=>{
  const controls = new OrbitControls( camera , canvas )
        controls.enableDamping = true
  return controls
})()

/* LIGHTS */
const { pointLight } = toggleCustomLights(scene,true)

/* RENDERER */
const renderer = (()=>{
  const renderer = (new THREE.WebGLRenderer({ canvas }))
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
            .onChange(val => axesHelper(scene,val))
            .name('Axis Helper')

          folder
            .addColor(debugObject,'color')
            .onChange(() => material.color.set(debugObject.color))

          folder
            .add(defaultObject,'rotationSpeed')
            .min(0)
            .max(5)
            .step(0.1)
            .name('Rotation Speed')

          folder
            .add(material,'wireframe')
            .name('Wireframe')

  })()

  // Point Light
  const customLights = (()=>{

    const folder = gui.addFolder('Custom Lights').close()

    const pointLightDistance = (
      folder
        .add(pointLight.position, 'z')
        .min(1)
        .max(10)
        .step(0.1)
        .onFinishChange((val) => pointLight.position.setComponent(2, val))
        .name('Point Light Distance')
        .hide()
    )

    if (debugObject.customLights) pointLightDistance.show()

    folder
      .add(debugObject,'customLights')
      .onChange(enable => {
        toggleCustomLights(scene,enable)
        if (enable) pointLightDistance.show()
        else pointLightDistance.hide()
      })
      .name('Active')

  })()

  // Phong Material
  /*const phongFolder = (()=>{

    const folder = gui.addFolder('Phong Material')

          folder
            .add(material,'shininess')
            .min(0)
            .max(200)
            .step(1)
            .name('Shininess')

          folder
            .addColor(material,'specular')
            .name('Specular')

  })()*/

  // Standard Material Folder
  /* const standardFolder = (() => {

    const folder = gui.addFolder('Material | Standard')

          // Flags
          folder
            .add(material,'flatShading')
            .name('Flat Shading')

          folder
            .add(material,'opacity')
            .min(0)
            .max(1)
            .step(0.1)
            .name('Opacity')

          // Ranges
          folder
            .add(material,'aoMapIntensity')
            .min(0)
            .max(1)
            .step(0.1)
            .name('Ambient Occlusion Map Intensity')
      
          folder
            .add(material,'displacementScale')
            .min(0)
            .max(2)
            .step(0.1)
            .name('Displacement Scale')
      
          folder
            .add(material.normalScale, 'x')
            .min(0)
            .max(1)
            .step(0.001)
            .onChange((val) => material.normalScale.setComponent(0, val))
            .name('Normal Scale X')

          folder
            .add(material,'metalness')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Metalness')

          folder
            .add(material.normalScale, 'y')
            .min(0)
            .max(1)
            .step(0.001)
            .onChange((val) => material.normalScale.setComponent(1, val))
            .name('Normal Scale Y')

          folder
            .add(material,'roughness')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Roughness')

  })()*/

  // Phisical Material Folder
  const phisicalFolder = (() => {

    const folder = gui.addFolder('Material | Phisical')

          folder
            .add(material,'clearcoat')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Clearcoat')
        
          folder
            .add(material,'clearcoatRoughness')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Clearcoat Roughness')

          folder
            .add(material,'iridescence')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Iridescence')
        
          folder
            .addColor(material, 'iridescenceIOR')
            .min(1)
            .max(2.333)
            .step(0.0001)
            .name('Iridescence IOR')
        
          folder
            .add(material.iridescenceThicknessRange,'0')
            .min(1)
            .max(1000)
            .step(1)
            .name('Iridescence Thickness Range 0')
        
          folder
            .add(material.iridescenceThicknessRange,'1')
            .min(1)
            .max(1000)
            .step(1)
            .name('Iridescence Thickness Range 1')

          folder
            .add(material,'sheen')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Sheen')
        
          folder
            .addColor(material,'sheenColor')
            .name('Sheen Color')
        
          folder
            .add(material,'sheenRoughness')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Sheen Roughness')

          folder
            .add(material,'transmission')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Transmission')

          folder
            .add(material,'ior')
            .min(1)
            .max(10)
            .step(0.0001)
            .name('Index Of Reflection')

          folder
            .add(material,'thickness')
            .min(0)
            .max(1)
            .step(0.0001)
            .name('Index Of Reflection')

  })()

  return gui

})()

/* INIT | placements */
torus.position.x = 4
sphere.position.x = -4

/* SCENE */
scene.add(camera)
scene.add(plane)
scene.add(sphere)
scene.add(torus)

/* ANIMATE */
function animate() {

  const elapsedTime = clock.getElapsedTime()

  rotation({
    elapsedTime,
    meshes: [ plane , sphere , torus ],
    speed: defaultObject.rotationSpeed,
  })

  controls.update()

  renderer.render(scene, camera)
  window.requestAnimationFrame(animate)

} animate()