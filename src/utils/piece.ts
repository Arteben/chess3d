
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as pieces from '@/utils/pieces-index'
import {
  pos2d,
  pieces as piecesType,
  cellCoords,
} from '@/types/common'
import { Cells } from '@/utils/cells'
import { getCoordsStr, importPiece } from '@/utils/usefull'
interface pieceColors {
  color: THREE.ColorRepresentation
  emissive: THREE.ColorRepresentation
}

export class Piece {

  piece: THREE.Mesh
  isWhite: boolean
  type: string
  symType: string
  startPosition: pos2d
  fieldScene: THREE.Scene
  startCoords?: cellCoords

  geometry: THREE.BufferGeometry
  texture: THREE.MeshStandardMaterial

  setPosition(_position: pos2d) {
    this.piece.position.setX(_position.x)
    this.piece.position.setZ(_position.z)
  }

  setStartCoords (_startCoords: cellCoords) {
    this.startCoords = _startCoords
  }

  removePiece () {
    this.geometry.dispose()
    this.texture.dispose()
    this.fieldScene.remove(this.piece)
  }

  static createPieces(_pieceSet: piecesType,
                      _scene: THREE.Scene,
                      _cells: Cells,
                      _render: () => void) {

    return new Promise((_resolve) => {
      let piecesCount = Object.keys(_pieceSet).length
      const pieces: Piece[] = []
      const resolveCreate = (_piece: Piece) => {
        pieces.push(_piece)
        piecesCount--
        if (piecesCount === 0) {
          _render()
          _resolve(pieces)
        }
      }

      for (const [strCoords, typePiece] of Object.entries(_pieceSet)) {
        const pieceInfo = importPiece(typePiece)
        const isWhite = pieceInfo.isWhite
        const type = pieceInfo.type
        const coords = getCoordsStr(strCoords)
        const cell = _cells.field[coords.i][coords.j]
        const startPosition = {x: cell.center.x, z: cell.center.z}
        const piece = new Piece(resolveCreate, type, typePiece, startPosition, _scene, isWhite)
        piece.setStartCoords(coords)
        cell.piece = piece
      }
    })
  }

  static reSetPieces (_pieces: Piece[], _cells: Cells) {
    _cells.removePieces()
    let coords: cellCoords
    for (const piece of _pieces) {
      if (piece.startCoords) {
        coords = piece.startCoords
        _cells.field[coords.i][coords.j].piece = piece
        piece.setPosition(piece.startPosition)
      }
    }
  }

  constructor (_resolve: (_p: Piece) => void,
              _gltfName: string,
              _symType: string,
              _startPosition: pos2d,
              _scene: THREE.Scene,
              _isWhite?: boolean,
            ) {

    this.isWhite = Boolean(_isWhite)
    this.type = _gltfName
    this.symType = _symType
    this.startPosition = _startPosition
    this.fieldScene = _scene

    let colors: pieceColors = { color: 0x66AA77, emissive: 0x000000 }
    if (_isWhite) {
      colors = { color: 0x999977, emissive: 0x555555 }
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.color),
      emissive : new THREE.Color(colors.emissive),
      metalness: 0.4,
      roughness: 0.9,
    })

    const getPieceGeometry = async function () {
      const loadPiece = function () {
        return new Promise<GLTF>((resolve) => {
          new GLTFLoader().load(pieces[_gltfName], resolve)
        })
      }

      const pieceGeometry = await loadPiece().then((_chip)=> {
        const mesh = <THREE.Mesh>_chip.scene.children[3]
        const geometry = mesh.geometry.clone()
        const scaleLevel = 6
        geometry.scale(scaleLevel, scaleLevel, scaleLevel)
        geometry.translate(0, -10, 0)
        return geometry
      })

      return Promise.resolve(pieceGeometry)
    }

    getPieceGeometry().then((_pieceGeometry) => {
      this.piece = new THREE.Mesh(_pieceGeometry, material)
      this.geometry = _pieceGeometry
      this.texture = material
      this.setPosition({x: this.startPosition.x, z: this.startPosition.z})
      this.fieldScene.add(this.piece)
      _resolve(this)
    })
  }
}
