
import * as THREE from 'three'
import { Piece } from '@/utils/piece'
export interface pos2d {
  x: number
  z: number
}

export interface pos3d {
  x: number
  y: number
  z: number
}

export interface cellCoords {
  i: string
  j: number
}

export interface coordsMesh extends THREE.Mesh {
  iCoord?: string
  jCoord?: number
}

export interface fieldCellType {
  center: pos3d
  sign: THREE.Mesh
  frame: coordsMesh
  piece?: Piece
}
export interface verticalRow {
  [index: number]: fieldCellType
}
export interface fieldCellsType {
  [index: string]: verticalRow
}

export interface BoardSizesType {
  prWidth: number
  prBegin: number
  prEnd: number
  beginField: pos2d
  endField: pos2d
  height: number
  mainLines: string[]
}

export type pieces = {[index: string]: string}

export enum moverTypes { white, black }

export enum playerStates { pieceSearch, cuptureMove, none, promotionSearch }
export interface castlingType {
  [index: string]: string[]
}

export interface importPieceInfo {
  isWhite: boolean
  type: string
}

export enum shortPieceBlackNames {
  'p' = 'pawn',
  'n' = 'horse',
  'b' = 'elephant',
  'r' = 'rook',
  'q' = 'queen',
  'k' = 'king'
}
