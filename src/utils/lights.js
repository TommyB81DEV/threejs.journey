import * as THREE from 'three'

import {
  lightsNames,
} from '../config'

import { lesson } from '../config/lesson'

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
    lights, scene,
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
  let spotLight

  if (lights.activations.length > 0) {   

    for (const lightName of lights.activations) {
      switch (lightName) {

        case 'ambient':
          ambientLight = ambientLightSet(settings).light
          scene.add(ambientLight)
          break

        case 'directional':

          const directionalLightObj = directionalLightSet(settings)

          directionalLight = directionalLightObj.light
          directionalLight.helper = directionalLightObj.helper

          scene.add(directionalLight)
          scene.add(directionalLight.helper)
          scene.add(directionalLight.target)

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

          const pointLightObj = pointLightSet(settings)

          pointLight = pointLightObj.light
          pointLight.helper = pointLightObj.helper

          scene.add(pointLight)
          scene.add(pointLight.helper)

          break

        case 'spot':

          const spotLightObj = spotLightSet(settings)

          spotLight = spotLightObj.light
          spotLight.helper = spotLightObj.helper

          scene.add(spotLight)
          scene.add(spotLight.helper)

          break

      }
    }

    return {
      ambientLight,
      directionalLight,
      hemisphereLight,
      rectAreaLight,
      pointLight,
      spotLight,
    }

  }
  else {

    const lightsToRemove = []

    scene.traverse(child => {
      if (child instanceof THREE.Light && child.type != 'PointLight') {
        lightsToRemove.push(child)
      }
    })

    lightsToRemove.forEach(light => {
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

        case 'ambient':

          if (lights.folder.ambient && action === 'off') {
            lights.folder.ambient.destroy()
          }

          if (action === 'on') {

            lights.folder.ambient = gui.addFolder('Ambient Light').close()

            lights.controller.ambientLightColor = (
              lights.folder.ambient
                .addColor(lights.light.ambientLight,'color')
                .name('Color')
            )

            lights.controller.ambientLightIntensity = (
              lights.folder.ambient
                .add(lights.light.ambientLight,'intensity')
                .min(0)
                .max(10)
                .step(0.0001)
                .name('Intensity')
            )

          }

          break

        case 'directional':

          if (lights.folder.directional && action === 'off') {
            lights.folder.directional.destroy()
          }

          if (action === 'on') {

            const cameraHelper = lights.light.directionalLight.helper
            const shadowCamera = lights.light.directionalLight.shadow.camera

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

            lights.controller.directionalLightHelper = (
              lights.folder.directional
                .add(lights.light.directionalLight.helper,'visible')
                .name('Helper')
            )

            lights.controller.directionalLightShadowNear = (
              lights.folder.directional
                .add(shadowCamera, 'near')
                .min(0.1)
                .max(50)
                .step(0.1)
                .name('Shadow Camera ::: Near')
                .onChange(() => {
                  cameraHelper.update()
                  shadowCamera.updateProjectionMatrix()
                })
            )
              
            lights.controller.directionalLightShadowNear = (
                lights.folder.directional
                .add(shadowCamera, 'far')
                .min(0.1)
                .max(40)
                .step(0.1)
                .name('Shadow Camera ::: Far')
                .onChange(() => {
                  cameraHelper.update()
                  shadowCamera.updateProjectionMatrix()
                })
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

            lights.controller.pointLightColor = (
              lights.folder.point
                .addColor(lights.light.pointLight, 'color')
                .name('Color')
            )

            lights.controller.pointLightIntensity = (
              lights.folder.point
                .add(lights.light.pointLight,'intensity')
                .min(0)
                .max(50)
                .step(0.0001)
                .name('Intensity')
            )

            lights.controller.pointLightIHelper = (
              lights.folder.point
                .add(lights.light.pointLight.helper,'visible')
                .name('Helper')
            )

            lights.controller.pointLightX = (
                lights.folder.point
                  .add(lights.light.pointLight.position, 'x')
                  .min(0)
                  .max(10)
                  .step(0.1)
                  .name('Position X')
            )

            lights.controller.pointLightY = (
              lights.folder.point
                .add(lights.light.pointLight.position, 'y')
                .min(0)
                .max(10)
                .step(0.1)
                .name('Position Y')
            )

            lights.controller.pointLightZ = (
              lights.folder.point
                .add(lights.light.pointLight.position, 'z')
                .min(2)
                .max(10)
                .step(0.1)
                .name('Position Z')
            )

          }

          break

        case 'rectarea':

          if (lights.folder.rectarea && action === 'off') {
            lights.folder.rectarea.destroy()
          }

          if (action === 'on') {
            
            lights.folder.rectarea = gui.addFolder('React Area Light').close()
  
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

        case 'spot':

          if (lights.folder.spot && action === 'off') {
            lights.folder.spot.destroy()
          }

          if (action === 'on') {

            lights.folder.spot = gui.addFolder('Spot Light').close()

            lights.controller.spotLightColor = (
              lights.folder.spot
                .addColor(lights.light.spotLight,'color')
                .name('Color')
            )

            lights.controller.spotLightIntensity = (
              lights.folder.spot
                .add(lights.light.spotLight,'intensity')
                .min(0)
                .max(50)
                .step(0.0001)
                .name('intensity')
            )

            lights.controller.spotLightHelper = (
              lights.folder.spot
                .add(lights.light.spotLight.helper,'visible')
                .name('Helper')
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

  // Color
  const color = (
    lesson === '15-native' ? 0xf700ff
    /* base */             : 0xffffff
  )

  // Init
  light = new THREE.AmbientLight(...lightParams(color))

  return { light }

}
export function directionalLightSet(settings){

  let helper
  let light

  // Settings
  const { 
    directionalLight: lightSettings,
  } = settings
  const {
    amplitude , colors , far, intensities , mapSize , near , radius ,
    helper: helperConfig,
    params: lightParams,
    position: lightPosition,
  } = lightSettings

  // Color
  const color = colors?.[lesson] ?? colors.base

  // Intensity
  const intensity = intensities?.[lesson] ?? intensities.base

  // Creation
  light = new THREE.DirectionalLight(...lightParams(color,intensity))

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.camera.bottom = amplitude[2]
  light.shadow.camera.far = far
  light.shadow.camera.left = amplitude[3]
  light.shadow.camera.near = near
  light.shadow.camera.right = amplitude[1]
  light.shadow.camera.top = amplitude[0]
  light.shadow.mapSize.height = mapSize[0]
  light.shadow.mapSize.width = mapSize[1]

  helper = new THREE.CameraHelper(light.shadow.camera)
  helper.visible = helperConfig.visible

  return { helper , light }

}
export function doorLightSet(settings) {
  
  let helper
  let light

  // Settings
  const {
    doorLight: lightSettings,
  } = settings
  const { 
    mapSize,
    helper: helperConfig,
    params: lightParams,
    position: lightPosition,
  } = lightSettings

  // Creation
  light = new THREE.PointLight(...lightParams)

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.camera.bottom = amplitude[2]
  light.shadow.camera.left = amplitude[3]
  light.shadow.camera.right = amplitude[1]
  light.shadow.camera.top = amplitude[0]
  light.shadow.camera.far = far
  light.shadow.camera.near = near
  light.shadow.mapSize.height = mapSize[0]
  light.shadow.mapSize.width = mapSize[1]
  light.shadow.radius = radius

  helper = new THREE.CameraHelper(light.shadow.camera)
  helper.visible = helperConfig.visible

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
  const {
    pointLight: lightSettings,
  } = settings
  const { 
    colors, intensities, mapSize,
    far = camera.default.perspective.far,
    helper: helperConfig,
    params: lightParams,
    position: lightPosition,
  } = lightSettings

  const color = colors?.[lesson] ?? colors.base
  const intensity = intensities?.[lesson] ?? intensities.base

  // Creation
  light = new THREE.PointLight(...lightParams(color,intensity))

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.camera.far = far
  light.shadow.camera.near = near
  light.shadow.mapSize.height = mapSize[0]
  light.shadow.mapSize.width = mapSize[1]

  helper = new THREE.CameraHelper(light.shadow.camera)
  helper.visible = helperConfig.visible

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
export function spotLightSet(settings){

  let helper
  let light

  // Settings
  const { 
    spotLight: lightSettings,
  } = settings
  const {
    far, mapSize, near,
    helper: helperConfig,
    params: lightParams,
    position: lightPosition,
  } = lightSettings

  // Creation
  light = new THREE.SpotLight(...lightParams)

  // Position
  light.position.set(...lightPosition)

  // Configs
  light.castShadow = true
  light.shadow.mapSize.height = mapSize[0]
  light.shadow.mapSize.width = mapSize[1]
  light.shadow.camera.far = far
  light.shadow.camera.near = near

  helper = new THREE.CameraHelper(light.shadow.camera)
  helper.visible = helperConfig.visible

  return { helper , light }

}