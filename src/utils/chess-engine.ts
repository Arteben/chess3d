import * as THREE from 'three'
import * as jsChessEngine from 'js-chess-engine'
import { Cells } from '@/utils/cells'
import { ChessField } from '@/utils/chess-field'
import {
  getCoordsStr as getCoords,
  getMeshCoords,
  getStringFromCoords,
  getPointerParams,
} from '@/utils/usefull'

import {
  cellCoords,
  pieces,
  coordsMesh,
  gameStates,
  moverTypes,
  playerStates,
  castlingType,
} from '@/types/common'

import {
  getLighted,
  getDisplayed,
} from '@/utils/calc-displayed-cells'
interface castling {
  blackLong: boolean
  blackShort: boolean
  whiteLong: boolean
  whiteShort: boolean
}

interface gameConf {
  castling: castling
  check: boolean
  checkMate: boolean
  enPassant: any | null
  fullMove: number
  halfMove: number
  isFinished: boolean
  pieces: pieces
  turn: 'white' | 'black'
}

type listMoves = string[]
interface moves {
  [index: string]: listMoves[]
}
interface moveIA {
  [index: string]: string
}
//
export class ChessEngine {

  game: jsChessEngine.Game
  raycaster = new THREE.Raycaster()
  pointer = new THREE.Vector2()
  cells: Cells
  field: ChessField
  castling: castlingType

  levelAI: 0
  gameState: gameStates
  mover: moverTypes
  playerType: moverTypes
  playerState: playerStates

  selectedCell: cellCoords | null
  cupturedCell: cellCoords | null

  get interCells() :coordsMesh[] {
    return getDisplayed(this.playerState, this)
  }

  get lightedCells() :coordsMesh[] {
    return getLighted(this.playerState, this)
  }

  get isPlayerTurn() :boolean {
    return this.playerType === this.mover
  }

  get nextMover() :moverTypes {
    if (this.mover == moverTypes.white) {
      return moverTypes.black
    } else {
      return moverTypes.white
    }
  }

  // events
  onMoveEvents (_event: MouseEvent) {
    if (this.interCells.length) {

      const pointer = this.pointer
      const raycaster = this.raycaster
      const field = this.field

      const pointerParams = getPointerParams(_event, field.canvas, field.canvasW, field.canvasH)
      pointer.set(pointerParams.x, pointerParams.y)
      raycaster.setFromCamera(pointer, field.cam)
      const intersects = raycaster.intersectObjects(this.interCells, false)
      this.cells.hideAllowedCells(this)
      if (intersects.length > 0) {
        const object = <coordsMesh>intersects[0].object
        this.onSelectCell(<string>object.iCoord, <number>object.jCoord)
      }
    }
  }

  onClickEvent () {
    if (this.selectedCell) {
      switch (this.playerState) {
        case playerStates.pieceSearch:
          this.cupturedCell = {...this.selectedCell}
          this.playerState = playerStates.cuptureMove
          this.selectedCell = null
          this.cells.selectCell(this.cupturedCell, 'captured')
          for (const meshCoord of this.lightedCells) {
            this.cells.selectCell(getMeshCoords(meshCoord), 'available')
          }
          break
        case playerStates.cuptureMove: {
          if (this.cupturedCell) {
            this.goMove(this.cupturedCell, this.selectedCell, true)
            this.nextTurn()
          }
        }
      }
    } else if (this.playerState == playerStates.cuptureMove) {
      this.hideCupturedMove()
      this.playerState = playerStates.pieceSearch
      this.interCells.length
    }
  }
  //

  onSelectCell (_i: string, _j: number) {
    this.selectedCell = <cellCoords> {
      i: <string>_i,
      j: <number>_j,
    }
    this.cells.selectCell(this.selectedCell, 'selected')
  }

  // other methods
  getConf() {
    return <gameConf>this.game.board.configuration
  }

  hideCupturedMove () {
    for (const meshCoord of this.lightedCells) {
      this.cells.hideCell(getMeshCoords(meshCoord), false)
    }
    if (this.cupturedCell) {
      this.cells.hideCell(this.cupturedCell)
      this.cupturedCell = null
    }
  }

  goMove(_piece: cellCoords, _move: cellCoords, _isMove: boolean, _isUsualMove = true) {
    const {i: iPiece, j: jPiece} = _piece
    const {i: iMove, j: jMove} = _move
    const pieceCell = this.cells.field[iPiece][jPiece]
    const piece = pieceCell.piece
    const moveCell = this.cells.field[iMove][jMove]
    const moveCoords = moveCell.center
    const enemyPiece = moveCell.piece
    const strCrdMove = getStringFromCoords(_move)
    const strCrdPiece = getStringFromCoords(_piece)

    pieceCell.piece = undefined

    const isCastling = (_moveStr: string, _piceStr: string) => {
      const fullStr = _piceStr + _moveStr
      const allCastles = Object.keys(this.castling)
      return allCastles.includes(fullStr)
    }

    if (_isUsualMove) {
      if (enemyPiece) {
        const stockPosition = this.cells.addToStock(enemyPiece)
        enemyPiece.setPosition({x: stockPosition.x, z: stockPosition.z})
      } else if (isCastling(strCrdMove, strCrdPiece)) {
        const castleMove = this.castling[strCrdPiece + strCrdMove]
        this.goMove(getCoords(castleMove[0]), getCoords(castleMove[1]), false, false)
      }
    }

    if (piece) {
      moveCell.piece = piece
      if (_isMove) {
        this.game.move(getStringFromCoords(_piece), getStringFromCoords(_move))
      }
      piece.setPosition({x: moveCoords.x, z: moveCoords.z})
    }
  }

  nextTurn () {
    if (this.isPlayerTurn) {
      this.cells.hideAllowedCells(this)
      this.hideCupturedMove()
      this.mover = this.nextMover
      this.playerState = playerStates.none
      this.turnAI()
    } else {
      this.mover = this.nextMover
      this.playerState = playerStates.pieceSearch
    }
  }

  turnAI () {
    const moveForAI = <moveIA>this.game.aiMove(this.levelAI)
    const piece = getCoords(Object.keys(moveForAI)[0])
    const move = getCoords(Object.values(moveForAI)[0])
    this.goMove(piece, move, false)
    this.nextTurn()
  }

  start(_typeStr: string, _initGame = false) {

    if (_initGame) {
      this.hideCupturedMove()
      this.setNewGamesParams()
      // recalc interCells & lighteCells
      this.interCells.length
      this.lightedCells.length
      this.cells.stockNumber = 0
    }

    this.gameState = gameStates.turns
    const isWhite = moverTypes.white === moverTypes[_typeStr]
    if (isWhite) {
      this.playerState = playerStates.pieceSearch
    } else {
      this.playerType = moverTypes.black
      this.turnAI()
    }
  }

  setNewGamesParams () {
    this.game = new jsChessEngine.Game()
    this.gameState = gameStates.unStarted
    this.mover = moverTypes.white
    this.playerType = moverTypes.white
    this.playerState = playerStates.none
    this.selectedCell = null
    this.cupturedCell = null
  }

  constructor (_chessField: ChessField, _cells: Cells, _castling: castlingType) {
    this.cells = _cells
    this.field = _chessField
    this.castling = _castling

    this.setNewGamesParams()
  }
}
