import {
  camera,
} from './cameras.js'

import {
  defaultSettings as lightsConfig,
  reset as lightsReset,
  useBakedShadows,
  useNativeShadows,
  useRandomlyRotatingLIghts,
  useSimpleShadow,
} from './lights'

import {
  defaultSettings as objectsConfig,
  material,
  reset as objectsReset,
} from './objects.js'

const rotationEnabled = false
const showGui = true

const defaultObject = {

  // Commons
  color: '#FFFFFF',
  gui: {
    debug: {
      close: true,
    },
    start: {
      close: false,
      hide: true,
    }
  },
  material,
  rotationEnabled,
  rotationSpeed: 0.1,

  // Lights
  ...lightsConfig,

  // Objects
  ...objectsConfig,

}

const debugObject = {
  axesHelper: false,
  color: defaultObject.color,
  customLights: true,
  rotationEnabled,
}

export {
  camera,
  defaultObject,
  debugObject,
  lightsConfig,
  lightsReset,
  objectsConfig,
  objectsReset,
  showGui,
  useBakedShadows,
  useNativeShadows,
  useRandomlyRotatingLIghts,
  useSimpleShadow,
}