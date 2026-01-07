import * as THREE from 'three'

const perspective = new THREE.PerspectiveCamera()

const perspectiveDefault = {
  far: perspective.far,
  near: perspective.near,
}

export const camera = {
  default: {
    perspective: perspectiveDefault,
  },
}