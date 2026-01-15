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
    active = false,
    elapsedTime,
    meshes,
    speed,
  } = params

  if (active) {
    for (const mesh of meshes) {
      mesh.rotation.x = - speed * elapsedTime
      mesh.rotation.y = speed * elapsedTime
    }
  }

}
export function setLesson(lessons,name) {
  lessons = Object.fromEntries(lessons.map((name) => [name, false]))
  Object.keys(lessons).forEach((k) => (lessons[k] = k === name))
  return name
}
export function tileAndWrapTextures(textures) {
  for (const [ texture , repeat, colorSpace ] of textures) {
    texture.repeat.set(...repeat)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    if (colorSpace) texture.colorSpace = colorSpace
  }
}