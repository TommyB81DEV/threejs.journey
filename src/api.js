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

          const { ambientLight: alSettings } = settings
          const { params: alParams } = alSettings

          ambientLight = new THREE.AmbientLight(...alParams)

          scene.add(ambientLight)

          break

        case 'directional':

          const { directionalLight: dlSettings } = settings
          const { params: dlParams, position: dlPosition } = dlSettings

          directionalLight = new THREE.DirectionalLight(...dlParams)
          directionalLight.position.set(...dlPosition)

          scene.add(directionalLight)

          break

        case 'hemisphere':

          const { hemisphereLight: hlSettings } = settings
          const { params: hlParams, position: hlPosition } = hlSettings

          hemisphereLight = new THREE.HemisphereLight(...hlParams)
          hemisphereLight.position.set(...hlPosition)

          scene.add(hemisphereLight)

          break

        case 'rectarea':

          const { rectAreaLight: ralSettings } = settings
          const { params: ralParams, position: ralPosition } = ralSettings

          rectAreaLight = new THREE.RectAreaLight(...ralParams)
          rectAreaLight.position.set(...ralPosition)

          scene.add(rectAreaLight)

          break

        case 'point':

          const { pointLight: plSettings } = settings
          const { params: plParams, position: plPosition } = plSettings

          pointLight = new THREE.PointLight(...plParams)
          pointLight.position.set(...plPosition)

          scene.add(pointLight)

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