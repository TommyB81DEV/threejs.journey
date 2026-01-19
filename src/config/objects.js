import * as THREE from 'three'

import { lesson } from './lesson'

export const defaultSettings = {
  cube: {
    params: [0.75, 0.75, 0.75],
    position: [0, 0, 0],
    render: true,
    visible: true,
    wireframe: false,
  },
  floor: {
    active: lesson === '16',
    gui: {
      close: true,
    },
    material: {
      displacementBias: -0.2,
      displacementScale: 0.3,
    },
    params: [20, 20, 100, 100],
    position: [0, 0, 0],
    render: true,
    rotation: [-Math.PI * 0.5, 0, 0],
    textures: {
      type: 'webp',
      wrapping: {
        arm: [8, 8],
        color: [8, 8],
        normal: [8, 8],
      },
    },
    visible: true,
    wireframe: false,
  },
  galaxy: {
    active: lesson == '18',
    branches: {
      max: 20,
      min: 1,
      start: 15,
      step: 1,
    },
    colors: {
      inside: 0xff6200,
      outside: 0x1500ff,
    },
    expansionFrame: {
      max: 10,
      min: 1,
      start: 3,
      step: 1,
    },
    gui: {
      close: true,
    },
    radius: {
      max: 20,
      min: 0.01,
      start: 5,
      step: 0.01,
    },
    randomness: {
      max: 2,
      min: 0,
      start: 0.2,
      step: 0.001,
    },
    randomnessPower: {
      max: 10,
      min: 1,
      start: 6,
      step: 0.001,
    },
    spin: {
      max: 5,
      min: -5,
      start: 1,
      step: 0.001,
    },
    stars: {
      max: 100000,
      min: 100,
      size: {
        min: 0.001,
        max: 0.1,
        start: 0.002,
        step: 0.001,
      },
      start: 20000,
      step: 1,
    },
  },
  house: {
    group: {
      bushes: {
        clones: [
          {
            rotation: { x: -0.75 },
            position: [0.8, 0.2, 2.2],
            scale: [0.5, 0.5, 0.5],
            visible: true,
            wireframe: false,
          },
          {
            rotation: { x: -0.75 },
            position: [1.4, 0.1, 2.1],
            scale: [0.25, 0.25, 0.25],
            visible: true,
            wireframe: false,
          },
          {
            rotation: { x: -0.75 },
            position: [-0.8, 0.1, 2.2],
            scale: [0.4, 0.4, 0.4],
            visible: true,
            wireframe: false,
          },
          {
            rotation: { x: -0.75 },
            position: [-1, 0.05, 2.6],
            scale: [0.15, 0.15, 0.15],
            visible: true,
            wireframe: false,
          },
        ],
        params: [1, 16, 16],
        textures: {
          type: 'webp',
          wrapping: {
            arm: [1, 1],
            color: [1, 1],
            normal: [1, 1],
          },
        },
      },
      door: {
        params: [2.2, 2.2, 100, 100],
        textures: { type: 'webp' },
        visible: true,
        wireframe: false,
      },
      graves: {
        max: 30,
        params: [0.6, 0.8, 0.2],
        textures: {
          type: 'webp',
          wrapping: {
            arm: [0.3, 0.4],
            color: [0.3, 0.4],
            normal: [0.3, 0.4],
          },
        },
        visible: true,
        wireframe: false,
      },
      roof: {
        params: [3.5, 1.5, 4],
        textures: {
          type: 'webp',
          wrapping: {
            arm: [3, 1],
            color: [3, 1],
            normal: [3, 1],
          },
        },
        visible: true,
        wireframe: false,
      },
      walls: {
        params: [4, 2.5, 4],
        textures: {
          type: 'webp',
          wrapping: {
            arm: [3, 1],
            color: [3, 1],
            normal: [3, 1],
          },
        },
        visible: true,
        wireframe: false,
      },
    },
    render: true,
    visible: true,
  },
  particles: {
    animation: false,
    count: 5000,
    size: 0.2,
    sizeAttenuation: true,
    render: true,
    visible: true,
  },
  plane: {
    material: new THREE.MeshStandardMaterial(),
    params: [5, 5, 1, 1],
    position: [0, -0.65, 0],
    render: true,
    rotation: [-Math.PI * 0.5, 0, 0],
    visible: true,
    wireframe: false,
  },
  sphere: {
    material: new THREE.MeshStandardMaterial({ roughness: 0.7 }),
    params: [0.5, 32, 32],
    position: {
      '15-baked': [0, 0, 0],
      '15-simple': [0, 0, 0],
      base: [-1.5, 0, 0],
    },
    render: true,
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
    render: true,
    visible: true,
  },
}

export const material = (() => {
  const material = new THREE.MeshStandardMaterial()
  material.roughness = 0.7
  return material
})()

export const list = (
  lesson === '15-baked' ?
    [
      'plane',
      'sphere',
    ]
  : lesson === '15-native' ?
    [
      'cube',
      'plane',
      'sphere',
      'torus',
    ]
  : lesson === '15-simple' ?
    [
      'plane',
      'sphere',
    ]
  : lesson === '16' ?
    [
      'floor',
      'house',
    ]
  : lesson === '17' ?
    [
      // 'cube',
      'particles',
    ]
  : lesson === '18' ?
    []
  : // 
    []
)

export const reset = {
  activations: [],
  list,
  meshes: Object.fromEntries(list.map(name => [ name , null ])),
}