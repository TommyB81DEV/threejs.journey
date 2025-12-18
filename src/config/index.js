import {
  config as lightsConfig,
  defaultSettings as lights,
  lightsNames,
} from './lights'

const defaultObject = {

  // Commons
  color: '#cc17d9',

  // Lights
  ...lightsConfig,

  // Animation
  rotationSpeed: 0.1,

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
}