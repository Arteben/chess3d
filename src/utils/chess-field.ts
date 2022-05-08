
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Piece } from '@/utils/piece'
import { Board } from '@/utils/board'

export class ChessField {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh
  cam: THREE.Camera
  controls: OrbitControls

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x333)

    const light = new THREE.AmbientLight(0x555555)
    this.scene.add(light)
    const spotLight = new THREE.SpotLight(0xffffff, 1.3)
    spotLight.position.set( 0, 10000, 0)
    this.scene.add(spotLight)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(_innerWidth, _innerHeight)
    _el.appendChild(this.renderer.domElement)

    const aspect = _innerWidth/_innerHeight
    this.cam = new THREE.PerspectiveCamera(16, aspect, 1, 10000)
    this.controls = new OrbitControls(this.cam, this.renderer.domElement)
    this.controls.target = new THREE.Vector3(250, 10, 250)
    // if (_white)
    this.cam.position.set(1200, 650, 0)
    this.controls.update()
    this.controls.maxPolarAngle = Math.PI/3
    this.controls.minPolarAngle = Math.PI/6
    this.controls.maxDistance = 1500
    this.controls.minDistance = 1000

    this.controls.addEventListener('change', () => {
      this.renderer.render( this.scene, this.cam )
    })

    const render = (_piece: THREE.Mesh) => {
      this.scene.add(_piece)
      this.renderer.render(this.scene, this.cam)
    }

    // add chess field
    new Board(render)

    const addNewPiece = (x: number, y:number, _type: string, _isWhite?: boolean) => {
      const pos = {x, y}
        new Piece(render, _type, pos, _isWhite)
    }

    addNewPiece(70, 70, 'pawn', true)
    addNewPiece(430, 430, 'pawn')
    addNewPiece(300, 300, 'horse', true)
    addNewPiece(100, 400, 'rook', true)
    addNewPiece(320, 140, 'rook')
  }
}
