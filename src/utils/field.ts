
import * as THREE from 'three'
import { Piece } from '@/utils/piece'
import stone from '@/assets/stone.jpg'

import pawn from '@/assets/pieces/pawn.gltf'
import horse from '@/assets/pieces/horse.gltf'
import king from '@/assets/pieces/king.gltf'
import elephant from '@/assets/pieces/elephant.gltf'
import queen from '@/assets/pieces/queen.gltf'

export class ChessField {
  camera: THREE.Camera
  scene: THREE.Scene
  renderer: THREE.WebGLRenderer
  chessTable: THREE.Mesh

  constructor (_el: HTMLElement = document.body, _innerWidth = 300, _innerHeight = 300) {

    this.camera = new THREE.PerspectiveCamera(10, 1, 1, 10000)
    this.camera.position.set(600, 2000, 0)
    this.camera.lookAt(0, 0, 0)
    this.camera.rotateZ(Math.PI/2)

    this.camera.position.z = 900
    this.camera.rotateX(Math.PI * 1.87)

    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0xddf0f0)

    const light = new THREE.AmbientLight(0xaaaaaa)
    this.scene.add(light)
    const spotLight = new THREE.SpotLight(0xdddddd, 1)
    spotLight.position.set( 0, 0, 10000)
    this.scene.add(spotLight)

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(_innerWidth, _innerHeight)
    _el.appendChild(this.renderer.domElement)

    // this.renderer.setAnimationLoop((time) => {
    //   this.renderer.render(this.scene, this.camera)
    // })

    // function for create box experemental
    const createBox = async function() {
      const geometryBox = new THREE.BoxGeometry(500, 500, 10)
      geometryBox.translate(0, 0, -10)

      const loadTexture = function () {
        return new Promise<THREE.Texture>((resolve) => {
          new THREE.TextureLoader().load(stone, resolve)
        })
      }

      const boxMaterial = await loadTexture().then((_texture) => {
        return new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            map: _texture,
          })
      })

      return Promise.resolve(new THREE.Mesh(geometryBox, boxMaterial))
    }
    // create box
    createBox().then((_chessTable) => {
      _chessTable.position.z = -2
      this.scene.add(_chessTable)
      this.renderer.render(this.scene, this.camera)
    })

    const renderer = (_piece: THREE.Mesh) => {
      this.scene.add(_piece)
      this.renderer.render(this.scene, this.camera)
    }

    const addNewPiece = (x: number, y:number, _type: string, _isWhite?: boolean) => {
      const pos = {x, y}
        new Piece(renderer, _type, pos, _isWhite)
    }

    addNewPiece(10, 100, pawn, true)
    addNewPiece(0, -100, pawn)
    addNewPiece(122, -100, horse, true)
    addNewPiece(30, 190, horse)
    addNewPiece(10, 30, queen, true)
    addNewPiece(-80, -170, queen)
    addNewPiece(70, -30, king, true)
    addNewPiece(-50, 200, king)
    addNewPiece(70, 100, elephant, true)
    addNewPiece(60, -140, elephant)
  }
}
