
import * as THREE from 'three'

export class ChessField {
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  box: THREE.Mesh

  setBackground() {
    this.scene.background = new THREE.Color(0x112211)
  }

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {
    this.camera = new THREE.PerspectiveCamera(70, _innerWidth / _innerHeight, 0.01, 10)
    this.camera.position.z = 1

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x222)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(_innerWidth, _innerHeight)
    _el.appendChild(this.renderer.domElement)



    //simple box for waiting
    const geometryBox = new THREE.BoxGeometry(0.1, 0.1, 0.1,2)
    const materialBox = new THREE.MeshNormalMaterial()
    this.box = new THREE.Mesh(geometryBox, materialBox)
    this.scene.add(this.box)
    this.renderer.setAnimationLoop((time) => {
      this.box.rotation.x = time / 2040
      this.box.rotation.y = time / 500
      this.renderer.render(this.scene, this.camera)
    })
  }
}
