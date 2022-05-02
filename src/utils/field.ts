
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import bishopChip from '@/assets/pieces/Bishop.gltf'

export class ChessField {
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh

  setBackground() {
    // this.scene.background =  new THREE.TextureLoader().load(fall)
  }

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {
    // this.camera = new THREE.PerspectiveCamera(10, _innerWidth / _innerHeight, 0.01, 10)
    // this.camera.position.z = 2.5
    // this.camera.position.y = -5.5
    // this.camera.rotateX(1.2)
    this.camera = new THREE.PerspectiveCamera(10, _innerWidth / _innerHeight, 0.01, 700)
    this.camera.position.z = 700
    this.camera.position.x = 0
    this.camera.position.y = -40
    this.camera.rotateX(0.1)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x555)
    // this.scene.background = new THREE.Color(0x222)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(_innerWidth, _innerHeight)
    _el.appendChild(this.renderer.domElement)

    const gltfLoader = new GLTFLoader()
    gltfLoader.load(bishopChip, (_chip) => {
      this.scene.add(_chip.scene)
    }, undefined, (_error) => {
      console.log('a loader error', _error)
    })


    //simple box for waiting
    const geometryBox = new THREE.BoxGeometry(2, 2, 0.05)
    const materialBox = new THREE.MeshNormalMaterial()
    this.chessTable = new THREE.Mesh(geometryBox, materialBox)
    this.scene.add(this.chessTable)
    this.renderer.setAnimationLoop((time) => {
      this.chessTable.rotation.z = time / 100000
      this.renderer.render(this.scene, this.camera)
    })
  }
}
