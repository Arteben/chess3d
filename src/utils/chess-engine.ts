import * as THREE from 'three'
import * as jsChessEngine from 'js-chess-engine'
import { Cells } from '@/utils/cells'
import { ChessField } from '@/utils/chess-field'
import {
  getCoordsStr as getCoords,
  getMeshCoords,
  getStringFromCoords,
  getPointerParams,
  importPiece,
} from '@/utils/usefull'

import {
  cellCoords,
  pieces,
  coordsMesh,
  moverTypes,
  playerStates,
  castlingType,
  pos2d,
} from '@/types/common'

import {
  getLighted,
  getDisplayed,
} from '@/utils/calc-displayed-cells'

import { Piece } from './piece'

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

  levelAI = 0
  mover: moverTypes
  playerType: moverTypes
  playerState: playerStates

  selectedCell: cellCoords | null
  cupturedCell: cellCoords | null
  promotionCell: cellCoords | null
  AIMoveCell: cellCoords | null

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

  // this.field.setGameState(this.state)
  get state() :string {
    let stateStr = ''

    const getPlayerStates = () => {
      switch (this.playerState) {
        case playerStates.pieceSearch:
          return 'select some piece on the field.'
        case playerStates.cuptureMove:
          return 'select some move in colored cells.'
        case playerStates.promotionSearch:
          return 'select some your color figure for put on the field.'
      }
    }

    if (this.getConf().isFinished) {
      if (this.getConf().checkMate) {
        stateStr = 'CHECKMATE!'
      } else {
        stateStr = 'STALEMATE!'
      }
    } else if (this.isPlayerTurn) {
      stateStr = 'Player, ' + getPlayerStates()
    } else {
      stateStr = 'Please, wait for AI do a move'
    }

    return stateStr
  }

  get hasFinished(): boolean {
    const isEmptyMoves = Object.keys(this.game.moves()).length == 0
    return this.getConf().isFinished || isEmptyMoves
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
          this.field.setGameState(this.state)
          this.selectedCell = null
          this.cells.selectCell(this.cupturedCell, 'captured')
          for (const meshCoord of this.lightedCells) {
            this.cells.selectCell(getMeshCoords(meshCoord), 'available')
          }
          break
        case playerStates.cuptureMove: {
          if (this.cupturedCell) {
            this.playerState = playerStates.none
            this.interCells.length
            this.goMove(this.cupturedCell, this.selectedCell, true).then((_isNexTurn = true) => {
              if (_isNexTurn) {
                this.playerState = playerStates.cuptureMove
                this.nextTurn()
              }
            })
          }
          break
        }
        case playerStates.promotionSearch: {
          if (this.selectedCell && this.promotionCell) {
            this.playerDoPromotion(this.selectedCell, this.promotionCell)
            this.promotionCell = null
            this.selectedCell = null
            this.nextTurn()
          }
        }
      }
    } else if (this.playerState == playerStates.cuptureMove) {
      this.hideCupturedMove()
      this.playerState = playerStates.pieceSearch
      this.field.setGameState(this.state)
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
    if (this.AIMoveCell) {
      this.cells.hideCell(this.AIMoveCell)
      this.AIMoveCell = null
    }
    this.field.render()
  }

  promotionPawn (_pawnCell: cellCoords, _move: cellCoords, _isPlayer: boolean) {
    this.selectedCell = null

    if (_isPlayer) {
      this.hideCupturedMove()
      this.playerState = playerStates.promotionSearch
      this.field.setGameState(this.state)
      this.promotionCell = _move
      this.cupturedCell = _move
      this.game.move(getStringFromCoords(_pawnCell), getStringFromCoords(_move))
    } else {
      this.promotionPawnAISetPiece(_move)
    }

    const pawnCell = this.cells.field[_pawnCell.i][_pawnCell.j]
    const piece = pawnCell.piece
      if (piece) {
        const stockPosition = this.cells.addToStock(piece)
        piece.setPosition({x: stockPosition.x, z: stockPosition.z})
        this.field.render()
        pawnCell.piece = undefined
      }

    if (!_isPlayer) {
      this.nextTurn()
    }
  }

  playerDoPromotion(_piece: cellCoords, _move: cellCoords) {
    const oldPiece = this.cells.field[_piece.i][_piece.j].piece

    if (!oldPiece) {
      return
    }

    const moveCell = this.cells.field[_move.i][_move.j]
    const location = getStringFromCoords(_move)
    this.game.setPiece(location, oldPiece.symType)

    const posObj = <pos2d> {x: moveCell.center.x, z: moveCell.center.z}
    const render = () => { this.field.render() }
    moveCell.piece = new Piece(render,
            oldPiece.type, oldPiece.symType, posObj, this.field.scene, oldPiece.isWhite)
  }

  goMove(_piece: cellCoords, _move: cellCoords, _isDoGameMove: boolean, _isUsualMove = true): Promise<boolean>{
    return new Promise((_resolve) => {
      const {i: iPiece, j: jPiece} = _piece
      const {i: iMove, j: jMove} = _move
      const pieceCell = this.cells.field[iPiece][jPiece]
      const piece = pieceCell.piece
      const moveCell = this.cells.field[iMove][jMove]
      const moveCoords = moveCell.center
      const enemyPiece = moveCell.piece
      const strCrdMove = getStringFromCoords(_move)
      const strCrdPiece = getStringFromCoords(_piece)

      const isCastling = (_moveStr: string, _piceStr: string) => {
        const fullStr = _piceStr + _moveStr
        const allCastles = Object.keys(this.castling)
        return allCastles.includes(fullStr)
      }

      const isPromotionPawn = (_piece: Piece, _moveCoords: cellCoords) => {
        const linesCount = this.cells.fieldMainLines.length
        const isLastLine = _moveCoords.j == 1 || _moveCoords.j == linesCount
        return _piece.type == 'pawn' && isLastLine
      }

      if (_isUsualMove) {
        if (enemyPiece) {
          const stockPosition = this.cells.addToStock(enemyPiece)
          enemyPiece.setPosition({x: stockPosition.x, z: stockPosition.z})
        } else if (isCastling(strCrdMove, strCrdPiece)) {
          const castleMove = this.castling[strCrdPiece + strCrdMove]
          this.goMove(getCoords(castleMove[0]), getCoords(castleMove[1]), false, false)
          _resolve(true)
        } else if (piece && isPromotionPawn(piece, _move)) {
          this.promotionPawn(_piece, _move, _isDoGameMove)
          _resolve(false)
          return
        }
      }

      pieceCell.piece = undefined

      if (piece) {
        moveCell.piece = piece
        if (_isDoGameMove) {
          this.game.move(getStringFromCoords(_piece), getStringFromCoords(_move))
        }

        if (_isUsualMove) {
          this.animationSimpleMove(pieceCell.center, moveCoords, piece).then(() => {
            _resolve(true)
          })
        } else {
          piece.setPosition({x: moveCoords.x, z: moveCoords.z})
        }
      }
    })
  }

  animationSimpleMove (_from: pos2d, _to: pos2d, _piece: Piece) {
    return new Promise((_resolve) => {
      let counter = 1
      const maxLimit = 15
      const newPos: pos2d = {x: 0, z: 0}

      const oneXPercent = (_to.x - _from.x) / maxLimit
      const oneZPercent = (_to.z - _from.z) / maxLimit

      const getSize = (_counter, _from, _onePercent) => {
        return _from + _onePercent * _counter
      }

      const animate = () => {
        if (counter >= maxLimit) {
          _piece.setPosition({x: _to.x, z: _to.z})
          _resolve('ok')
        } else {
          newPos.x = getSize(counter, _from.x, oneXPercent)
          newPos.z = getSize(counter, _from.z, oneZPercent)
          _piece.setPosition({x: newPos.x, z: newPos.z})
          this.field.render()
          window.requestAnimationFrame(animate)
          counter++
        }
      }
      animate()
    })
  }

  nextTurn () {

    const clearSelectedPlayerPieces = () => {
      this.cells.hideAllowedCells(this)
      this.hideCupturedMove()
      this.playerState = playerStates.none
    }

    if (this.hasFinished) {
      clearSelectedPlayerPieces()
      this.field.setGameState(this.state)
      return
    }

    if (this.isPlayerTurn) {
      clearSelectedPlayerPieces()
      this.mover = this.nextMover
      this.turnAI()
    } else {
      this.mover = this.nextMover
      this.playerState = playerStates.pieceSearch
    }

    this.field.setGameState(this.state)
  }

  turnAI () {
    let moveForAI: moveIA

    try {
      moveForAI = <moveIA>this.game.aiMove(this.levelAI)
    } catch (_error) {
      this.nextTurn()
      return
    }

    this.field.setGameState(this.state)
    const piece = getCoords(Object.keys(moveForAI)[0])
    const move = getCoords(Object.values(moveForAI)[0])
    this.goMove(piece, move, false).then((_isNext: boolean) => {
      this.AIMoveCell = move
      this.cells.selectCell(this.AIMoveCell, 'aimove')
      if (_isNext) {
        this.nextTurn()
      }
    })
  }

  promotionPawnAISetPiece (_promotionCoords: cellCoords) {
    const strCell = getStringFromCoords(_promotionCoords)
    const pieces = this.getConf().pieces

    const render = () => { this.field.render() }
    const pieceInfo = importPiece(pieces[strCell])
    const promotionCell = this.cells.field[_promotionCoords.i][_promotionCoords.j]
    const posObj = <pos2d>{
      x: promotionCell.center.x,
      z: promotionCell.center.z,
    }
    promotionCell.piece = new Piece(render,
      pieceInfo.type, pieces[strCell], posObj, this.field.scene, pieceInfo.isWhite)
  }

  start(_typeStr: string, _isTopLevel: boolean, _initGame = false) {

    if (_initGame) {
      this.hideCupturedMove()
      this.setNewGamesParams()
      // recalc interCells & lighteCells
      this.interCells.length
      this.lightedCells.length
      this.cells.stockNumber = 0
    }

    const isWhite = moverTypes.white === moverTypes[_typeStr]
    this.levelAI = _isTopLevel && 4 || 0
    if (isWhite) {
      this.playerState = playerStates.pieceSearch
    } else {
      this.playerType = moverTypes.black
      this.turnAI()
    }
    this.field.setGameState(this.state)
  }

  setNewGamesParams () {
    this.game = new jsChessEngine.Game()

    this.mover = moverTypes.white
    this.playerType = moverTypes.white
    this.playerState = playerStates.none
    this.selectedCell = null
    this.cupturedCell = null
    this.promotionCell = null
    this.AIMoveCell = null
  }

  constructor (_chessField: ChessField, _cells: Cells, _castling: castlingType) {
    this.cells = _cells
    this.field = _chessField
    this.castling = _castling

    this.setNewGamesParams()
  }
}
