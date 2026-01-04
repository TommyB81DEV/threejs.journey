import {
  defaultSettings as lightsConfig,
  resetSettings as lights,
  lightsNames,
  useBakedShadows,
  useNativeShadows,
  useSimpleShadow,
} from './lights'

import {
  defaultSettings as objectsConfig,
  resetSettings as objects,
  objectsNames,
} from './objects.js'

const defaultObject = {

  // Commons
  color: '#FFFFFF',

  // Animation
  rotationSpeed: 0.1,

  // Lights
  ...lightsConfig,

  // Objects
  ...objectsConfig,

}

const debugObject = {
  axesHelper: true,
  color: defaultObject.color,
  customLights: true,
  rotationEnabled: false,
}

export {
  defaultObject,
  debugObject,
  lights,
  lightsNames,
  objects,
  objectsNames,
  useBakedShadows,
  useNativeShadows,
  useSimpleShadow,
}