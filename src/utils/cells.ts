import * as THREE from 'three'
import { BoardSizesType, fieldCellsType, pos3d, verticalRow, coordsMesh, cellCoards } from '@/types/common'

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
  displayed: coordsMesh[] = []
  render: () => void

  getCell(_coords: cellCoards) {
    return this.field[_coords.i][_coords.j]
  }

  selectCell (_coords: cellCoards, _type: keyof cellColorsType) {
    const mesh = Cells.getMesh(_coords, this.field)
    mesh.visible = true
    const material = <THREE.MeshBasicMaterial>mesh.material
    material.color = new THREE.Color(cellColors[_type])
  }

  hideCell (_coords: cellCoards) {
    const mesh = Cells.getMesh(_coords, this.field)
    mesh.visible = false
  }

  hideAllowedCells () {
    this.displayed.forEach((_el: THREE.Mesh) => {
      const frame = <coordsMesh>_el
      this.hideCell({
        i: <string>frame.iCoord,
        j: <number>frame.jCoord,
      })
    })
  }

  calcSelectedCell(_raycaster: THREE.Raycaster) {
    const intersects = _raycaster.intersectObjects(this.displayed, false )
    this.hideAllowedCells()
    if (intersects.length > 0) {
      const object = <coordsMesh>intersects[0].object
      const coords = { i: <string>object.iCoord, j: <number>object.jCoord }
      this.onSelectCell(coords)
    }
    this.render()
  }

  onSelectCell (_coords: cellCoards) {
    this.selectCell(_coords, 'selected')
  }

  static getMesh(_coords: cellCoards, _field: fieldCellsType) {
    return <THREE.Mesh>_field[_coords.i][_coords.j].sign
  }

  constructor(_sizes: BoardSizesType, _scene: THREE.Scene, _render: () => void) {

    this.render = _render

    const onePr = Math.abs(_sizes.endField.x - _sizes.beginField.x)/_sizes.prWidth
    const cellWidth = ((_sizes.prEnd - _sizes.prBegin)/_sizes.cellCountLine) * onePr

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

        const sign = getSignMesh({...cellCenter})
        const frame = getFrameMesh({...cellCenter, y: _sizes.height - 30})
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
