import { lesson } from './lesson'

export const useNativeShadows = lesson === '15-native'
export const useBakedShadows = lesson === '15-baked'
export const useSimpleShadow = lesson === '15-simple'

export const defaultSettings = {
  ambientLight: {
    params: color => [ color , 0.5 ],
  },
  directionalLight: {
    amplitude: [ 8 , 8 , -8 , - 8],
    colors: {
      'base': 0xffffff,
      '15-native': 0xf700ff,
      '15-simple': 0xffffff,
    },
    far: 20,
    helper: { visible: false },
    intensities: {
      '15-simple': 10,
      'base': 1.5,
    },
    mapSize: [ 256 , 256 ],
    near: 1,
    params: (c,i) => [ c , i ],
    position: [ 3 , 2 , -8 ],
  },
  doorLight: {
    helper: { visible: true },
    mapSize: [ 1024 , 1024 ],
    near: 2,
    params: [ 0xffffff , 1 ],
    position: [ 0 , 0 , 5 ],
    radius: 5,
  },
  hemisphereLight: {
    params: [ 0xff0000 , 0x0000ff , 0.3 ],
    position: [ 1 , 0.25 , 0 ],
  },
  rectAreaLight: {
    params: [ 0xffffff , 2 , 1 , 1 ],
    position: [0, 0, 3],
  },
  pointLight: {
    colors: {
      'base': 0xff00ff,
      '15-native': 0xff3300,
    },
    far: 10,
    helper: { visible: false },
    intensities: {
      'base': 10,
      '15-native': 10,
    },
    mapSize: [ 1024 , 1024 ],
    near: 0.5,
    params: (c,i) => [ c , i ],
    position: [ -2 , 0.5 , -2 ],
  },
  spotLight: {
    far: 7,
    helper: { visible: false },
    mapSize: [ 1024 , 1024 ],
    near: 1,
    params: [ 0xae00ff , 40 , 10 , Math.PI*0.3 ],
    position: [ 0 , 2 , 4 ],
  },
}

export const list = (
  lesson == '15-baked' ?
    [
      'ambient',
      'directional',
    ]
  : lesson == '15-native' ?
    [
      'ambient',
      'directional',
      'point',
      'spot',
    ]
  : lesson == '15-simple' ?
    [
      'ambient',
      'directional',
    ]
  : // Base
    [
      'ambient',
      'directional',
      // 'rectarea',
    ]
)

export const resetSettings = {
  activations: [],
  controller: {

    ambientLightColor: null,
    ambientLightIntensity: null,

    directionalLightColor: null,
    directionalLightIntensity: null,
    directionalLightHelper: null,

    hemisphereLightColor: null,
    hemisphereLightGroundColor: null,
    hemisphereLightIntensity: null,
    hemisphereLightX: null,
    hemisphereLightY: null,
    hemisphereLightZ: null,

    rectAreaLightColor: null,
    rectAreaLightIntensity: null,
    rectAreaLightH: null,
    rectAreaLightW: null,
    rectAreaLightX: null,
    rectAreaLightY: null,
    rectAreaLightZ: null,

    pointLightColor: null,
    pointLightHelper: null,
    pointLightIntensity: null,
    pointLightX: null,
    pointLightY: null,
    pointLightZ: null,

    spotLightColor: null,
    spotLightIntensity: null,
    spotLightHelper: null,

  },
  folder: {
    ambient: null,
    directional: null,
    hemisphere: null,
    rectarea: null,
    point: null,
    spot: null,
  },
  light: Object.fromEntries(lightsNames.map(name => [ `${name}Light` , null ])),
}