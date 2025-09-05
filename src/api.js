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

  const {
    ambientLight,
    pointLight,
  } = settings

  const {
    params: alParams,
  } = ambientLight

  const {
    params: plParams,
    position: plPosition
  } = pointLight

  if (enable) {
  
    const ambientLight = new THREE.AmbientLight(...alParams)
    const pointLight = new THREE.PointLight(...plParams)
  
    pointLight.position.set(...plPosition)

    scene.add(ambientLight)
    scene.add(pointLight)

    return {
      ambientLight,
      pointLight,
    }

  }

  else {
    scene.remove(ambientLight)
    scene.remove(pointLight)
  }

}