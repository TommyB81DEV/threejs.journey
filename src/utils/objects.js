import * as THREE from 'three'

import {
  useSimpleShadow,
} from '../config'

// API
export function getObjects(params) {

  const {
    config,
    objects,
    scene,
  } = params

  const materials = Object.fromEntries(
    Object.entries(config)
      .filter(([ key , val ]) => ( objects.list.includes(key)))
      .map(([ key , val ]) => [ key , val.material ? val.material : config.material ])
  )

  objects.activations = objects.list

  const meshes = toggleObjects({
    materials , objects, scene,
    settings: config,
  })

  objects.meshes = { ...meshes }

  return objects

}
export function toggleObjects(params) {

  const {
    materials,
    objects,
    scene,
    settings,
  } = params

  const meshes = {}

  if (objects.activations.length > 0) {   

    for (const name of objects.activations) {
      switch (name) {

        case 'cube':
          meshes.cube = cubeSet({ material: materials[name] , settings })
          scene.add(meshes.cube)
          break

        case 'plane':
          meshes.plane = planeSet({ material: materials[name], settings })
          scene.add(meshes.plane)
          break

        case 'sphere':

          const sphere = sphereSet({ material: materials[name], settings })

          meshes.sphere = useSimpleShadow ? sphere.object : sphere
          if (useSimpleShadow) meshes.sphereSimpleShadow = sphere.shadow

          scene.add(meshes.sphere)
          if (useSimpleShadow) scene.add(sphere.shadow)

          break

        case 'torus':
          meshes.torus = torusSet({ material: materials[name], settings })
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

  const object = (new THREE.Mesh(
    new THREE.BoxGeometry(...settings.cube.params),
    material,)
  )

  object.position.set(...settings.cube.position)
  object.visible = settings.cube.visible

  return object

}
export function planeSet(params){

  const { material , settings } = params

  const object = (new THREE.Mesh(
    new THREE.PlaneGeometry(...settings.plane.params),
    material
  ))

  object.rotation.x = settings.plane.rotation[0]
  object.position.set(0 , -0.65 , 0)

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

  const object = (new THREE.Mesh(
    new THREE.TorusGeometry(...settings.torus.params),
    material)
  )

  object.position.set(...settings.torus.position)
  object.visible = settings.torus.visible

  return object

}

// Animations
export function bounceShadow(params){

  const {
    active = false,
    bounceMultiplier = 5,
    cosMultiplier = 1.7,
    sinMultiplier = 1.7,
    elapsedTime,
    object,
    shadow,
  } = params

  if (active) {
    object.position.x = Math.cos(elapsedTime) * cosMultiplier
    object.position.z = Math.sin(elapsedTime) * sinMultiplier
    object.position.y = Math.abs(Math.cos(elapsedTime * bounceMultiplier))
    
    shadow.position.x = object.position.x
    shadow.position.z = object.position.z
    shadow.material.opacity = 1.5 - object.position.y
  }

}