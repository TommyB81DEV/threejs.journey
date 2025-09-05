import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

// SYNC
export function aspectRatio(input) {
  return input.width / input.height
}
export function axesHelper({enable,helpers,scene}) {
  if (enable) {
    helpers.axesHelper = new THREE.AxesHelper(5)
    scene.add(helpers.axesHelper)
  } else {
    scene.remove(helpers.axesHelper)
  }
}
export function fit() {
  return { height: window.innerHeight, width: window.innerWidth }
}
export function rotation(params) {

  const {
    active,
    elapsedTime,
    meshes,
    speed,
  } = params

  for (const mesh of meshes) {
    mesh.rotation.x = active ? - speed * elapsedTime : 0
    mesh.rotation.y = active ? speed * elapsedTime : 0
  }

}
export function toggleCustomLights(enable,scene,settings) {

  const lights = settings.lights

  const {
    ambientLight: alSettings,
    pointLight: plSettings,
  } = settings

  const {
    params: alParams,
  } = alSettings

  const {
    params: plParams,
    position: plPosition
  } = plSettings

  if (enable) {
  
    const ambientLight = new THREE.AmbientLight(...alParams)
    const pointLight = new THREE.PointLight(...plParams)
  
    pointLight.position.set(...plPosition)

    scene.add(ambientLight)
    scene.add(pointLight)

    console.log(scene)

    return {
      ambientLight,
      pointLight,
    }

  }

  else {

    console.log('Scene BEFORE removal',scene)

    for (const object of scene.children) {

      console.groupCollapsed('Lights')
        console.log('Lights',lights)
        console.log(`Includes ${object.type}:`,String(lights.includes(object.type)))
        console.groupEnd()

      if (lights.includes(object.type)) {
        object.dispose()
        scene.remove(object)
      }

    }

    console.log('Scene AFTER removal', scene)
    
  }

}