const defaultObject = {

  // Commons
  color: '#cc17d9',

  // Lights
  ambientLight: {
    params: [ 0xffffff , 1.5 ],
    position: [ 0 , 0 , 5 ],
  },
  directionalLight: {
    params: [ 0x00fffc , 0.9 ],
    position: [ 1 , 0.25 , 0 ],
  },
  hemisphereLight: {
    params: [ 0xff0000 , 0x0000ff, 0.3 ],
    position: [ 1 , 0.25 , 0 ],
  },
  rectAreaLight: {
    params: [ 0x36f900ff , 2 , 1 , 1 ] ,
    position: [ 0 , 0 , 3 ],
  },
  pointLight: {
    params: [ 0xffffff , 50 ],
    position: [ 0 , 0 , 5 ],
  },

  // Animation
  rotationSpeed: 0.1,

}

const debugObject = {
  axesHelper: true,
  color: defaultObject.color,
  customLights: true,
  rotationEnabled: false,
}

const lights = {
  activations: [],
  controller: {

    ambientLight: null,

    directionalLightColor: null,
    directionalLightIntensity: null,

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
    pointLightX: null,
    pointLightY: null,
    pointLightZ: null,

  },
  folder: {
    ambient: null,
    directional: null,
    hemisphere: null,
    rectarea: null,
    point: null,
  },
  light: {
    ambientLight: null,
    directionalLight: null,
    hemisphereLight: null,
    pointLight: null,
    rectAreaLight: null,
  },
}

export {
  defaultObject,
  debugObject,
  lights,
}