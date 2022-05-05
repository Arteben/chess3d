
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface posPiece {
  x: number
  y: number
}

interface pieceColors {
  color: THREE.ColorRepresentation
  emissive: THREE.ColorRepresentation
}

export class Piece {

  piece: THREE.Mesh

  constructor (_renderer: (p: THREE.Mesh) => void,
              _gltfPath: string,
              _pos: posPiece,
              _isWhite?: boolean,
            ) {

    let colors: pieceColors = { color: 0x335555, emissive: 0x000000 }
    if (_isWhite) {
      colors = { color: 0xdddd99, emissive: 0x333333 }
    }

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(colors.color),
      emissive : new THREE.Color(colors.emissive),
      metalness: 0.4,
      roughness: 0.1,
    })

    const getPieceGeometry = async function () {

      const loadPiece = function () {
        return new Promise<GLTF>((resolve) => {
          new GLTFLoader().load(_gltfPath, resolve)
        })
      }

      const pieceGeometry = await loadPiece().then((_chip)=> {
        console.log('mesh', _chip)
        const mesh = <THREE.Mesh>_chip.scene.children[3]
        const geometry = mesh.geometry.clone()
        const scaleLevel = 10
        geometry.scale(scaleLevel, scaleLevel, scaleLevel)
        geometry.rotateX(Math.PI/2)
        geometry.translate(0, 0, -10)
        return geometry
      })

      return Promise.resolve(pieceGeometry)
    }

    getPieceGeometry().then((_pieceGeometry) => {
      this.piece = new THREE.Mesh(_pieceGeometry, material)
      this.piece.position.setX(_pos.x)
      this.piece.position.setY(_pos.y)
      _renderer(this.piece)
    })
  }
}
