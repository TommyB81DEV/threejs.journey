import * as THREE from 'three'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
const pointLight = new THREE.PointLight(0xffffff, 50)

let helpers = {}

export function aspectRatio(input) {
  return input.width / input.height
}
export function axesHelper(scene,enable){
  if (enable) {
    helpers.axesHelper = new THREE.AxesHelper(5)
    scene.add(helpers.axesHelper)
  }
  else {
    scene.remove(helpers.axesHelper)
  }
}
export function fit() {
  return { height: window.innerHeight, width: window.innerWidth }
}
export function rotation(params) {

  const { elapsedTime, meshes, speed } = params

  for (const mesh of meshes) {
    mesh.rotation.x = -speed * elapsedTime
    mesh.rotation.y = speed * elapsedTime
  }

}
export function toggleCustomLights(scene, enable) {

  if (enable) {

    pointLight.position.set(0, 0, 5)

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