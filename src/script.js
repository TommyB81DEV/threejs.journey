import * as THREE from 'three'

// INIT
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Constants
const sizes = { height: 600, width: 800 }

// Objects
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x3bcb03ff })
)

// Groups
const cubes = new THREE.Group()
cubes.add(cube1)
cubes.add(cube2)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4

// Helpers
const axesHelper = new THREE.AxesHelper()

// Tranformations
cube1.position.set( -1 , 1 , 1 )
cube1.rotation.set( -1 , 0 , 0 )
cube2.position.set(1.5, 0.5, 1)
cube2.rotation.set(-1, 0, 0)
cubes.rotation.x = -1

// Scene
scene.add(axesHelper)
scene.add(camera)
scene.add(cubes)

// Render
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene,camera)