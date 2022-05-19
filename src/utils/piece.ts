
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as pieces from '@/utils/pieces-index'
import { pos2d, pieces as piecesType, cellCoords } from '@/types/common'
import { Cells } from '@/utils/cells'
import { getCoordsStr, hasUpperCase } from '@/utils/usefull'
interface pieceColors {
  color: THREE.ColorRepresentation
  emissive: THREE.ColorRepresentation
}

enum shortPieceBlackNames {
  'p' = 'pawn',
  'n' = 'horse',
  'b' = 'elephant',
  'r' = 'rook',
  'q' = 'queen',
  'k' = 'king'
}

export class Piece {

  piece: THREE.Mesh
  isWhite: boolean
  type: string
  startPosition: pos2d
  startCoords: cellCoords

  setPosition(_position: pos2d) {
    this.piece.position.setX(_position.x)
    this.piece.position.setZ(_position.z)
  }

  static createPieces(_pieceSet: piecesType,
                      _scene: THREE.Scene,
                      _cells: Cells,
                      _render: () => void) {

    return new Promise((_resolve) => {
      let piecesCount = Object.keys(_pieceSet).length
      const pieces: Piece[] = []
      const resolveCreate = (_piece: Piece) => {
        _piece.setPosition({x: _piece.startPosition.x, z: _piece.startPosition.z})
        _scene.add(_piece.piece)
        pieces.push(_piece)
        piecesCount--
        if (piecesCount === 0) {
          _render()
          _resolve(pieces)
        }
      }

      for (const [strCoords, typePiece] of Object.entries(_pieceSet)) {
        const isWhite = hasUpperCase(typePiece)
        const type = shortPieceBlackNames[String(typePiece).toLowerCase()]
        const coords = getCoordsStr(strCoords)
        const cell = _cells.field[coords.i][coords.j]
        const startPosition = {x: cell.center.x, z: cell.center.z}
        const piece = new Piece(resolveCreate, type, startPosition, coords, isWhite)
        cell.piece = piece
      }
    })
  }

  static reSetPieces (_pieces: Piece[], _cells: Cells) {
    _cells.removePieces()
    let coords: cellCoords
    for (const piece of _pieces) {
      coords = piece.startCoords
      _cells.field[coords.i][coords.j].piece = piece
      piece.setPosition(piece.startPosition)
    }
  }

  constructor (_resolve: (_p: Piece) => void,
              _gltfName: string,
              _startPosition: pos2d,
              _startCoords: cellCoords,
              _isWhite?: boolean,
            ) {

    this.isWhite = Boolean(_isWhite)
    this.type = _gltfName
    this.startPosition = _startPosition
    this.startCoords = _startCoords

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
      _resolve(this)
    })
  }
}
