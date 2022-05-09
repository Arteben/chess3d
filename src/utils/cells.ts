
import * as THREE from 'three'
import { BoardSizes, BoardCellSizes, pos3d, verticalRow } from '@/types/common'

interface fieldCell {
  i: string
  j: number
  // cross: THREE.Mesh
  border: THREE.Mesh
}

export class Cells {

  boardCellCenters: BoardCellSizes

  field: fieldCell[]

  constructor(_sizes: BoardSizes) {

    const onePr = Math.abs(_sizes.endField.x - _sizes.beginField.x)/_sizes.prWidth
    const cellWidth = ((_sizes.prEnd - _sizes.prBegin)/_sizes.cellCountLine) * onePr

    const getCenterCell = (_idx) => {
      return (_sizes.prBegin * onePr) + (cellWidth * (_idx + 0.5))
    }

    const frameMaterial = new THREE.MeshBasicMaterial({
      color: 0xffdd55,
      wireframe: true,
      wireframeLinewidth: 5,
      // side: THREE.BackSide,
    })

    const frameGeometry = new THREE.PlaneGeometry(cellWidth, cellWidth, 2, 2).rotateX(Math.PI/2)

    const getSelectFrame = (_pos: pos3d) => {
      const frame = new THREE.Mesh(frameGeometry, frameMaterial)
      frame.position.set(_pos.x, _pos.y - 4, _pos.z)
      return frame
    }

    this.field = []

    this.boardCellCenters = {}
    _sizes.horsLine.forEach((_el, _idx) => {
      const rowCells: verticalRow = {}
      for (let i = 0; i < _sizes.cellCountLine; i++) {
        const cellCenter = <pos3d>{
          x: getCenterCell(_idx),
          y: _sizes.height,
          z: getCenterCell(i),
        }

        rowCells[i + 1] = cellCenter

        this.field.push({
          i: _el,
          j: i + 1,
          border: getSelectFrame(cellCenter),
        })
      }
      this.boardCellCenters[_el] = rowCells
    })
  }
}
