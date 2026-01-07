import * as THREE from 'three'

import {
  useSimpleShadow,
} from './lights'

export const defaultSettings = {
  cube: {
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [ 0.75 , 0.75 , 0.75 ],
    position: [ 0 , 0 , 0 ],
    visible: true,
  },
  plane: {
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [ 5 , 5 ],
    position: [ 0 , 0 , 0 ],
    rotation: [ -Math.PI * 0.5 , 0 , 0 ],
    visibile: true,
  },
  sphere: {
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [1, 32, 32],
    position: useSimpleShadow ? [0, 0, 0] : [0, 0.35, 0],
    visible: true,
  },
  sphereSimpleShadow: {
    color: 0x000000,
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [1.5, 1.5],
    visible: true,
  },
  torus: {
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [0.3, 0.2, 32, 64],
    position: [1.5, 0, 0],
    visible: true,
  },
}

export const material = (() => {
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7
  return material
})()

export const list = (
  useSimpleShadow
    ? [
      'plane',
      'sphere',
    ]
  // others
    : [
        // 'cube',
        'plane',
        'sphere',
        // 'torus',
      ]
)

export const reset = {
  activations: [],
  list,
  meshes: Object.fromEntries(list.map(name => [ name , null ])),
}