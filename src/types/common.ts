
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

export interface cellCoards {
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
  horsLine: string[]
  cellCountLine: number
}

export type pieces = {[index: string]: string}

export enum gameStates { unStarted, turns, finished }

export enum moverTypes { white, black }

export enum playerStates { pieceSearch, cuptureMove, none }

