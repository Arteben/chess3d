
import * as THREE from 'three'
import { Piece } from '@/utils/piece'
import { Board } from '@/utils/board'

export class ChessField {
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {

    this.camera = new THREE.PerspectiveCamera(10, _innerWidth/_innerHeight, 1, 10000)
    this.camera.position.set(700, 2100, 0)
    this.camera.lookAt(250, 250, 0)
    this.camera.rotateZ(Math.PI/2)

    this.camera.position.z = 810
    this.camera.rotateX(Math.PI * 1.87)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x333)

    const light = new THREE.AmbientLight(0x888888)
    this.scene.add(light)
    const spotLight = new THREE.SpotLight(0xffffff, 1.3)
    spotLight.position.set( 0, 0, 10000)
    this.scene.add(spotLight)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(_innerWidth, _innerHeight)
    _el.appendChild(this.renderer.domElement)

    const renderer = (_piece: THREE.Mesh) => {
      this.scene.add(_piece)
      this.renderer.render(this.scene, this.camera)
    }

    // add chess field
    new Board(renderer)

    const addNewPiece = (x: number, y:number, _type: string, _isWhite?: boolean) => {
      const pos = {x, y}
        new Piece(renderer, _type, pos, _isWhite)
    }

    addNewPiece(70, 70, 'pawn', true)
    addNewPiece(430, 430, 'pawn')
    addNewPiece(300, 300, 'horse', true)
    addNewPiece(100, 400, 'rook', true)
    addNewPiece(320, 140, 'rook', )
  }
}
