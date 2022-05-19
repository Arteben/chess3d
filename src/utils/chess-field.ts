
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Piece } from '@/utils/piece'
import { Board } from '@/utils/board'
import { Cells } from '@/utils/cells'
import { pos2d, BoardSizesType } from '@/types/common'
import { ChessEngine } from '@/utils/chess-engine'

export class ChessField {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh
  cam: THREE.Camera
  engine: ChessEngine
  controls: OrbitControls
  canvas: HTMLElement
  canvasW: number
  canvasH: number

  isFieldReady = false
  isHasStartedGame = false

  pieces: Piece[]
  cells: Cells

  setEngineEvents () {
    const engine = this.engine
    this.canvas.onmousemove = (_ev) => {
      engine.onMoveEvents(_ev)
    }
    this.canvas.onclick = () => {
      engine.onClickEvent()
    }
  }

  setPlayerCam (_type: string) {
    switch (_type) {
      case 'white':
        this.cam.position.set(250, 650, 1100)
        break
      case 'black':
        this.cam.position.set(250, 650, -850)
    }
    this.controls.update()
  }

  render () {
    this.renderer.render(this.scene, this.cam)
  }

  startNewGame (_type: string) {
    if (this.isFieldReady) {
      if (this.isHasStartedGame) {
        Piece.reSetPieces(this.pieces, this.cells)
        this.engine.start(_type, true)
      } else {
        this.isHasStartedGame = true
        this.controls.autoRotate = false
        this.setEngineEvents()
        this.engine.start(_type)
      }

      this.setPlayerCam(_type)
    }
  }

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {
    this.canvas = _el
    this.canvasW = _innerWidth
    this.canvasH = _innerHeight

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x333)

    const light = new THREE.AmbientLight(0x555555)
    this.scene.add(light)
    const spotLight = new THREE.SpotLight(0xffffff, 1.3)
    spotLight.position.set( 0, 10000, 0)
    this.scene.add(spotLight)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.canvasW, this.canvasH)
    _el.appendChild(this.renderer.domElement)

    const aspect = this.canvasW/this.canvasH
    this.cam = new THREE.PerspectiveCamera(15, aspect, 1, 5000)
    this.controls = new OrbitControls(this.cam, this.renderer.domElement)
    this.controls.target = new THREE.Vector3(250, 10, 250)
    // if (_white)
    this.cam.position.set(1400, 650, 250)
    this.controls.update()

    this.controls.autoRotateSpeed = 1
    this.controls.autoRotate = true

    const animateSpin = () => {
      if (this.controls.autoRotate) {
        window.requestAnimationFrame(animateSpin)
        this.controls.update()
        this.render()
      }
    }

    animateSpin()

    this.controls.maxPolarAngle = Math.PI/3
    this.controls.minPolarAngle = Math.PI/6
    this.controls.maxDistance = 2000
    this.controls.minDistance = 1000

    this.controls.addEventListener('change', () => {
      this.render()
    })

    const beginField = <pos2d>{x: 0, z: 0}
    const endField =  <pos2d>{x: 500, z: 500}
    const mainLines = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
    const boardSizes: BoardSizesType = {
      prWidth: 1000,
      prBegin: 135,
      prEnd: 865,
      beginField,
      endField,
      height: 0,
      mainLines,
    }

    // add chess field
    new Board((_board: THREE.Mesh) => {
      this.scene.add(_board)
      this.render()
    })

    this.cells = new Cells(boardSizes, this.scene, () => { this.render() })
    this.engine = new ChessEngine(this, this.cells)

    const pieceSets = this.engine.getConf().pieces

    Piece.createPieces(pieceSets, this.scene, this.cells, () => {
      this.render()
    }).then((_pieces: Piece[]) => {
      this.pieces = _pieces
      this.isFieldReady = true
    })
  }
}
