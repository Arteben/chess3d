
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Piece } from '@/utils/piece'
import { Board } from '@/utils/board'
import { Cells } from '@/utils/cells'
import { pos2d, BoardSizesType, coordsMesh } from '@/types/common'
import { ChessEngine } from '@/utils/chess-engine'

export class ChessField {
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh
  cam: THREE.Camera
  controls: OrbitControls
  render () {
    this.renderer.render(this.scene, this.cam)
  }

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
      this.render()
    })

    const beginField = <pos2d>{x: 0, z: 0}
    const endField =  <pos2d>{x: 500, z: 500}
    const horsLine = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
    const boardSizes: BoardSizesType = {
      prWidth: 1000,
      prBegin: 135,
      prEnd: 865,
      beginField,
      endField,
      height: 0,
      horsLine,
      cellCountLine: 8,
    }

    // add chess field
    new Board((_board: THREE.Mesh) => {
      this.scene.add(_board)
    })


    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const cells = new Cells(boardSizes, this.scene, () => { this.render() })
    const engine = new ChessEngine(cells)


    _el.onmousemove = (_event) => {
      engine.onSelectCell()
      if (engine.interCells.length > 0) {
        pointer.set((_event.clientX / _innerWidth) * 2 - 1, - (_event.clientY / _innerHeight) * 2 + 1)
        raycaster.setFromCamera(pointer, this.cam)
        const intersects = raycaster.intersectObjects(engine.interCells, false)
        cells.hideAllowedCells(engine.interCells)
        if (intersects.length > 0) {
          const object = <coordsMesh>intersects[0].object
          engine.onSelectCell(object.iCoord, object.jCoord)
        }
      }
    }

    _el.onclick = () => {
      engine.onClickEvent()
    }

    const pieceSets = engine.getConf().pieces

    Piece.createPieces(pieceSets, this.scene, cells, () => {
      this.render()
    }).then(() => {
      engine.start()
    })
  }
}
