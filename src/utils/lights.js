import * as THREE from 'three'

import { lightsNames } from '../config'

// SYNC
export function getLights(params) {

  const {
    config,
    lights,
    lightsNames,
    scene,
  } = params

  lights.activations = lightsNames

  const activations = toggleCustomLights({
    lights: lights,
    scene,
    settings: config,
  })

  lights.light = { ...activations }

  return lights.light

}
export function toggleCustomLights(params) {

  const { lights , scene, settings } = params

  let ambientLight
  let directionalLight
  let hemisphereLight
  let pointLight
  let rectAreaLight

  if (lights.activations.length > 0) {   

    for (const lightName of lights.activations) {
      switch (lightName) {

        case 'ambient':
          ambientLight = ambientLightSet(settings).light
          scene.add(ambientLight)
          break

        case 'directional':

          directionalLight = directionalLightSet(settings).light         
          directionalLight.helper = directionalLightSet(settings).helper

          scene.add(directionalLight)
          scene.add(directionalLight.helper)

          break

        case 'hemisphere':
          hemisphereLight = hemisphereLightSet(settings).light
          scene.add(hemisphereLight)
          break

        case 'rectarea':
          rectAreaLight = rectAreaLightSet(settings).light
          scene.add(rectAreaLight)
          break

        case 'point':

          pointLight = pointLightSet(settings).light
          pointLight.helper = pointLightSet(settings).helper

          scene.add(pointLight)
          scene.add(pointLight.helper)

          break

      }
    }

    return {
      ambientLight,
      directionalLight,
      hemisphereLight,
      rectAreaLight,
      pointLight,
    }

  }
  else {

    const lightsToRemove = []

    scene.traverse((child) => {
      if (child instanceof THREE.Light && child.type != 'PointLight') {
        lightsToRemove.push(child)
      }
    })

    lightsToRemove.forEach((light) => {
      scene.remove(light)
    })

    return null

  }

}
export function toggleLightsAndControllers(params) {

  const {
    action = 'off',
    gui,
    lights,
    scene,
    settings,
  } = params

  const activations = action === 'off' ? [] : lightsNames

  const controllersLights = (
    action === 'off'
      ? { ...lights , activations: lightsNames }
      : lights
  )

  const lightsActivations = toggleCustomLights({
    scene, settings,
    lights: { ...lights, activations },
  })

  lights.light = { ...lightsActivations }

  updateLightControllers(action,controllersLights,gui)

}
export function updateLightControllers(action,lights,gui) {
  if (lights.activations.length >0){   

    for (const lightName of lights.activations) {
      switch (lightName) {

        case 'directional':

          if (lights.folder.directional && action === 'off') {
            lights.folder.directional.destroy()
          }

          if (action === 'on') {
            
            lights.folder.directional = gui.addFolder('Directional Light').close()
  
            lights.controller.directionalLightColor = (
              lights.folder.directional
                .addColor(lights.light.directionalLight,'color')
                .name('DirectionalLight Color')
            )
  
            lights.controller.directionalLightIntensity = (
              lights.folder.directional
                .add(lights.light.directionalLight,'intensity')
                .min(0)
                .max(5)
                .step(0.0001)
                .name('DirectionalLight Intensity')
            )

          }

          break

        case 'hemisphere':

          if (lights.folder.hemisphere && action === 'off') {
            lights.folder.hemisphere.destroy()
          }

          if (action === 'on') {
            
            lights.folder.hemisphere = gui.addFolder('Hemisphere Light').close()
  
            lights.controller.hemisphereLightColor = (
              lights.folder.hemisphere
                .addColor(lights.light.hemisphereLight, 'color')
                .name('Hemisphere Light Color')
            )
  
            lights.controller.hemisphereLightGroundColor = (
              lights.folder.hemisphere
                .addColor(lights.light.hemisphereLight, 'groundColor')
                .name('Hemisphere Light Ground Color')
            )
  
            lights.controller.hemisphereLightIntensity = (
              lights.folder.hemisphere
                .add(lights.light.hemisphereLight,'intensity')
                .min(0)
                .max(5)
                .step(0.0001)
                .name('Hemisphere Light Intensity')
            )
  
            lights.controller.hemisphereLightX = (
              lights.folder.hemisphere
                .add(lights.light.hemisphereLight.position, 'x')
                .min(0)
                .max(10)
                .step(0.1)
                .name('Position X')
            )
  
            lights.controller.hemisphereLightY = (
              lights.folder.hemisphere
                .add(lights.light.hemisphereLight.position, 'y')
                .min(0)
                .max(10)
                .step(0.1)
                .name('Position Y')
            )
  
            lights.controller.hemisphereLightZ = (
              lights.folder.hemisphere
                .add(lights.light.hemisphereLight.position, 'z')
                .min(2)
                .max(10)
                .step(0.1)
                .name('Position Z')
            )

          }

          break

        case 'point':

          if (!lights.folder.point) {

            lights.folder.point = gui.addFolder('Point Light').close()

            lights.controller.pointLightColor = lights.folder.point
              .addColor(lights.light.pointLight, 'color')
              .name('Color')

            lights.controller.pointLightX = lights.folder.point
              .add(lights.light.pointLight.position, 'x')
              .min(0)
              .max(10)
              .step(0.1)
              .name('Position X')

            lights.controller.pointLightY = lights.folder.point
              .add(lights.light.pointLight.position, 'y')
              .min(0)
              .max(10)
              .step(0.1)
              .name('Position Y')

            lights.controller.pointLightZ = lights.folder.point
              .add(lights.light.pointLight.position, 'z')
              .min(2)
              .max(10)
              .step(0.1)
              .name('Position Z')
          }

          break

        case 'rectarea':

          if (lights.folder.rectarea && action === 'off') {
            lights.folder.rectarea.destroy()
          }

          if (action === 'on') {
            
            lights.folder.rectarea = gui.addFolder('React Arera Light').close()
  
            lights.controller.rectAreaLightColor = (
              lights.folder.rectarea
                .addColor(lights.light.rectAreaLight, 'color')
                .name('Color')
            )
  
            lights.controller.rectAreaLightIntensity = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight, 'intensity')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Intensity')
            )
  
            lights.controller.rectAreaLightH = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight,'height')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Height')
            )
  
            lights.controller.rectAreaLightW = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight, 'width')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Width')
            )
  
            lights.controller.rectAreaLightX = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight.position,'x')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Position X')
            )
  
            lights.controller.rectAreaLightY = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight.position,'y')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Position y')
            )
  
            lights.controller.rectAreaLightZ = (
              lights.folder.rectarea
                .add(lights.light.rectAreaLight.position, 'z')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Position Z')
            )

          }

          break

      }
    }

    if (action === 'on') return lights.controller

  }
}

// Lights specific
export function ambientLightSet(settings){

  let light

  // Settings
  const { ambientLight: lightSettings } = settings
  const { params: lightParams } = lightSettings

  // Init
  light = new THREE.AmbientLight(...lightParams)

  return { light }

}
export function directionalLightSet(settings){

  let helper
  let light

  // Settings
  const { directionalLight: lightSettings } = settings
  const { params: lightParams, position: lightPosition } = lightSettings

  // Creation
  light = new THREE.DirectionalLight(...lightParams)

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.camera.bottom = 10
  light.shadow.camera.left = 10
  light.shadow.camera.right = 10
  light.shadow.camera.top = 10
  light.shadow.camera.far = 8
  light.shadow.camera.near = 2
  light.shadow.mapSize.height = 1024
  light.shadow.mapSize.width = 1024

  helper = new THREE.CameraHelper(light.shadow.camera)

  return { helper , light }

}
export function hemisphereLightSet(settings) {
  
  let light

  // Settings
  const { hemisphereLight: lightSettings } = settings
  const { params: lightParams, position: lightPosition } = lightSettings

  // Init
  light = new THREE.HemisphereLight(...lightParams)

  // Position
  light.position.set(...lightPosition)

  return { light }

}
export function pointLightSet(settings) {
  
  let helper
  let light

  // Settings
  const { pointLight: lightSettings } = settings
  const { params: lightParams, position: lightPosition } = lightSettings

  // Creation
  light = new THREE.PointLight(...lightParams)

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.camera.far = 10
  light.shadow.camera.near = 4
  light.shadow.mapSize.height = 2000
  light.shadow.mapSize.width = 2000
  light.shadow.radius = 1

  helper = new THREE.CameraHelper(light.shadow.camera)

  return { helper , light }

}
export function rectAreaLightSet(settings) {

  let light

  // Settings
  const { rectAreaLight: lightSettings } = settings
  const { params: lightParams, position: lightPosition } = lightSettings

  // Init
  light = new THREE.RectAreaLight(...lightParams)

  // Position
  light.position.set(...lightPosition)  

  return { light }

}