
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
  setNewPosition(_newPos: pos2d) {
    this.piece.position.x = _newPos.x
    this.piece.position.z = _newPos.y
  }

  constructor (_renderer: (p: THREE.Mesh) => void,
              _gltfName: string,
              _pos: pos2d,
              _isWhite?: boolean,
            ) {

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
      this.piece.position.setX(_pos.x)
      this.piece.position.setZ(_pos.y)
      _renderer(this.piece)
    })
  }
}
