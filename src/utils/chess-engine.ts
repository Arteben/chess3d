import * as jsChessEngine from 'js-chess-engine'
import { Cells } from '@/utils/cells'
import {
  getCoordsStr as getCoords,
  cachingDecoratorSimple as cashFunc,
  getMeshCoords,
} from '@/utils/usefull'
import { cellCoards, pieces, coordsMesh } from '@/types/common'

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

enum gameStates { unStarted, turns, finished }

enum moverTypes { white, black }

enum playerStates { pieceSearch, cuptureMove, none }

// calc interactive cells for current game states
const getAvailableMoveCoords = (_moves: string[]) => {
  const coords: cellCoards[] = []
  for (const move of _moves) {
    coords.push(getCoords(move))
  }
  return coords
}

const getStringFromCoords = (_coords: cellCoards) => {
  return `${_coords.i}${_coords.j}`
}

const getLighted = cashFunc(function(
  _playerState: playerStates,
  _that: ChessEngine
) {
  const displayed: coordsMesh[] = []

  if (_that.playerState !== playerStates.cuptureMove) {
    return displayed
  }

  if (_that.cupturedCell) {
    const strMove = getStringFromCoords(_that.cupturedCell)
    const coords = getAvailableMoveCoords(_that.game.moves()[strMove])
    for (const coordObj of coords) {
      displayed.push(_that.cells.field[coordObj.i][coordObj.j].frame)
    }
  }
  return displayed
})

const getDisplayed = cashFunc(function(
  _playerState: playerStates,
  _that: ChessEngine
) {
  const displayed: coordsMesh[] = []

  if (_playerState == playerStates.none) {
    return displayed
  }

  const moves = _that.game.moves()
  let strMoves: string[]
  let coords: cellCoards[]

  switch (_playerState) {
    case playerStates.pieceSearch:
      strMoves = Object.keys(moves)
      coords = getAvailableMoveCoords(strMoves)
      for (const coordObj of coords) {
        displayed.push(_that.cells.field[coordObj.i][coordObj.j].frame)
      }
    break
    case playerStates.cuptureMove:
      displayed.push(..._that.lightedCells)
    break
  }
  return displayed
})
//
export class ChessEngine {
  game: jsChessEngine.Game
  cells: Cells
  levelAI: 0

  gameState: gameStates

  mover: moverTypes

  playerType: moverTypes
  playerState: playerStates

  selectedCell: cellCoards | null

  cupturedCell: cellCoards | null

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
  onClickEvent () {
    if (this.selectedCell) {
      switch (this.playerState) {
        case playerStates.pieceSearch:
          this.cupturedCell = {...this.selectedCell}
          this.playerState = playerStates.cuptureMove
          this.cells.selectCell(this.cupturedCell, 'captured')
          for (const meshCoord of this.lightedCells) {
            this.cells.selectCell(getMeshCoords(meshCoord), 'available')
          }
          break
        case playerStates.cuptureMove: {
          if (this.cupturedCell) {
            this.goMove(this.cupturedCell, this.selectedCell)
            this.nextTurn()
          }
        }
      }
    } else if (this.playerState == playerStates.cuptureMove) {
      this.hideCupturedMove()
      this.playerState = playerStates.pieceSearch
    }
  }

  onSelectCell (_i: string, _j: number) {
    this.selectedCell = <cellCoards> {
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

  goMove(_piece: cellCoards, _move: cellCoards, _isMove = true) {
    const {i: iPiece, j: jPiece} = _piece
    const {i: iMove, j: jMove} = _move
    const pieceCell = this.cells.field[iPiece][jPiece]
    const piece = pieceCell.piece
    pieceCell.piece = undefined
    const moveCell = this.cells.field[iMove][jMove]
    const moveCoords = moveCell.center
    const enemyPiece = moveCell.piece

    if (enemyPiece) {
      enemyPiece.setPosition({x: 20, z: 20})
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

  start() {
    this.gameState = gameStates.turns
    this.playerState = playerStates.pieceSearch
  }

  constructor (_cells: Cells) {
    this.game = new jsChessEngine.Game()
    this.gameState = gameStates.unStarted
    this.mover = moverTypes.white
    this.playerType = moverTypes.white
    this.playerState = playerStates.none
    this.selectedCell = null
    this.cupturedCell = null
    this.cells = _cells
  }
}
