export const useNativeShadows = true
export const useBakedShadows = useNativeShadows ? false : false
export const useSimpleShadow = useNativeShadows ? false : false

export const defaultSettings = {
  ambientLight: {
    params: [ 0x86cdff , 0.5 ],
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
  doorLight: {
    helper: { visible: true },
    mapSize: [ 1024 , 1024 ],
    params: [ 0xfa5c00 , 2 ],
    position: [ 0 , 2 , 2.5 ],
  },
  fog: {
    base: {
      active: false,
      params: [ 0x05343f , 1 , 13 ],
    },
    exp2: {
      active: true,
      params: [ 0x05343f , 0.1 ],
    },
  },
  ghostLight: {
    active: true,
    clones: [ 
      {
        helper: { visible: false },
        mapSize: [ 1024 , 1024 ],
        params: [ 0x8800ff , 6 ],
        position: [ 0 , 0 , 0 ],
        radius: 4,
        speed: 0.5,
        y: angle => Math.sin( angle * 2.34) * Math.sin( angle * 3.45),
      },
      {
        helper: { visible: false },
        mapSize: [ 1024 , 1024 ],
        params: [ 0xff0088 , 6 ],
        position: [ 0 , 0 , 0 ],
        radius: 6,
        speed: 0.6,
        y: angle => Math.sin( angle * 1.5) * Math.sin( angle * 2.2),
      },
      {
        helper: { visible: false },
        mapSize: [ 1024 , 1024 ],
        params: [ 0xff0000 , 6 ],
        position: [ 0 , 0 , 0 ],
        radius: 6.4,
        speed: 0.3,
        y: angle => Math.sin( angle * 3.2) * Math.sin( angle * 3.1),
      },
      {
        helper: { visible: false },
        mapSize: [ 1024 , 1024 ],
        params: [ 0x37fd00 , 6 ],
        position: [ 0 , 0 , 0 ],
        radius: 5.5,
        speed: 0.8,
        y: angle => Math.sin( angle * 4 ) * Math.sin( angle * 1.8),
      },
    ],
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
  sky: {
    active: true,
    params: {
      mieCoefficient: 0.1,
      mieDirectionalG: 0.95,
      rayleigh: 3,
      sunPosition: [ 0.3 , -0.038 , -0.95 ],
      turbidity: 10,
    },
    scale: [ 100 , 100 , 100 ],
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
  'door',
  'ghosts',
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