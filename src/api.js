import * as THREE from 'three'

import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
const pointLight = new THREE.PointLight(0xffffff, 50)

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

// ASYNC
export async function createText(params) {

  const {
    color,
    path,
    text,
    settings
  } = params

  try {

    const fontLoader = new FontLoader()

    return new Promise((resolve, reject) => {
      fontLoader.load(
        path,
        font => {

          const geometry = new TextGeometry(text,settings(font))
          const material = new THREE.MeshBasicMaterial({color})

          geometry.center()

          const textMesh = new THREE.Mesh(geometry, material)

          resolve(textMesh)

        },
        undefined,
        error => {
          console.error('Errore nel caricamento del font:',error)
          reject(error)
        }
      )
    })

  }
  catch (error) {
    console.error('Errore nella creazione del testo:',error)
    throw error
  }

}