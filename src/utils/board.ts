
import * as THREE from 'three'
import board from '@/assets/board.png'

export class Board {
  board: THREE.Mesh

  constructor (_renderer: (a: THREE.Mesh) => void) {

    const loadTexture = function () {
      return new Promise<THREE.Texture>((resolve) => {
        new THREE.TextureLoader().load(board, resolve)
      })
    }

    // function for create box experemental
    const createBox = async function() {
      // 70, 70 width cell 45
      const geometryBox = new THREE.BoxGeometry(500, 10, 500)
      geometryBox.translate(250, -10, 250)

      const boxMaterial = await loadTexture().then((_texture) => {
        type materials = THREE.MeshBasicMaterial | THREE.MeshStandardMaterial
        const cubeMaterialArray: materials[] = []

        const colorMaterial = new THREE.MeshBasicMaterial({color: 0x551111})
        const textureMaterial = new THREE.MeshStandardMaterial({
          color: 0xfffdfd,
          metalness: 0.4,
          roughness: 0.1,
          map: _texture,
        })

        cubeMaterialArray.push(colorMaterial)
        cubeMaterialArray.push(colorMaterial)
        cubeMaterialArray.push(textureMaterial)
        cubeMaterialArray.push(colorMaterial)
        cubeMaterialArray.push(colorMaterial)
        cubeMaterialArray.push(colorMaterial)

        return cubeMaterialArray
      })

      return Promise.resolve(new THREE.Mesh(geometryBox, boxMaterial))
    }

    // create box
    createBox().then((_chessTable) => {
      this.board = _chessTable
      _renderer(_chessTable)
    })
  }
}
