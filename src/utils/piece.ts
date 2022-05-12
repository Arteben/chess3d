
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as pieces from '@/utils/pieces-index'
import { pos2d } from '@/types/common'
interface pieceColors {
  color: THREE.ColorRepresentation
  emissive: THREE.ColorRepresentation
}

export class Piece {

  piece: THREE.Mesh
  isWhite: boolean
  type: string

  setPosition(_position: pos2d) {
    this.piece.position.setX(_position.x)
    this.piece.position.setZ(_position.z)
  }

  static createPieceSets(_scene: THREE.Scene) {
    return new Promise((_resolve) => {
      let piecesCount = 32
      const pieces: Piece[] = []

      const resolveCreate = (_piece: Piece) => {
        _scene.add(_piece.piece)
        piecesCount--
        pieces.push(_piece)
        if (piecesCount === 0) {
          _resolve(pieces)
        }
      }

      const getPieses = (_type: string, _isWhite: boolean, _count = 2) => {
        for (let i = 0; i < _count; i++) {
          new Piece(resolveCreate, _type, _isWhite)
        }
      }

      const getPlayerSet = (_isWhite) => {
        getPieses('pawn', _isWhite, 8)
        getPieses('horse', _isWhite)
        getPieses('elephant', _isWhite)
        getPieses('rook', _isWhite)
        new Piece(resolveCreate, 'king', _isWhite)
        new Piece(resolveCreate, 'queen', _isWhite)
      }

      getPlayerSet(true)
      getPlayerSet(false)
    })
  }

  constructor (_resolve: (_p: Piece) => void,
              _gltfName: string,
              _isWhite?: boolean,
            ) {

    this.isWhite = Boolean(_isWhite)
    this.type = _gltfName

    let colors: pieceColors = { color: 0x224444, emissive: 0x101010 }
    if (_isWhite) {
      colors = { color: 0xaaaa88, emissive: 0x555555 }
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
