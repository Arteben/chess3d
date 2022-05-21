import {
  getCoordsStr as getCoords,
  cachingDecoratorSimple as cashFunc,
  getStringFromCoords,
} from '@/utils/usefull'

import {
  cellCoords,
  coordsMesh,
  playerStates,
  moverTypes,
 } from '@/types/common'

 import { ChessEngine } from '@/utils/chess-engine'

// calc interactive cells for current game states
const getAvailableMoveCoords = (_moves: string[]) => {
  const coords: cellCoords[] = []
  for (const move of _moves) {
    coords.push(getCoords(move))
  }
  return coords
}

export const getLighted = cashFunc(function(
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

export const getDisplayed = cashFunc(function(
  _playerState: playerStates,
  _that: ChessEngine
) {
  const displayed: coordsMesh[] = []

  if (_playerState == playerStates.none) {
    return displayed
  }

  const moves = _that.game.moves()
  let strMoves: string[]
  let coords: cellCoords[]

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
    case playerStates.promotionSearch: {
      const cells = _that.cells
      const line = cells.fieldMainLines
      const coutLineElements = cells.fieldMainLines.length
      const isWhite = _that.mover === moverTypes.white

      const addFigure = (_el: string, j: number) => {
        const piece = cells.field[_el][j].piece
        if (piece && piece.isWhite == isWhite) {
          if (piece.type != 'pawn' && piece.type != 'king') {
            displayed.push(cells.field[_el][j].frame)
          }
        }
      }

      for (const el of line) {
        for (let i = 0; i < coutLineElements; i++) {
          addFigure(el, i + 1)
        }
      }

      for (let i = 0; i < coutLineElements * 4; i++) {
        addFigure(cells.stockElements, i)
      }
      break
    }
  }
  return displayed
})

