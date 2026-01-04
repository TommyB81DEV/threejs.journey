import {
  useSimpleShadow,
} from "./lights"

export const defaultSettings = {
  cube: {
    params: [ 0.75 , 0.75 , 0.75 ],
    position: [ 0, 0, 0 ],
    visible: true,
  },
  plane: {
    params: [5, 5],
    position: [0, -0.65, 0],
    rotation: [-Math.PI * 0.5, 0, 0],
  },
  sphere: {
    params: [0.5, 32, 32],
    position: useSimpleShadow ? [0, 0, 0] : [-1.5, 0, 0],
    visible: true,
  },
  sphereSimpleShadow: {
    color: 0x000000,
    params: [ 1.5 , 1.5 ],
    visible: true,
  },
  torus: {
    params: [ 0.3, 0.2, 32, 64 ],
    position: [ 1.5 , 0 , 0 ],
    visible: true,
  },
}

export const objectsNames = (
  useSimpleShadow
  ? [
    'plane',
    'sphere',
  ]
  : [
    'cube',
    'plane',
    'sphere',
    'torus',
  ]
)

export const resetSettings = {
  activations: [],
  object: Object.fromEntries(objectsNames.map(name => [ name , null ]))
}