import * as THREE from 'three'
import {
  BoardSizesType,
  fieldCellsType,
  pos3d,
  verticalRow,
  coordsMesh,
  cellCoords,
  pos2d,
} from '@/types/common'
import { getMeshCoords } from '@/utils/usefull'
import { ChessEngine } from '@/utils/chess-engine'
import { Piece } from './piece'

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

  stockElements = 'X'
  stockNumber = 0

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
    const coutLineElements = this.fieldMainLines.length
    for (const el of line) {
      for (let i = 0; i < coutLineElements; i++) {
        this.field[el][i + 1].piece = undefined
      }
    }

    for (let i = 0; i < coutLineElements * 4; i++) {
      this.field[this.stockElements][i].piece = undefined
    }
  }

  addToStock (_piece: Piece) {
    const current = this.field[this.stockElements][this.stockNumber]
    this.stockNumber++
    current.piece = _piece
    return <pos2d>{
      x: current.center.x,
      z: current.center.z,
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

    const mainLinesCount = this.fieldMainLines.length

    this.fieldMainLines.forEach((_el, _idx) => {
      const rowCells: verticalRow = {}
      for (let i = 0; i < mainLinesCount; i++) {
        const cellCenter = <pos3d>{
          x: getCenterCell(_idx),
          y: _sizes.height,
          z: getCenterCell(mainLinesCount - i - 1),
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

    const getStockCenter = (_num: number) => {
      const pos = <pos3d>{x: 0, y: _sizes.height, z: 0}
      const cornerSize = cellWidth + 50

      const addCellWidth = _num =>
            cornerSize + (_num) * (cellWidth + 0.5) - 10

      if (mainLinesCount > _num) {
        pos.x = cellWidth * 0.6
        pos.z = addCellWidth(_num)
      } else if (mainLinesCount * 2 > _num) {
        pos.z = cellWidth * 0.6
        pos.x = addCellWidth(_num - mainLinesCount)
      } else if (mainLinesCount * 3 > _num) {
        pos.x = cellWidth * (mainLinesCount + 2.4)
        pos.z = 500 - addCellWidth(_num - mainLinesCount * 2)
      } else {
        pos.z = cellWidth * (mainLinesCount + 2.4)
        pos.x = 500 - addCellWidth(_num - mainLinesCount * 3)
      }

      return pos
    }

    const stockCells: verticalRow = {}
    for (let i = 0; i < 4 * mainLinesCount; i++) {
      const cellStockCenter = getStockCenter(i)
      const sign = getSignMesh(cellStockCenter)
      const frame = getFrameMesh(cellStockCenter)
      frame.iCoord = this.stockElements
      frame.jCoord = i

      stockCells[frame.jCoord] = {
        center: cellStockCenter,
        sign,
        frame,
      }
    }

    this.field[this.stockElements] = stockCells
  }
}
