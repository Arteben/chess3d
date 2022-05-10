
import * as THREE from 'three'
import { BoardSizesType, fieldCellsType, pos3d, verticalRow, cellCoards } from '@/types/common'

interface selectedCell extends cellCoards {
  // cross: THREE.Mesh
  border: THREE.Mesh
}

type cellColorsType = {
  selected: THREE.Color
  available: THREE.Color
}

const cellColors: cellColorsType = {
  selected: new THREE.Color(0xffdd55),
  available: new THREE.Color(0xFFFFF),
}
export class Cells {

  field: fieldCellsType = {}
  selectedCells: selectedCell[] = []

  getCell(_coords: cellCoards) {
    return this.field[_coords.i][_coords.j]
  }

  selectCell (_coords: cellCoards, _type: keyof cellColorsType) {
    const material = Cells.getMaterial(_coords, this.field)
    material.opacity = 1
    material.color = new THREE.Color(cellColors[_type])
  }

  hideCell (_coords: cellCoards) {
    const material = Cells.getMaterial(_coords, this.field)
    material.opacity = 0
    material.color = new THREE.Color(0x000000)
  }

  static getMaterial(_coords: cellCoards, _field: fieldCellsType) {
    return <THREE.MeshBasicMaterial>_field[_coords.i][_coords.j].select.material
  }

  constructor(_sizes: BoardSizesType, _scene: THREE.Scene) {

    const onePr = Math.abs(_sizes.endField.x - _sizes.beginField.x)/_sizes.prWidth
    const cellWidth = ((_sizes.prEnd - _sizes.prBegin)/_sizes.cellCountLine) * onePr

    const getCenterCell = (_idx) => {
      return (_sizes.prBegin * onePr) + (cellWidth * (_idx + 0.5))
    }

    const selectedCellWidth = cellWidth - 5
    const selectedGeometry = new THREE.PlaneGeometry(selectedCellWidth, selectedCellWidth, 2, 2)
    selectedGeometry.rotateX(Math.PI/2)
    selectedGeometry.translate(0, -9, 0)

    const getSelectedFrame = (_pos: pos3d) => {

      const frameMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.BackSide,
        opacity: 0,
        transparent: true,
        colorWrite: true,
      })

      frameMaterial.needsUpdate = true

      const frame = new THREE.Mesh(selectedGeometry, frameMaterial)
      frame.position.set(_pos.x, _pos.y, _pos.z)
      _scene.add(frame)
      return frame
    }

    _sizes.horsLine.forEach((_el, _idx) => {
      const rowCells: verticalRow = {}
      for (let i = 0; i < _sizes.cellCountLine; i++) {
        const cellCenter = <pos3d>{
          x: getCenterCell(_idx),
          y: _sizes.height,
          z: getCenterCell(_sizes.cellCountLine - i - 1),
        }

        rowCells[i + 1] = {
          center: cellCenter,
          select: getSelectedFrame(cellCenter),
        }
      }
      this.field[_el] = rowCells
    })
  }
}
