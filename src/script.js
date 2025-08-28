import * as THREE from 'three'
import gsap from 'gsap'

// INIT
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Constants
const sizes = { height: 600, width: 800 }

// Objects
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x3bcb03ff })
)

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
      camera.position.set(2,2,2)
      camera.lookAt(mesh.position)

// Helpers
const axesHelper = new THREE.AxesHelper()

// Scene
scene.add(axesHelper)
scene.add(camera)
scene.add(mesh)

// Render
const renderer = new THREE.WebGLRenderer({ canvas })
      renderer.setSize(sizes.width, sizes.height)

// Time
const clock = new THREE.Clock()

// Animate
function animate() {

    // Time
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    mesh.rotation.y = elapsedTime

    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)

} animate()