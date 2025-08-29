import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// INIT
const canvas = document.querySelector('canvas.webgl')
const scene = new THREE.Scene()

// Constants
const animation = true
const cursor = { x: 0, y: 0 }
const customCameraControl = true
const sizes = { height: 600, width: 800 }
const wireframe = true

// Vars
let controls = null

// Objects
const cube = (new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x3bcb03ff, wireframe })
))

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height , 0.1 , 100)
      camera.position.x = 2
      camera.position.y = 2
      camera.position.z = 2
      camera.lookAt(cube.position)

// Controls
if (!customCameraControl) {
  controls = new OrbitControls( camera , canvas )
  controls.enableDamping = true
}

// Helpers
const axesHelper = new THREE.AxesHelper()

// Render
const renderer = (new THREE.WebGLRenderer({ canvas }))
      renderer.setSize(sizes.width, sizes.height)

// Scene
scene.add(axesHelper)
scene.add(camera)
scene.add(cube)

// Cursor
window.addEventListener("mousemove", e => {
  cursor.x = ( e.clientX / sizes.width ) - 0.5
  cursor.y = -( e.clientY / sizes.height - 0.5)
})

// Animate
function animate() {

    if (customCameraControl) {
      camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 5
      camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 5
      camera.position.y = cursor.y * 5
      camera.lookAt(cube.position)
    }

    else controls.update()

    renderer.render(scene, camera)
    if (animation) window.requestAnimationFrame(animate)

} animate()