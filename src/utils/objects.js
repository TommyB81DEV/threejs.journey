import * as THREE from 'three'

import {
  useBakedShadows,
  useSimpleShadow,
} from '../config'

// API
export function getObjects(params) {

  const {
    config,
    material,
    objects,
    objectsNames,
    scene,
  } = params

  objects.activations = objectsNames

  const activations = toggleObjects({
    material , objects, scene,
    names: objectsNames,
    settings: config,
  })

  objects.object = { ...activations }

  return objects.object

}
export function toggleObjects(params) {

  const {
    material,
    names,
    objects,
    scene,
    settings,
  } = params

  const meshes = Object.fromEntries(names.map(name => [ name , null ]))

  if (objects.activations.length > 0) {   

    for (const name of objects.activations) {
      switch (name) {

        case 'cube':
          meshes.cube = cubeSet({ material , settings })
          scene.add(meshes.cube)
          break

        case 'plane':
          meshes.plane = planeSet({ material , settings })
          scene.add(meshes.plane)
          break

        case 'sphere':

          const sphere = sphereSet({ material , settings })

          meshes.sphere = useSimpleShadow ? sphere.object : sphere
          meshes.sphereSimpleShadow = useSimpleShadow ? sphere.shadow : null

          scene.add(meshes.sphere)
          if (useSimpleShadow) scene.add(sphere.shadow)

          break

        case 'torus':
          meshes.torus = torusSet({ material , settings })
          scene.add(meshes.torus)
          break

      }
    }

    return meshes

  }
  else {

    const objectsToRemove = []

    scene.traverse(child => {
      if (child instanceof THREE.Mesh) {
        objectsToRemove.push(child)
      }
    })

    objectsToRemove.forEach(obj => {
      scene.remove(obj)
    })

    return null

  }

}

// Objects settings
export function cubeSet(params){

  const { material , settings } = params

  const object = new THREE.Mesh(
    new THREE.BoxGeometry(...settings.cube.params),
    material
  )

  object.position.set(...settings.cube.position)
  object.visible = settings.cube.visible

  return object

}
export function planeSet(params){

  const { material , settings } = params

  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(...settings.plane.params),
    material
  )

  object.rotation.x = settings.plane.rotation[0]

  object.position.x = settings.plane.position[0]
  object.position.y = settings.plane.position[1]
  object.position.z = settings.plane.position[2]

  return object

}
export function sphereSet(params){

  const { material , settings } = params

  let output
  let shadow

  const object = (new THREE.Mesh(
    new THREE.SphereGeometry(...settings.sphere.params),
    material
  ))

  object.position.set(...settings.sphere.position)
  object.visible = settings.sphere.visible

  if (useSimpleShadow) {
    shadow = sphereSimpleShadowSet(settings)  
    output = { object , shadow }
  }

  else {
    output = object
  }

  return output

}
export function sphereSimpleShadowSet(settings){

  const textureLoader = new THREE.TextureLoader()

  const simpleShadow = textureLoader.load('/textures/simpleShadow.jpg')

  const shadow = (new THREE.Mesh(
    new THREE.PlaneGeometry(...settings.sphereSimpleShadow.params),
    new THREE.MeshBasicMaterial({
      alphaMap: simpleShadow,
      color: settings.sphereSimpleShadow.color,
      transparent: true,
    })
  ))

  shadow.position.y = settings.plane.position[1] + 0.01
  shadow.rotation.x = -Math.PI * 0.5
  shadow.visible = settings.sphereSimpleShadow.visible

  return shadow

}
export function torusSet(params){

  const { material , settings } = params

  const object = new THREE.Mesh(
    new THREE.TorusGeometry(...settings.torus.params),
    material
  )

  object.position.set(...settings.torus.position)
  object.visible = settings.torus.visible

  return object

}

// Animations
export function bounceShadow(params){

  const {
    bounceMultiplier = 5,
    cosMultiplier = 1.7,
    sinMultiplier = 1.7,
    elapsedTime,
    object,
    shadow,
  } = params

  object.position.x = Math.cos(elapsedTime) * cosMultiplier
  object.position.z = Math.sin(elapsedTime) * sinMultiplier
  object.position.y = Math.abs(Math.cos(elapsedTime * bounceMultiplier))
  
  shadow.position.x = object.position.x
  shadow.position.z = object.position.z
  shadow.material.opacity = 1.5 - object.position.y

}