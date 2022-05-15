import * as THREE from 'three'
import * as jsChessEngine from 'js-chess-engine'
import { Cells } from '@/utils/cells'
import { Piece } from '@/utils/piece'
import { cellCoards, pieces } from '@/types/common'

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

export class ChessEngine {
  game: jsChessEngine.Game
  cells: Cells
  player: string
  level: 2

  getConf() {
    return <gameConf>this.game.board.configuration
  }

  start() {
    console.log('start game!')
    const conf = this.getConf()

    const getCoords = (_str: string) => {
      return <cellCoards>{
        i: _str[0],
        j: Number(_str[1]),
      }
    }

    const getAvailableCoords = (_moves: moves) => {
      const coords: cellCoards[] = []
      for (const move of Object.keys(_moves)) {
        coords.push(getCoords(move))
      }
      return coords
    }

    if (conf.isFinished) {
      console.log('game finished')
      return
    }

    if (this.player == conf.turn) {
      this.cells.displayed = []
      const availableCoords = getAvailableCoords(this.game.moves())
      for (const coords of availableCoords) {
        this.cells.displayed.push(this.cells.field[coords.i][coords.j].frame)
      }
    }
  }

  constructor (_cells: Cells) {
    this.cells = _cells
    this.game = new jsChessEngine.Game()
    this.player = 'white'
  }
}
