export const useNativeShadows = true
export const useBakedShadows = useNativeShadows ? false : false
export const useSimpleShadow = useNativeShadows ? false : false

export const defaultSettings = {
  ambientLight: {
    params: [ 0xffffff , 0.5 ],
  },
  directionalLight: {
    amplitude: [ 8 , 8 , -8 , - 8],
    far: 20,
    helper: { visible: false },
    mapSize: [ 256 , 256 ],
    near: 1,
    params: [ 0x86cdff , 1.5 ],
    position: [ 3 , 2 , -8 ],
  },
  hemisphereLight: {
    params: [0xff0000, 0x0000ff, 0.3],
    position: [1, 0.25, 0],
  },
  rectAreaLight: {
    params: [ 0xffffff , 2 , 1 , 1 ],
    position: [0, 0, 3],
  },
  pointLight: {
    far: 10,
    helper: { visible: false },
    mapSize: [ 1024 , 1024 ],
    near: 0.5,
    params: [ 0xff00ff , 5 ],
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

export const list = [
  'ambient',
  'directional',
  // 'hemisphere',
  // 'point',
  // 'rectarea',
  // 'spot',
]

export const reset = {
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
  light: Object.fromEntries(list.map(name => [ `${name}Light` , null ])),
  list,
}