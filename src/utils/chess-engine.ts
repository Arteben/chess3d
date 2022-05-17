import * as jsChessEngine from 'js-chess-engine'
import { Cells } from '@/utils/cells'
import { Piece } from '@/utils/piece'
import {
  getCoordsStr as getCoords,
  cachingDecoratorSimple as cashFunc,
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

enum gameStates { unStarted, turnwhite, turnblack, finished }

enum playerTypes { white, black }

enum playerStates { pieceSearch, cuptureMove, none }

type listMoves = string[]
interface moves {
  [index: string]: listMoves[]
}

// helped methods
const getAvailableCoords = (_moves: moves) => {
  const coords: cellCoards[] = []
  for (const move of Object.keys(_moves)) {
    coords.push(getCoords(move))
  }
  return coords
}

const getDisplayed = cashFunc(function(
  _isTurn: boolean,
  _playerState: playerStates,
  _that: ChessEngine
) {
  const displayCoords: coordsMesh[] = []

  if (_isTurn && (_playerState == playerStates.none)) {
    const availableCoords = getAvailableCoords(_that.game.moves())
    for (const coords of availableCoords) {
      displayCoords.push(_that.cells.field[coords.i][coords.j].frame)
    }
  }
  return displayCoords
})
//
export class ChessEngine {
  game: jsChessEngine.Game
  cells: Cells
  levelAI: 2

  gameState: gameStates

  playerType: playerTypes
  playerState: playerStates

  selectedCell: cellCoards | null

  get interCells() :coordsMesh[] {
    return getDisplayed(this.isPlayerTurn, this.playerState, this)
  }

  get isPlayerTurn() :boolean {
      const typePlayer = playerTypes[this.playerType]
      return String(gameStates[this.gameState]).includes(typePlayer)
  }

  // events
  onClickEvent () {
    if (this.selectedCell && this.playerState == playerStates.none) {
      this.cells.selectCell(this.selectedCell, 'captured')
      this.playerState = playerStates.cuptureMove
    } else {
      this.selectedCell = null
      this.playerState = playerStates.none
    }
  }

  onSelectCell (_i?: string, _j?: number) {
      this.selectedCell = null

      if (!(_i)) return

      this.selectedCell = <cellCoards> {
        i: <string>_i,
        j: <number>_j,
      }
      this.cells.selectCell(this.selectedCell, 'selected')
      // switch (_playerState) {
      //   case  playerStates.none:
      //     _cells.selectCell(this.selectedCell, 'selected')
      // }
  }

  // other methods
  getConf() {
    return <gameConf>this.game.board.configuration
  }

  start() {
    this.gameState = gameStates.turnwhite
  }

  constructor (_cells: Cells) {
    // this.cells = _cells
    this.game = new jsChessEngine.Game()
    this.gameState = gameStates.unStarted
    this.playerType = playerTypes.white
    this.playerState = playerStates.none
    this.selectedCell = null
    this.cells = _cells
  }
}
