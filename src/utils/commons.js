import * as THREE from 'three'

// SYNC
export function aspectRatio(input) {
  return input.width / input.height
}
export function axesHelper(params) {

  const { colors , enable , helpers , scene } = params

  if (enable) {
    helpers.axesHelper = new THREE.AxesHelper(5)
    scene.add(helpers.axesHelper)
  }
  else {
    scene.remove(helpers.axesHelper)
  }

  if (colors) {
    helpers.axesHelper.setColors(...colors)
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