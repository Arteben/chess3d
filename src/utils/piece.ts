
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as pieces from '@/utils/pieces-index'
import { pos2d, pieces as piecesType } from '@/types/common'
import { Cells } from '@/utils/cells'
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

  setPosition(_position: pos2d) {
    this.piece.position.setX(_position.x)
    this.piece.position.setZ(_position.z)
  }

  static createPieces(_pieceSet: piecesType,
                      _scene: THREE.Scene,
                      _cells: Cells,
                      _render: () => void) {

    const hasUpperCase = (_str: string) => {
      return String(_str).toUpperCase() == _str
    }

    return new Promise((_resolve) => {
      let piecesCount = Object.keys(_pieceSet).length
      const resolveCreate = (_piece: Piece) => {
        _piece.setPosition({x: _piece.startPosition.x, z: _piece.startPosition.z})
        _scene.add(_piece.piece)
        piecesCount--
        if (piecesCount === 0) {
          _render()
          _resolve('ok')
        }
      }

      for (const [strCoords, typePiece] of Object.entries(_pieceSet)) {
        const isWhite = hasUpperCase(typePiece)
        const type = shortPieceBlackNames[String(typePiece).toLowerCase()]
        const cell = _cells.field[strCoords[0]][Number(strCoords[1])]
        const startPosition = {x: cell.center.x, z: cell.center.z}
        const piece = new Piece(resolveCreate, type, startPosition, isWhite)
        cell.piece = piece
      }
    })
  }

  constructor (_resolve: (_p: Piece) => void,
              _gltfName: string,
              _startPosition: pos2d,
              _isWhite?: boolean,
            ) {

    this.isWhite = Boolean(_isWhite)
    this.type = _gltfName
    this.startPosition = _startPosition

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
