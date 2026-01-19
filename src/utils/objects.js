import * as THREE from 'three'

import {
  defaultObject,
  useSimpleShadow,
} from '../config'

import { lesson } from '../config/lesson'

import {
  tileAndWrapTextures,
} from './commons'

// API
export function getObjects(params) {

  const {
    config,
    objects,
    scene,
    textureLoader,
  } = params

  const materials = Object.fromEntries(
    Object.entries(config)
      .filter(([ key , val ]) => ( objects.list.includes(key)))
      .map(([ key , val ]) => [ key , val.material ? val.material : config.material ])
  )

  objects.activations = objects.list

  const meshes = toggleObjects({
    materials , objects, scene, textureLoader,
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
    textureLoader,
  } = params

  const meshes = {}

  if (objects.activations.length > 0) {   

    for (const name of objects.activations) {
      switch (name) {

        case 'cube':
          meshes.cube = cubeSet({ material: materials[name] , settings })
          if (meshes.cube) scene.add(meshes.cube)
          break

        case 'floor':
          meshes.floor = floorSet({ 
            settings, textureLoader,
            material: materials[name],
          })
          if (meshes.floor) scene.add(meshes.floor)
          break

        case 'house':

          const house = houseSet({ settings , textureLoader })

          meshes.house = house
          if (meshes.house) scene.add(meshes.house)

          break

        case 'particles':
          meshes.particles = particlesSet({ settings , textureLoader })
          if (meshes.particles) scene.add(meshes.particles)
          break

        case 'plane':
          meshes.plane = planeSet({ 
            material: materials[name],
            settings, textureLoader,
          })
          if (meshes.plane) scene.add(meshes.plane)
          break

        case 'sphere':

          const sphere = sphereSet({ material: materials[name], settings })

          meshes.sphere = useSimpleShadow ? sphere.object : sphere
          if (useSimpleShadow && meshes.sphere) meshes.sphereSimpleShadow = sphere.shadow

          if (meshes.sphere) scene.add(meshes.sphere)
          if (useSimpleShadow && meshes.sphere) scene.add(sphere.shadow)

          break

        case 'torus':
          meshes.torus = torusSet({ material: materials[name], settings })
          if (meshes.torus) scene.add(meshes.torus)
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

  const { settings } = params

  if (settings.cube.render) {

    const cubeStandardMaterialParams = (
      lesson === '15-native' ? { roughness: 7 }
      /* base */             : { roughness: 7 }
    )

    const cubeStandarMaterial = new THREE.MeshStandardMaterial(cubeStandardMaterialParams)

    const cubeMaterial = (
        lesson === '15-native' ? cubeStandarMaterial
      : lesson === '17' ? cubeStandarMaterial
      : new THREE.MeshBasicMaterial()
    )

    const object = (new THREE.Mesh(
      new THREE.BoxGeometry(...settings.cube.params),
      cubeMaterial,)
    )

    object.position.set(...settings.cube.position)
    object.visible = settings.cube.visible

    return object

  }

  return null

}
export function floorSet(params){

  const { settings , textureLoader } = params

  if (settings.floor.render) {

    const texturesSettings = settings.floor.textures
    const textureType = settings.floor.textures.type

    const alphaTexture = textureLoader.load(`./floor/floor_alpha.${textureType}`)
    const ARMTexture = textureLoader.load(`./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.${textureType}`)
    const colorTexture = textureLoader.load(`./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.${textureType}`)
    const displacementTexture = textureLoader.load(`./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.${textureType}`)
    const normalTexture = textureLoader.load(`./floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.${textureType}`)

    tileAndWrapTextures([
      [ ARMTexture          , texturesSettings.wrapping.arm                          ],
      [ colorTexture        , texturesSettings.wrapping.color , THREE.SRGBColorSpace ],
      [ displacementTexture , texturesSettings.wrapping.arm                          ],
      [ normalTexture       , texturesSettings.wrapping.arm                          ],
    ])

    const object = (new THREE.Mesh(
      new THREE.PlaneGeometry(...settings.floor.params),
      new THREE.MeshStandardMaterial({
        alphaMap: alphaTexture,
        aoMap: ARMTexture,
        displacementBias: settings.floor.material.displacementBias,
        displacementMap: displacementTexture,
        displacementScale: settings.floor.material.displacementScale,
        map: colorTexture,
        metalnessMap: ARMTexture,
        normalMap: normalTexture,
        roughnessMap: ARMTexture,
        transparent: true,
      })
    ))

    object.rotation.x = settings.floor.rotation[0]
    object.position.set(...settings.floor.position)

    object.receiveShadow = true

    object.material.wireframe = settings.floor.wireframe || false

    object.visible = settings.floor.visible
    
    return object

  }

  return null

}
export function generateGalaxy(params) {

  const {
    gui,
    scene,
    settings,
  } = params

  const {
    active,
    branches,
    colors,
    expansionFrame,
    radius,
    randomness,
    randomnessPower,
    spin,
    stars,
  } = settings

  if (active) {

    let geometry
    let guiFolder
    let material
    let tweakParams
    let points

    tweakParams = {
      branches: branches.start,
      count: stars.start,
      colorInside: colors.inside,
      colorOutside: colors.outside,
      expansionFrame: expansionFrame.start,
      radius: radius.start,
      randomness: randomness.start,
      randomnessPower: randomnessPower.start,
      size: stars.size.start,
      spin: spin.start,
    }

    const generation = genParams => {

      const {
        branches,
        count,
        radius: radiusSetting,
        randomnessPower,
        size,
        spin,
      } = genParams

      geometry = geometry && geometry.dispose()
      material = material && material.dispose()
      scene.remove(points)

      geometry = new THREE.BufferGeometry()
      material = new THREE.PointsMaterial({
        size,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
        vertexColors: true,
      })

      const colors = new Float32Array(count * 3)
      const positions = new Float32Array(count * 3)

      const colorInside = new THREE.Color(genParams.colorInside)
      const colorOutside = new THREE.Color(genParams.colorOutside)

      for (let i = 0; i < count; i++) {

        const i3 = i * 3

        const branchAngle = (i % branches) / branches * Math.PI * 2
        const radius = Math.random() * radiusSetting
        const spinAngle = radius * spin

        // colors
        const colorMixed = colorInside.clone()
              colorMixed.lerp( colorOutside , radius / radiusSetting )

        colors[ i3 + 0 ] = colorMixed.r
        colors[ i3 + 1 ] = colorMixed.g
        colors[ i3 + 2 ] = colorMixed.b

        // positions
        const randomX = Math.pow(Math.random(),randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(),randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(),randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      }

      geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors,3)
      )

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions,3)
      )

      points = new THREE.Points(geometry,material)

      scene.add(points)

      return points

    }

    points = generation(tweakParams)

    guiFolder = (() => {

      const guiFolder = gui.addFolder('Galaxy')
  
      if (settings.gui.close) guiFolder.close()

      guiFolder
        .add(tweakParams,'branches')
        .min(branches.min)
        .max(branches.max)
        .step(branches.step)
        .name('Branches')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .addColor(tweakParams,'colorInside')
        .name('Color Inside')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .addColor(tweakParams, 'colorOutside')
        .name('Color Outside')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams,'count')
        .min(stars.min)
        .max(stars.max)
        .step(stars.step)
        .name('Stars Count')
        .onFinishChange(() => generation(tweakParams))
  
      guiFolder
        .add(tweakParams,'expansionFrame')
        .min(expansionFrame.min)
        .max(expansionFrame.max)
        .step(expansionFrame.step)
        .name('Raggio di espansione')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams, 'radius')
        .min(radius.min)
        .max(radius.max)
        .step(radius.step)
        .name('Radius')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams, 'randomness')
        .min(randomness.min)
        .max(randomness.max)
        .step(randomness.step)
        .name('Randomness')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams, 'randomnessPower')
        .min(randomnessPower.min)
        .max(randomnessPower.max)
        .step(randomnessPower.step)
        .name('Randomness Power')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams, 'size')
        .min(stars.size.min)
        .max(stars.size.max)
        .step(stars.size.step)
        .name('Star Size')
        .onFinishChange(() => generation(tweakParams))

      guiFolder
        .add(tweakParams,'spin')
        .min(spin.min)
        .max(spin.max)
        .step(spin.step)
        .name('Spin')
        .onFinishChange(() => generation(tweakParams))

      return guiFolder

    })()

    return { gui: guiFolder , object: points }

  }

}
export function houseSet(params){

  const {
    settings: rootSettings,
    textureLoader,
  } = params

  if (rootSettings.house.render) {
    
    const house  = new THREE.Group()

    const objects = rootSettings.house.group

    for (const [ name , settings ] of Object.entries(objects)) {
      switch (name) {

        case 'bushes':

          const bushTextureType = settings.textures.type

          const bushARMTexture = textureLoader.load(`./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.${bushTextureType}`)
          const bushColorTexture = textureLoader.load(`./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.${bushTextureType}`)
          const bushNormalTexture = textureLoader.load(`./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_1k.${bushTextureType}`)

          const bushGeometry = new THREE.SphereGeometry(...objects.bushes.params)
          const bushMaterial = new THREE.MeshStandardMaterial({
            aoMap: bushARMTexture,
            color: '#ccffcc',
            map: bushColorTexture,
            metalnessMap: bushARMTexture,
            normalMap: bushNormalTexture,
            roughnessMap: bushARMTexture,
          })

          tileAndWrapTextures([
            [ bushARMTexture    , settings.textures.wrapping.arm                           ],
            [ bushColorTexture  , settings.textures.wrapping.color  , THREE.SRGBColorSpace ],
            [ bushNormalTexture , settings.textures.wrapping.normal                        ],
          ])

          const bushes = []

          for (const bush of objects.bushes.clones) {

            const bushMesh = new THREE.Mesh(bushGeometry,bushMaterial.clone())

            bushMesh.position.set(...bush.position)
            bushMesh.scale.set(...bush.scale)
            bushMesh.visible = bush.visible

            bushMesh.material.wireframe = bush.wireframe

            bushMesh.castShadow = true
            bushMesh.receiveShadow = true

            if (bush.rotation) {
              for (const [ axis , val ] of Object.entries(bush.rotation)) {
                bushMesh.rotation[axis] = val
              }
            }

            bushes.push(bushMesh)
            house.add(bushMesh)

          }

          break

        case 'door':

          const doorTextureType = settings.textures.type

          const doorAlphaTexture = textureLoader.load(`./door/door_alpha.${doorTextureType}`)
          const doorAOTexture = textureLoader.load(`./door/door_ambientOcclusion.${doorTextureType}`)
          const doorColorTexture = textureLoader.load(`./door/door_color.${doorTextureType}`)
          const doorHeightTexture = textureLoader.load(`./door/door_height.${doorTextureType}`)
          const doorMetalnessTexture = textureLoader.load(`./door/door_metalness.${doorTextureType}`)
          const doorNormalTexture = textureLoader.load(`./door/door_normal.${doorTextureType}`)
          const doorRoughnessTexture = textureLoader.load(`./door/door_roughness.${doorTextureType}`)

          doorColorTexture.colorSpace = THREE.SRGBColorSpace

          const door = (new THREE.Mesh(
            new THREE.PlaneGeometry(...settings.params),
            new THREE.MeshStandardMaterial({
              alphaMap: doorAlphaTexture,
              aoMap: doorAOTexture,
              displacementMap: doorHeightTexture,
              displacementScale: 0.15,
              map: doorColorTexture,
              metalnessMap: doorMetalnessTexture,
              normalMap: doorNormalTexture,
              roughnessMap: doorRoughnessTexture,
              transparent: true,
            })
          ))

          door.position.y = settings.params[1] * 0.5
          door.position.z = (objects.walls.params[2] * 0.5) - 0.025

          door.material.wireframe = settings.wireframe

          door.castShadow = true
          door.receiveShadow = true

          door.visible = settings.visible

          house.add(door)

          break

        case 'graves':

          const graveTextureType = settings.textures.type

          const graveARMTexture = textureLoader.load(`./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.${graveTextureType}`)
          const graveColorTexture = textureLoader.load(`./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.${graveTextureType}`)
          const graveNormalTexture = textureLoader.load(`./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.${graveTextureType}`)

          tileAndWrapTextures([
            [ graveARMTexture    , settings.textures.wrapping.arm                           ],
            [ graveColorTexture  , settings.textures.wrapping.color  , THREE.SRGBColorSpace ],
            [ graveNormalTexture , settings.textures.wrapping.normal                        ],
          ])

          const graves = new THREE.Group()
          const graveGeometry = new THREE.BoxGeometry(...objects.graves.params)
          const graveMaterial = new THREE.MeshStandardMaterial({
            aoMap: graveARMTexture,
            map: graveColorTexture,
            normalMap: graveNormalTexture,
            roughnessMap: graveARMTexture,
            metalnessMap: graveARMTexture,
          })

          for (let index = 0; index < objects.graves.max; index++) {

            const angle = Math.random() * (Math.PI * 2)
            const grave = new THREE.Mesh(graveGeometry,graveMaterial)
            const radius = 3 + Math.random() * 4

            const x = Math.sin(angle) * radius
            const z = Math.cos(angle) * radius

            grave.position.x = x
            grave.position.y = Math.random() * 0.4
            grave.position.z = z

            grave.rotation.x = (Math.random() - 0.5) * 0.4
            grave.rotation.y = (Math.random() - 0.5) * 0.4
            grave.rotation.z = (Math.random() - 0.5) * 0.4

            grave.material.wireframe = settings.wireframe

            grave.castShadow = true
            grave.receiveShadow = true

            graves.add(grave)

          }        

          graves.visible = settings.visible
          
          house.add(graves)

          break

        case 'roof':

          const roofTextureType = settings.textures.type

          const roofARMTexture = textureLoader.load(`/roof/roof_slates_02_1k/roof_slates_02_arm_1k.${roofTextureType}`)
          const roofColorTexture = textureLoader.load(`/roof/roof_slates_02_1k/roof_slates_02_diff_1k.${roofTextureType}`)
          const roofNormalTexture = textureLoader.load(`/roof/roof_slates_02_1k/roof_slates_02_nor_1k.${roofTextureType}`)

          const roof = (new THREE.Mesh(
            new THREE.ConeGeometry(...settings.params),
            new THREE.MeshStandardMaterial({
              aoMap: roofARMTexture,
              map: roofColorTexture,
              metalnessMap: roofARMTexture,
              normalMap: roofNormalTexture,
              roughnessMap: roofARMTexture,
            })
          ))

          tileAndWrapTextures([
            [ roofARMTexture    , settings.textures.wrapping.arm                           ],
            [ roofColorTexture  , settings.textures.wrapping.color  , THREE.SRGBColorSpace ],
            [ roofNormalTexture , settings.textures.wrapping.normal                        ],
          ])

          roof.rotation.y = Math.PI * 0.25,

          roof.position.y = (
            objects.walls.params[1] + 
            (settings.params[1] * 0.5)
          )

          roof.material.wireframe = settings.wireframe

          roof.castShadow = true
          roof.receiveShadow = true

          roof.visible = settings.visible

          house.add(roof)

          break

        case 'walls':

          const wallTextureType = settings.textures.type

          const wallARMTexture = textureLoader.load(`./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.${wallTextureType}`)
          const wallColorTexture = textureLoader.load(`./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.${wallTextureType}`)
          const wallNormalTexture = textureLoader.load(`./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.${wallTextureType}`)

          wallColorTexture.colorSpace = THREE.SRGBColorSpace

          const walls = (new THREE.Mesh(
            new THREE.BoxGeometry(...settings.params),
            new THREE.MeshStandardMaterial({
              aoMap: wallARMTexture,
              map: wallARMTexture,
              metalnessMap: wallARMTexture,
              normalMap: wallNormalTexture,
              roughnessMap: wallARMTexture,
            })
          ))

          walls.position.y = settings.params[1] * 0.5
          walls.visible = settings.visible

          walls.material.wireframe = settings.wireframe

          walls.castShadow = true
          walls.receiveShadow = true

          house.add(walls)

          break

      }
    }

    house.visible = rootSettings.house.visible

    return house

  }

  return null

}
export function particlesSet(params) {

  const {
    settings,
    textureLoader,
  } = params

  if (settings.particles.render) {

    const count = defaultObject.particles.count
  
    const texture = textureLoader.load('./particles/2.png')

    const particleGeometry = new THREE.BufferGeometry()
    const particleMaterial = new THREE.PointsMaterial({

      alphaMap: texture,
      alphaTest: 0.001,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,

      // color: '#ff00ff',
      map: texture,
      size: defaultObject.particles.size,
      sizeAttenuation: defaultObject.particles.sizeAttenuation,
      vertexColors: true,

    })
 
    const attributes = (() => {
  
      const colors = new Float32Array(count * 3)
      const positions = new Float32Array(count * 3)
  
      for (let i = 0; i < count * 3; i++) {
        colors[i] = Math.random()
        positions[i] = (Math.random() - 0.5) * 10
      }
  
      return {
        colors,
        positions,
      }
  
    })()

    particleGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(attributes.colors,3)
    )
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(attributes.positions,3)
    )

    const particles = new THREE.Points( particleGeometry , particleMaterial )

    return particles

  }

  return null

}
export function planeSet(params){

  const { material, settings , textureLoader } = params

  if (settings.plane.render) {

    const object = (new THREE.Mesh(
      new THREE.PlaneGeometry(...settings.plane.params),
      material,
    ))

    object.rotation.x = settings.plane.rotation[0]
    object.position.set(...settings.plane.position)

    object.receiveShadow = true

    object.material.wireframe = settings.floor.wireframe || false

    object.visible = settings.floor.visible
    
    return object

  }

  return null

}
export function sphereSet(params){

  const { material , settings } = params

  if (settings.sphere.render) {
    
    let output
    let shadow
  
    const object = (new THREE.Mesh(
      new THREE.SphereGeometry(...settings.sphere.params),
      material
    ))
  
    const position = settings.sphere.position?.[lesson] ?? settings.sphere.position?.base

    object.position.set(...position)
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

  return null

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

  if (settings.torus.render) {
    
    const object = (new THREE.Mesh(
      new THREE.TorusGeometry(...settings.torus.params),
      material)
    )
  
    object.position.set(...settings.torus.position)
    object.visible = settings.torus.visible
  
    return object

  }

  return null

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
