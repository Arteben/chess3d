import * as THREE from 'three'
import {
  BoardSizesType,
  fieldCellsType,
  pos3d,
  verticalRow,
  coordsMesh,
  cellCoords,
} from '@/types/common'
import { getMeshCoords } from '@/utils/usefull'
import { ChessEngine } from '@/utils/chess-engine'

type cellColorsType = {
  selected: THREE.Color
  available: THREE.Color
  captured: THREE.Color
}

const cellColors: cellColorsType = {
  selected: new THREE.Color(0xffdd55),
  available: new THREE.Color(0xFFFFF),
  captured: new THREE.Color(0x66FF66),
}
export class Cells {

  field: fieldCellsType = {}
  fieldMainLines: string[]

  render: () => void

  getCell(_coords: cellCoords) {
    return this.field[_coords.i][_coords.j]
  }

  selectCell (_coords: cellCoords,
              _type: keyof cellColorsType,
              _isRender = true ) {
    const mesh = Cells.getMesh(_coords, this.field)
    mesh.visible = true
    const material = <THREE.MeshBasicMaterial>mesh.material
    material.color = new THREE.Color(cellColors[_type])
    if (_isRender) {
      this.render()
    }
  }

  hideCell (_coords: cellCoords, _isRender = true) {
    const mesh = Cells.getMesh(_coords, this.field)
    mesh.visible = false

    if (_isRender) {
      this.render()
    }
  }

  hideAllowedCells ( _game: ChessEngine) {

    _game.interCells.forEach((_el: coordsMesh) => {
      this.hideCell(getMeshCoords(_el), false)
    })

    if (_game.selectedCell) {
      this.hideCell(_game.selectedCell, false)
      _game.selectedCell = null
    }

    _game.lightedCells.forEach((_el) => {
      this.selectCell(getMeshCoords(_el), 'available', false)
    })

    if(_game.cupturedCell) {
      this.selectCell(_game.cupturedCell, 'captured', false)
    }

    this.render()
  }

  removePieces () {
    const line = this.fieldMainLines
    for (const el of line) {
      for (let i = 0; i < this.fieldMainLines.length; i++) {
        this.field[el][i + 1].piece = undefined
      }
    }
  }

  static getMesh(_coords: cellCoords, _field: fieldCellsType) {
    return <THREE.Mesh>_field[_coords.i][_coords.j].sign
  }

  constructor(_sizes: BoardSizesType, _scene: THREE.Scene, _render: ()=> void) {
    this.render = _render
    this.fieldMainLines = _sizes.mainLines

    const onePr = Math.abs(_sizes.endField.x - _sizes.beginField.x)/_sizes.prWidth
    const cellWidth = ((_sizes.prEnd - _sizes.prBegin)/this.fieldMainLines.length) * onePr

    const getCenterCell = (_idx) => {
      return (_sizes.prBegin * onePr) + (cellWidth * (_idx + 0.5))
    }


    const signCellWidth = cellWidth - 5
    const signGeometry = new THREE.PlaneGeometry(signCellWidth, signCellWidth, 2, 2)
    signGeometry.rotateX(Math.PI/2)
    signGeometry.translate(0, -9, 0)

    const getSignMesh = (_pos: pos3d) => {
      const signMaterial = new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
      })

      const sign = new THREE.Mesh(signGeometry, signMaterial)
      sign.position.set(_pos.x, _pos.y, _pos.z)
      sign.visible = false
      _scene.add(sign)
      return sign
    }

    const frameMaterial = new THREE.MeshBasicMaterial({side: THREE.BackSide, visible: false})

    const getFrameMesh = (_pos: pos3d) => {
      const frame = <coordsMesh>new THREE.Mesh(signGeometry,frameMaterial)
      frame.position.set(_pos.x, _pos.y - 5, _pos.z)
      _scene.add(frame)
      return frame
    }

    this.fieldMainLines.forEach((_el, _idx) => {
      const rowCells: verticalRow = {}
      for (let i = 0; i < this.fieldMainLines.length; i++) {
        const cellCenter = <pos3d>{
          x: getCenterCell(_idx),
          y: _sizes.height,
          z: getCenterCell(this.fieldMainLines.length - i - 1),
        }

        const sign = getSignMesh(cellCenter)
        const frame = getFrameMesh(cellCenter)
        frame.iCoord = _el
        frame.jCoord = i + 1

        rowCells[frame.jCoord] = {
          center: cellCenter,
          sign,
          frame,
        }
      }
      this.field[_el] = rowCells
    })
  }
}
